
import React from 'react';
import { differenceInMinutes, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ConversationWaitingTimeProps {
  timestamp: string;
  isViewed: boolean;
}

const ConversationWaitingTime: React.FC<ConversationWaitingTimeProps> = ({
  timestamp,
  isViewed,
}) => {
  // If message is viewed, show "Visualizado" badge
  if (isViewed) {
    return (
      <Badge className="bg-gray-200 text-gray-700 px-2 py-0.5 text-xs font-medium">
        Visualizado
      </Badge>
    );
  }

  // Calculate waiting time based on timestamp
  const minutesWaiting = differenceInMinutes(
    new Date(),
    parseISO(timestamp)
  );

  // Determine styling based on waiting time
  if (minutesWaiting < 5) {
    return (
      <Badge className="bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">
        Esperando há {minutesWaiting}min
      </Badge>
    );
  } else if (minutesWaiting < 30) {
    return (
      <Badge className="bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-medium">
        Esperando há {minutesWaiting}min
      </Badge>
    );
  } else {
    return (
      <Badge className="bg-red-100 text-red-800 px-2 py-0.5 text-xs font-medium">
        Esperando há {minutesWaiting}min
      </Badge>
    );
  }
};

export default ConversationWaitingTime;
