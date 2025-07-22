import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Smile, Paperclip, Mic } from 'lucide-react';

interface InteractiveChatInputProps {
  onSendMessage: (message: string) => void;
  onTypingStart: () => void;
  onTypingStop: () => void;
  disabled?: boolean;
}

export const InteractiveChatInput = ({ onSendMessage, onTypingStart, onTypingStop, disabled }: InteractiveChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const emojis = ['😀', '😂', '❤️', '👍', '👎', '😍', '😢', '😮', '😡', '🤔', '👋', '🎉', '🔥', '💯', '⚡', '🚀'];

  // Typing indicator logic
  useEffect(() => {
    if (message.length > 0 && !isTyping) {
      setIsTyping(true);
      onTypingStart();
    } else if (message.length === 0 && isTyping) {
      setIsTyping(false);
      onTypingStop();
    }

    const timer = setTimeout(() => {
      if (isTyping) {
        setIsTyping(false);
        onTypingStop();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [message, isTyping, onTypingStart, onTypingStop]);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      setIsTyping(false);
      onTypingStop();
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const commandSuggestions = [
    '/help - Show available commands',
    '/clear - Clear chat history',
    '/users - Show active users',
    '/status - Set your status'
  ];

  const showCommands = message.startsWith('/');

  return (
    <div className="relative">
      {/* Command suggestions */}
      {showCommands && (
        <div className="absolute bottom-full left-0 right-0 bg-card border border-border rounded-t-lg p-2 max-h-32 overflow-y-auto">
          <div className="text-xs text-muted-foreground mb-1">Commands:</div>
          {commandSuggestions
            .filter(cmd => cmd.toLowerCase().includes(message.toLowerCase()))
            .map((cmd, index) => (
              <div 
                key={index}
                onClick={() => setMessage(cmd.split(' ')[0] + ' ')}
                className="text-sm p-1 hover:bg-secondary rounded cursor-pointer"
              >
                <span className="text-terminal-green">{cmd.split(' ')[0]}</span>
                <span className="text-muted-foreground"> {cmd.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
        </div>
      )}

      {/* Emoji picker */}
      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 bg-card border border-border rounded-lg p-3 shadow-lg">
          <div className="grid grid-cols-8 gap-2 max-w-64">
            {emojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => addEmoji(emoji)}
                className="w-8 h-8 rounded hover:bg-secondary flex items-center justify-center transition-all hover:scale-110"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2 p-4 bg-card border-t border-border">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="text-muted-foreground hover:text-foreground"
          >
            <Smile className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message... (use / for commands)"
            disabled={disabled}
            className="bg-input border-border font-mono pr-12"
          />
          {isTyping && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-terminal-green text-xs">
              typing...
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button 
            onClick={handleSend}
            disabled={disabled || !message.trim()}
            variant="default"
            size="icon"
            className="bg-primary hover:bg-primary/90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};