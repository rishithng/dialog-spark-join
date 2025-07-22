interface ChatMessageProps {
  username: string;
  message: string;
  timestamp: string;
  isOwn: boolean;
}

export const ChatMessage = ({ username, message, timestamp, isOwn }: ChatMessageProps) => {
  return (
    <div className={`message-slide-in p-3 rounded-sm mb-2 ${
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
      </div>
      <div className="text-foreground break-words">
        {message}
      </div>
    </div>
  );
};