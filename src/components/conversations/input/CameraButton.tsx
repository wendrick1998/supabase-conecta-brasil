
import React, { useState } from 'react';
import { Camera, Image, Video, File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

interface CameraButtonProps {
  onAttachFromGallery: () => void;
}

const CameraButton: React.FC<CameraButtonProps> = ({ onAttachFromGallery }) => {
  const [open, setOpen] = useState(false);

  const handleGalleryClick = () => {
    setOpen(false);
    onAttachFromGallery();
  };

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
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuItem onClick={handleGalleryClick} className="cursor-pointer flex items-center justify-between py-3">
            <span>Fototeca</span>
            <Image className="h-5 w-5" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleGalleryClick} className="cursor-pointer flex items-center justify-between py-3">
            <span>Tirar Foto ou Gravar Vídeo</span>
            <Camera className="h-5 w-5" />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleGalleryClick} className="cursor-pointer flex items-center justify-between py-3">
            <span>Escolher Arquivo</span>
            <File className="h-5 w-5" />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TooltipProvider>
  );
};

export default CameraButton;
