
import React, { useState } from 'react';
import { Camera, ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface CameraButtonProps {
  onTakePhoto: () => void;
  onRecordVideo: () => void;
  onAttachFromGallery: () => void;
}

const CameraButton: React.FC<CameraButtonProps> = ({ 
  onTakePhoto,
  onRecordVideo,
  onAttachFromGallery
}) => {
  const [open, setOpen] = useState(false);

  return (
    <TooltipProvider>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                aria-label="Anexar foto ou vídeo"
                className="hover:bg-blue-50"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Anexar foto ou vídeo</p>
          </TooltipContent>
        </Tooltip>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => {
            setOpen(false);
            onTakePhoto();
          }} className="cursor-pointer">
            <Camera className="h-4 w-4 mr-2" />
            <span>Tirar foto</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            setOpen(false);
            onRecordVideo();
          }} className="cursor-pointer">
            <Video className="h-4 w-4 mr-2" />
            <span>Gravar vídeo</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => {
            setOpen(false);
            onAttachFromGallery();
          }} className="cursor-pointer">
            <ImageIcon className="h-4 w-4 mr-2" />
            <span>Escolher da galeria</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};

export default CameraButton;
