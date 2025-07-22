import { useState, useRef, useEffect } from 'react';
import { InteractiveChatMessage } from './InteractiveChatMessage';
import { InteractiveChatInput } from './InteractiveChatInput';
import { TypingIndicator } from './TypingIndicator';
import { UserStatus } from './UserStatus';
import { Button } from '@/components/ui/button';
import { Terminal, Users, Volume2, VolumeX, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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
  onLeaveChat: () => void;
}

export const ChatRoom = ({ username, onLeaveChat }: ChatRoomProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      username: 'System',
      message: `Welcome to Unix Chat Terminal, ${username}!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: false,
      status: 'delivered',
      reactions: []
    }
  ]);
  
  const [users, setUsers] = useState<User[]>([
    { username: 'System', status: 'online' },
    { username, status: 'online' },
    { username: 'Alice', status: 'online' },
    { username: 'Bob', status: 'away' },
    { username: 'Charlie', status: 'offline', lastSeen: '2 hours ago' }
  ]);
  
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const handleSendMessage = (message: string) => {
    // Handle commands
    if (message.startsWith('/')) {
      handleCommand(message);
      return;
    }

    const newMessage: Message = {
      id: Date.now().toString(),
      username,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      status: 'sending',
      reactions: []
    };
    
    setMessages(prev => [...prev, newMessage]);

    // Simulate message status updates
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'sent' as const } : msg
      ));
    }, 500);

    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === newMessage.id ? { ...msg, status: 'delivered' as const } : msg
      ));
    }, 1000);
    
    // Simulate incoming messages from other users
    if (Math.random() > 0.6) {
      // Show typing indicator first
      const otherUsers = users.filter(u => u.username !== username && u.username !== 'System' && u.status === 'online');
      if (otherUsers.length > 0) {
        const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
        setTypingUsers([randomUser.username]);

        setTimeout(() => {
          setTypingUsers([]);
          
          const responses = [
            "That's interesting!",
            "I agree with that",
            "Working on some Unix magic ✨",
            "This terminal chat is so cool!",
            "Anyone know good Linux resources?",
            "Great point! 👍",
            "I'm learning so much here",
            "Terminal life is the best life"
          ];
          
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          
          const incomingMessage: Message = {
            id: (Date.now() + Math.random()).toString(),
            username: randomUser.username,
            message: randomResponse,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: false,
            status: 'delivered',
            reactions: []
          };
          
          setMessages(prev => [...prev, incomingMessage]);
          playNotificationSound();
          
          // Show toast notification
          toast({
            title: `New message from ${randomUser.username}`,
            description: randomResponse.length > 50 ? randomResponse.substring(0, 50) + '...' : randomResponse,
          });
        }, 1500 + Math.random() * 2000);
      }
    }
  };

  const handleCommand = (command: string) => {
    const [cmd, ...args] = command.split(' ');
    
    switch (cmd) {
      case '/help':
        addSystemMessage('Available commands: /help, /clear, /users, /status [online|away|busy]');
        break;
      case '/clear':
        setMessages([]);
        addSystemMessage('Chat history cleared');
        break;
      case '/users':
        const userList = users.map(u => `${u.username} (${u.status})`).join(', ');
        addSystemMessage(`Active users: ${userList}`);
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
    setMessages(prev => [...prev, systemMessage]);
  };

  const handleReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="h-6 w-6 text-terminal-green" />
          <h1 className="text-xl font-bold text-terminal-green">Unix Interactive Chat</h1>
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
        <main className="flex-1 flex flex-col">
          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="flex flex-col">
              {messages.map((msg) => (
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
              ))}
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
        <aside className="w-64 bg-card border-l border-border p-4">
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