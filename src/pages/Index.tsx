import { useState } from 'react';
import { UserJoinPrompt } from '@/components/UserJoinPrompt';
import { ChatRoom } from '@/components/ChatRoom';

const Index = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [isInChat, setIsInChat] = useState(false);

  const handleJoinChat = (newUsername: string, newRoomCode?: string) => {
    setUsername(newUsername);
    setRoomCode(newRoomCode || 'GLOBAL'); // Default to GLOBAL room if no code provided
    setIsInChat(true);
  };

  const handleLeaveChat = () => {
    setUsername(null);
    setRoomCode(null);
    setIsInChat(false);
  };

  if (!isInChat || !username) {
    return <UserJoinPrompt onJoinChat={handleJoinChat} />;
  }

  return <ChatRoom username={username} roomCode={roomCode} onLeaveChat={handleLeaveChat} />;
};

export default Index;
