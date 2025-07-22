import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Button } from '@/components/ui/button';
import { Terminal, Users } from 'lucide-react';

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

interface ChatRoomProps {
  username: string;
  onLeaveChat: () => void;
}

export const ChatRoom = ({ username, onLeaveChat }: ChatRoomProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      username: 'System',
      message: `Welcome to Unix Chat Terminal, ${username}!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: false
    }
  ]);
  
  const [activeUsers] = useState(['System', username, 'Alice', 'Bob']);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = (message: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      username,
      message,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate incoming messages from other users occasionally
    if (Math.random() > 0.7) {
      setTimeout(() => {
        const responses = [
          "Nice to meet you!",
          "How's everyone doing?",
          "Working on some cool Unix projects",
          "This terminal chat is pretty neat",
          "Anyone else coding today?"
        ];
        
        const otherUsers = activeUsers.filter(u => u !== username && u !== 'System');
        const randomUser = otherUsers[Math.floor(Math.random() * otherUsers.length)];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const incomingMessage: Message = {
          id: (Date.now() + 1).toString(),
          username: randomUser,
          message: randomResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: false
        };
        
        setMessages(prev => [...prev, incomingMessage]);
      }, 1000 + Math.random() * 2000);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Terminal className="h-6 w-6 text-terminal-green" />
          <h1 className="text-xl font-bold text-terminal-green">Unix Chat Terminal</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{activeUsers.length} users online</span>
          </div>
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
                <ChatMessage
                  key={msg.id}
                  username={msg.username}
                  message={msg.message}
                  timestamp={msg.timestamp}
                  isOwn={msg.isOwn}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input area */}
          <ChatInput onSendMessage={handleSendMessage} />
        </main>

        {/* Active users sidebar */}
        <aside className="w-64 bg-card border-l border-border p-4">
          <h3 className="text-lg font-semibold text-terminal-green mb-4 flex items-center gap-2">
            <Users className="h-5 w-5" />
            Active Users
          </h3>
          <div className="space-y-2">
            {activeUsers.map((user) => (
              <div 
                key={user}
                className={`p-2 rounded text-sm ${
                  user === username 
                    ? 'bg-terminal-green/20 text-terminal-green-bright' 
                    : 'text-muted-foreground'
                }`}
              >
                {user === username ? `${user} (you)` : user}
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
};