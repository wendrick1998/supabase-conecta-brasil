
import React from 'react';
import { MessageCircle } from 'lucide-react';
import { TooltipProvider, Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface ConversationPreviewProps {
  message: string;
  leadName: string;
  onClick: (e: React.MouseEvent) => void;
}

const ConversationPreview: React.FC<ConversationPreviewProps> = ({ 
  message, 
  leadName,
  onClick 
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div 
            className="mt-3 p-2 rounded-md bg-gray-50 hover:bg-gray-100 flex items-center justify-between cursor-pointer transition-colors"
            onClick={onClick}
            aria-label={`Ver conversa com ${leadName}`}
          >
            <p className="text-sm text-gray-700 truncate pr-2">{message}</p>
            <MessageCircle className="h-4 w-4 text-gray-500 flex-shrink-0" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Ver conversa com {leadName}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ConversationPreview;
