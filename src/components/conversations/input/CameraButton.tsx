
import React, { useState } from 'react';
import { Camera, ImageIcon, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

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
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Capturar foto ou vídeo"
          aria-label="Capturar foto ou vídeo"
          className="hover:bg-blue-50"
        >
          <Camera className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
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
          <span>Anexar da galeria</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CameraButton;
