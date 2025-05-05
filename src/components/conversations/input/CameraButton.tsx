
import React from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CameraButtonProps {
  onAttachFromGallery: () => void;
}

const CameraButton: React.FC<CameraButtonProps> = ({ onAttachFromGallery }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onAttachFromGallery}
            aria-label="Anexar foto ou vídeo"
            className="hover:bg-blue-50"
          >
            <Camera className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Anexar foto ou vídeo</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default CameraButton;
