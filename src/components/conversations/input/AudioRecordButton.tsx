
import React from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AudioRecordButtonProps {
  onClick: () => void;
}

const AudioRecordButton: React.FC<AudioRecordButtonProps> = ({ onClick }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onClick}
            aria-label="Gravar áudio"
            className="hover:bg-blue-50 relative transition-transform active:scale-95"
          >
            <Mic className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Gravar mensagem de áudio</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default AudioRecordButton;
