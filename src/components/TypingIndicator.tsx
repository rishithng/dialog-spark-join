interface TypingIndicatorProps {
  usernames: string[];
}

export const TypingIndicator = ({ usernames }: TypingIndicatorProps) => {
  if (usernames.length === 0) return null;

  const getTypingText = () => {
    if (usernames.length === 1) {
      return `${usernames[0]} is typing`;
    } else if (usernames.length === 2) {
      return `${usernames[0]} and ${usernames[1]} are typing`;
    } else {
      return `${usernames[0]} and ${usernames.length - 1} others are typing`;
    }
  };

  return (
    <div className="p-3 text-sm text-muted-foreground italic">
      <div className="flex items-center gap-2">
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-terminal-green-dim typing-animation" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-terminal-green-dim typing-animation" style={{ animationDelay: '0.2s' }} />
          <div className="w-2 h-2 rounded-full bg-terminal-green-dim typing-animation" style={{ animationDelay: '0.4s' }} />
        </div>
        <span>{getTypingText()}...</span>
      </div>
    </div>
  );
};