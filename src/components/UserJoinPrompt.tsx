import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Terminal } from 'lucide-react';

interface UserJoinPromptProps {
  onJoinChat: (username: string) => void;
}

export const UserJoinPrompt = ({ onJoinChat }: UserJoinPromptProps) => {
  const [username, setUsername] = useState('');

  const handleJoin = () => {
    if (username.trim()) {
      onJoinChat(username.trim());
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleJoin();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Terminal className="h-12 w-12 text-terminal-green" />
          </div>
          <CardTitle className="text-2xl font-bold text-terminal-green">
            Unix Chat Terminal
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            Enter your username to join the chat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter username..."
              className="bg-input border-border font-mono"
              autoFocus
            />
          </div>
          <Button 
            onClick={handleJoin}
            disabled={!username.trim()}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Join Chat
          </Button>
          <div className="text-xs text-muted-foreground text-center font-mono">
            <span className="terminal-cursor">Waiting for input</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};