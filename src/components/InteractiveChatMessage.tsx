import { useState } from 'react';
import { Heart, Smile, ThumbsUp, Zap } from 'lucide-react';

interface MessageReaction {
  emoji: string;
  count: number;
  hasReacted: boolean;
}

interface InteractiveChatMessageProps {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: MessageReaction[];
  onReact?: (messageId: string, emoji: string) => void;
}

const reactionEmojis = [
  { emoji: '👍', icon: ThumbsUp },
  { emoji: '❤️', icon: Heart },
  { emoji: '😄', icon: Smile },
  { emoji: '⚡', icon: Zap },
];

export const InteractiveChatMessage = ({ 
  id, 
  username, 
  message, 
  timestamp, 
  isOwn, 
  status = 'sent',
  reactions = [],
  onReact 
}: InteractiveChatMessageProps) => {
  const [showReactions, setShowReactions] = useState(false);

  const handleReaction = (emoji: string) => {
    onReact?.(id, emoji);
    setShowReactions(false);
  };

  const getStatusIndicator = () => {
    switch (status) {
      case 'sending':
        return <div className="w-2 h-2 rounded-full bg-muted-foreground animate-pulse" />;
      case 'sent':
        return <div className="w-2 h-2 rounded-full bg-terminal-green-dim" />;
      case 'delivered':
        return <div className="w-2 h-2 rounded-full bg-terminal-green" />;
      case 'read':
        return <div className="w-2 h-2 rounded-full bg-terminal-green-bright" />;
      default:
        return null;
    }
  };

  return (
    <div className={`message-slide-in p-3 rounded-sm mb-2 relative group ${
      isOwn 
        ? 'bg-message-own ml-8 self-end' 
        : 'bg-message-other mr-8 self-start'
    }`}>
      <div className="flex items-baseline gap-2 mb-1">
        <span className="font-bold text-terminal-green-bright">
          [{username}]
        </span>
        <span className="text-xs text-timestamp">
          {timestamp}
        </span>
        {isOwn && (
          <div className="flex items-center gap-1 ml-auto">
            {getStatusIndicator()}
          </div>
        )}
      </div>
      
      <div className="text-foreground break-words">
        {message}
      </div>

      {/* Message reactions */}
      {reactions.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {reactions.map((reaction, index) => (
            <button
              key={index}
              onClick={() => handleReaction(reaction.emoji)}
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border transition-all ${
                reaction.hasReacted 
                  ? 'bg-terminal-green/20 border-terminal-green' 
                  : 'bg-secondary border-border hover:bg-terminal-green/10'
              }`}
            >
              <span className="reaction-bounce">{reaction.emoji}</span>
              <span>{reaction.count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Reaction picker */}
      <div className={`absolute ${isOwn ? 'left-0' : 'right-0'} top-0 transition-all duration-200 ${
        showReactions ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}>
        <div className="bg-card border border-border rounded-lg p-2 shadow-lg flex gap-1">
          {reactionEmojis.map(({ emoji, icon: Icon }) => (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className="w-8 h-8 rounded-full hover:bg-secondary flex items-center justify-center transition-all hover:scale-110"
            >
              <span className="text-sm">{emoji}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reaction trigger */}
      <button
        onClick={() => setShowReactions(!showReactions)}
        className={`absolute top-2 ${isOwn ? 'left-2' : 'right-2'} opacity-0 group-hover:opacity-100 transition-all duration-200 w-6 h-6 rounded-full bg-secondary hover:bg-terminal-green/20 flex items-center justify-center text-xs`}
      >
        +
      </button>
    </div>
  );
};