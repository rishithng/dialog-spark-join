import { useState } from 'react';
import { UserJoinPrompt } from '@/components/UserJoinPrompt';
import { ChatRoom } from '@/components/ChatRoom';

const Index = () => {
  const [username, setUsername] = useState<string | null>(null);
  const [isInChat, setIsInChat] = useState(false);

  const handleJoinChat = (newUsername: string) => {
    setUsername(newUsername);
    setIsInChat(true);
  };

  const handleLeaveChat = () => {
    setUsername(null);
    setIsInChat(false);
  };

  if (!isInChat || !username) {
    return <UserJoinPrompt onJoinChat={handleJoinChat} />;
  }

  return <ChatRoom username={username} onLeaveChat={handleLeaveChat} />;
};

export default Index;
