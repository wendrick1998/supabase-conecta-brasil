
import React from 'react';

interface ConversationUnreadCountProps {
  count: number;
}

const ConversationUnreadCount: React.FC<ConversationUnreadCountProps> = ({ count }) => {
  if (count <= 0) return null;
  
  return (
    <div className="w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
      {count}
    </div>
  );
};

export default ConversationUnreadCount;
