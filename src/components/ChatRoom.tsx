import { useState, useRef, useEffect } from 'react';
import { InteractiveChatMessage } from './InteractiveChatMessage';
import { InteractiveChatInput } from './InteractiveChatInput';
import { TypingIndicator } from './TypingIndicator';
import { UserStatus } from './UserStatus';
import { Button } from '@/components/ui/button';
import { Terminal, Users, Volume2, VolumeX, Settings, Copy, Check, Wifi, WifiOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRealTimeChat } from '@/hooks/useRealTimeChat';
import type { ChatMessage } from '@/lib/supabase';

interface MessageReaction {
  emoji: string;
  count: number;
  hasReacted: boolean;
}

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  reactions?: MessageReaction[];
}

interface User {
  username: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  lastSeen?: string;
}

interface ChatRoomProps {
  username: string;
  roomCode: string | null;
  onLeaveChat: () => void;
}

export const ChatRoom = ({ username, roomCode, onLeaveChat }: ChatRoomProps) => {
  const { toast } = useToast();
  
  // Real-time chat hook
  const { 
    messages: realTimeMessages, 
    isConnected, 
    isLoading, 
    sendMessage: sendRealTimeMessage,
    createRoom 
  } = useRealTimeChat({
    username,
    roomCode,
    onNewMessage: (message) => {
      playNotificationSound();
      toast({
        title: `New message from ${message.username}`,
        description: message.message.length > 50 ? message.message.substring(0, 50) + '...' : message.message,
      });
    }
  });

  // Convert real-time messages to local format
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  
  useEffect(() => {
    const converted = realTimeMessages.map(msg => ({
      id: msg.id || Date.now().toString(),
      username: msg.username,
      message: msg.message,
      timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: msg.username === username,
      status: 'delivered' as const,
      reactions: []
    }));
    
    // Add welcome message if no messages exist
    if (converted.length === 0) {
      converted.unshift({
        id: 'welcome',
        username: 'System',
        message: `Welcome to Unix Chat Terminal, ${username}! ${isConnected ? 'Connected to real-time chat.' : 'Offline mode.'}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isOwn: false,
        status: 'delivered',
        reactions: []
      });
    }
    
    setLocalMessages(converted);
  }, [realTimeMessages, username, isConnected]);
  
  const [users, setUsers] = useState<User[]>([
    { username: 'System', status: 'online' },
    { username, status: 'online' },
    { username: 'Alice', status: 'online' },
    { username: 'Bob', status: 'away' },
    { username: 'Charlie', status: 'offline', lastSeen: '2 hours ago' }
  ]);
  
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [localMessages]);

  const playNotificationSound = () => {
    if (soundEnabled) {
      // Simulate sound with visual effect
      document.body.classList.add('sound-effect');
      setTimeout(() => document.body.classList.remove('sound-effect'), 300);
    }
  };

  const handleTypingStart = () => {
    // In a real app, this would send a typing indicator to the server
  };

  const handleTypingStop = () => {
    // In a real app, this would stop the typing indicator
  };

  const handleSendMessage = async (message: string) => {
    // Handle commands
    if (message.startsWith('/')) {
      handleCommand(message);
      return;
    }

    // Send via real-time chat
    await sendRealTimeMessage(message);
  };

  const handleCommand = (command: string) => {
    const [cmd, ...args] = command.split(' ');
    
    switch (cmd) {
      case '/help':
        addSystemMessage('Available commands: /help, /clear, /users, /status [online|away|busy]');
        break;
      case '/clear':
        setLocalMessages([]);
        addSystemMessage('Chat history cleared');
        break;
      case '/users':
        const userList = users.map(u => `${u.username} (${u.status})`).join(', ');
        addSystemMessage(`Active users: ${userList}. ${isConnected ? 'Real-time connected' : 'Offline mode'}`);
        break;
      case '/status':
        const newStatus = args[0] as 'online' | 'away' | 'busy';
        if (['online', 'away', 'busy'].includes(newStatus)) {
          setUsers(prev => prev.map(u => 
            u.username === username ? { ...u, status: newStatus } : u
          ));
          addSystemMessage(`Status changed to ${newStatus}`);
        } else {
          addSystemMessage('Usage: /status [online|away|busy]');
        }
        break;
      default:
        addSystemMessage(`Unknown command: ${cmd}. Type /help for available commands.`);
    }
  };

  const addSystemMessage = (message: string) => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      username: 'System',
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: false,
      status: 'delivered',
      reactions: []
    };
    setLocalMessages(prev => [...prev, systemMessage]);
  };

  const copyRoomCode = async () => {
    if (roomCode) {
      try {
        await navigator.clipboard.writeText(roomCode);
        setCopied(true);
        toast({
          title: "Room code copied!",
          description: "Share this code with others to invite them to the room.",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast({
          title: "Failed to copy",
          description: "Could not copy room code to clipboard.",
          variant: "destructive",
        });
      }
    }
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setLocalMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions?.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.hasReacted ? r.count - 1 : r.count + 1, hasReacted: !r.hasReacted }
                : r
            ).filter(r => r.count > 0)
          };
        } else {
          return {
            ...msg,
            reactions: [...(msg.reactions || []), { emoji, count: 1, hasReacted: true }]
          };
        }
      }
      return msg;
    }));
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative">
      <div className="matrix-bg"></div>
      <div className="code-rain"></div>
      {/* Header */}
      <header className="bg-card/80 backdrop-blur-sm border-b border-border p-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Terminal className="h-6 w-6 text-terminal-green animate-pulse-glow cyber-glow" />
            <div>
              <h1 className="text-xl font-bold gradient-text animate-gradient-flow">Unix Real-Time Chat</h1>
              <div className="flex items-center gap-3 text-sm">
                {roomCode && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <span>Room: {roomCode}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyRoomCode}
                      className="h-6 w-6 p-0 text-terminal-green hover:text-terminal-green-bright transition-colors"
                    >
                      {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    </Button>
                  </div>
                )}
                <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                  isConnected 
                    ? 'bg-terminal-green/20 text-terminal-green' 
                    : 'bg-destructive/20 text-destructive'
                }`}>
                  {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
                  {isConnected ? 'Connected' : 'Offline'}
                </div>
              </div>
            </div>
          </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{users.filter(u => u.status !== 'offline').length} users online</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="text-muted-foreground hover:text-foreground"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onLeaveChat}
            className="border-border hover:bg-secondary"
          >
            Leave Chat
          </Button>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Main chat area */}
        <main className="flex-1 flex flex-col relative z-10">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="flex flex-col">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-terminal-green animate-pulse">Loading chat history...</div>
                </div>
              ) : (
                localMessages.map((msg) => (
                  <InteractiveChatMessage
                    key={msg.id}
                    id={msg.id}
                    username={msg.username}
                    message={msg.message}
                    timestamp={msg.timestamp}
                    isOwn={msg.isOwn}
                    status={msg.status}
                    reactions={msg.reactions}
                    onReact={handleReaction}
                  />
                ))
              )}
              <TypingIndicator usernames={typingUsers} />
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <InteractiveChatInput 
            onSendMessage={handleSendMessage}
            onTypingStart={handleTypingStart}
            onTypingStop={handleTypingStop}
          />
        </main>

        {/* Active users sidebar */}
        <aside className="w-64 bg-card/80 backdrop-blur-sm border-l border-border p-4 relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-terminal-green flex items-center gap-2">
              <Users className="h-5 w-5" />
              Users ({users.length})
            </h3>
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {users.map((user) => (
              <UserStatus
                key={user.username}
                username={user.username}
                status={user.status}
                lastSeen={user.lastSeen}
                isCurrentUser={user.username === username}
              />
            ))}
          </div>
          
          {/* Quick actions */}
          <div className="mt-6 pt-4 border-t border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Quick Actions</h4>
            <div className="space-y-1">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handleSendMessage('/help')}
              >
                View Commands
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => handleSendMessage('/users')}
              >
                List All Users
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};