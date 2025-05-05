import React from 'react';
import { ChevronRight } from 'lucide-react';
import ConversationUnreadCount from './ConversationUnreadCount';
import ConversationWaitingTime from './ConversationWaitingTime';
interface ConversationFooterProps {
  dateString: string;
  conversation?: {
    timestamp: string;
    unreadCount: number;
    isViewed: boolean;
  };
}
const ConversationFooter: React.FC<ConversationFooterProps> = ({
  dateString,
  conversation
}) => {
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }).format(date);
    } catch (error) {
      return dateStr;
    }
  };
  return <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
      <span className="text-xs text-zinc-950">
        {formatDate(dateString)}
      </span>
      
      {/* Waiting indicators */}
      {conversation && <div className="flex items-center space-x-2">
          {/* Unread message count */}
          <ConversationUnreadCount count={conversation.unreadCount} />
          
          {/* Waiting time badge */}
          <ConversationWaitingTime timestamp={conversation.timestamp} isViewed={conversation.isViewed} />
        </div>}

      {!conversation && <ChevronRight className="h-3 w-3 text-gray-400" />}
    </div>;
};
export default ConversationFooter;