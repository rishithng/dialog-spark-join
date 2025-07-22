interface UserStatusProps {
  username: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  isCurrentUser?: boolean;
  lastSeen?: string;
}

export const UserStatus = ({ username, status, isCurrentUser, lastSeen }: UserStatusProps) => {
  const getStatusColor = () => {
    switch (status) {
      case 'online':
        return 'bg-terminal-green';
      case 'away':
        return 'bg-yellow-500';
      case 'busy':
        return 'bg-red-500';
      case 'offline':
        return 'bg-muted-foreground';
      default:
        return 'bg-muted-foreground';
    }
  };

  const getStatusText = () => {
    if (status === 'offline' && lastSeen) {
      return `Last seen ${lastSeen}`;
    }
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div className={`flex items-center gap-3 p-2 rounded transition-all ${
      isCurrentUser 
        ? 'bg-terminal-green/20 text-terminal-green-bright' 
        : 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
    }`}>
      <div className="relative">
        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center font-mono font-bold text-sm">
          {username.charAt(0).toUpperCase()}
        </div>
        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-card ${getStatusColor()} ${
          status === 'online' ? 'pulse-online' : ''
        }`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">
          {username}{isCurrentUser ? ' (you)' : ''}
        </div>
        <div className="text-xs text-muted-foreground">
          {getStatusText()}
        </div>
      </div>
    </div>
  );
};