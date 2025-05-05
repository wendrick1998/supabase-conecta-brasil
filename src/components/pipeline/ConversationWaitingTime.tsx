import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { getMinutesElapsed, formatElapsedTime } from '@/utils/formatters';
interface ConversationWaitingTimeProps {
  timestamp: string;
  isViewed: boolean;
}
const ConversationWaitingTime: React.FC<ConversationWaitingTimeProps> = ({
  timestamp,
  isViewed
}) => {
  // If message is viewed, show "Visualizado" badge
  if (isViewed) {
    return <Badge className="text-gray-700 px-2 py-0.5 text-xs font-medium bg-cyan-300">
        Visualizado
      </Badge>;
  }

  // Calculate waiting time based on timestamp
  const minutesWaiting = getMinutesElapsed(timestamp);
  const formattedTime = formatElapsedTime(minutesWaiting);

  // Determine styling based on waiting time
  if (minutesWaiting < 10) {
    return <Badge className="bg-green-100 text-green-700 px-2 py-0.5 text-xs font-medium">
        Esperando há {formattedTime}
      </Badge>;
  } else if (minutesWaiting < 60) {
    return <Badge className="bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs font-medium">
        Esperando há {formattedTime}
      </Badge>;
  } else {
    return <Badge className="bg-red-100 text-red-800 px-2 py-0.5 text-xs font-medium">
        Esperando há {formattedTime}
      </Badge>;
  }
};
export default ConversationWaitingTime;