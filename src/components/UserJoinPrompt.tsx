import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Terminal, Users, Hash, Plus } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface UserJoinPromptProps {
  onJoinChat: (username: string, roomCode?: string) => void;
}

const generateRoomCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

export const UserJoinPrompt = ({ onJoinChat }: UserJoinPromptProps) => {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      const newRoomCode = generateRoomCode();
      setGeneratedCode(newRoomCode);
      onJoinChat(username.trim(), newRoomCode);
    }
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() && roomCode.trim()) {
      onJoinChat(username.trim(), roomCode.trim().toUpperCase());
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 relative">
      <div className="matrix-bg"></div>
      <div className="code-rain"></div>
      
      <div className="w-full max-w-lg space-y-6 animate-slide-up">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <Terminal className="h-20 w-20 text-terminal-green animate-float" />
          </div>
          <h1 className="text-4xl font-bold text-terminal-green animate-glow">Unix Chat Terminal</h1>
          <p className="text-muted-foreground text-lg">Connect with others in real-time</p>
        </div>
        
        <Card className="bg-card/80 backdrop-blur-sm border-terminal-green/20 shadow-2xl animate-glow">
          <CardHeader>
            <CardTitle className="text-terminal-green flex items-center gap-2">
              <Users className="h-5 w-5" />
              Join the Network
            </CardTitle>
            <CardDescription>
              Create a new room or join an existing one using a room code
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 mb-6">
              <Input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-background/50 border-terminal-green/30 text-foreground placeholder:text-muted-foreground focus:border-terminal-green transition-all duration-300"
              />
            </div>

            <Tabs defaultValue="create" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-background/50">
                <TabsTrigger value="create" className="data-[state=active]:bg-terminal-green data-[state=active]:text-black">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Room
                </TabsTrigger>
                <TabsTrigger value="join" className="data-[state=active]:bg-terminal-green data-[state=active]:text-black">
                  <Hash className="h-4 w-4 mr-2" />
                  Join Room
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="create" className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Create a new chat room and get a code to share with others
                </p>
                <Button 
                  onClick={handleCreateRoom}
                  className="w-full bg-terminal-green hover:bg-terminal-green-bright text-black font-semibold transition-all duration-300 hover:scale-105"
                  disabled={!username.trim()}
                >
                  Create New Room
                </Button>
              </TabsContent>
              
              <TabsContent value="join" className="space-y-4">
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Enter room code (e.g., ABC123)"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="bg-background/50 border-terminal-green/30 text-foreground placeholder:text-muted-foreground focus:border-terminal-green transition-all duration-300"
                    maxLength={6}
                  />
                  <p className="text-sm text-muted-foreground">
                    Enter the 6-character room code shared by the room creator
                  </p>
                </div>
                <Button 
                  onClick={handleJoinRoom}
                  className="w-full bg-terminal-green hover:bg-terminal-green-bright text-black font-semibold transition-all duration-300 hover:scale-105"
                  disabled={!username.trim() || !roomCode.trim()}
                >
                  Join Room
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};