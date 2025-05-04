
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Paperclip, Mic, Video } from 'lucide-react';

interface ActionsMenuProps {
  onFileUpload: () => void;
  onStartRecording: () => void;
  onRecordVideo?: () => void;
  isRecording: boolean;
}

const ActionsMenu = ({ 
  onFileUpload, 
  onStartRecording, 
  onRecordVideo,
  isRecording 
}: ActionsMenuProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          title="Anexar arquivo ou mídia"
          disabled={isRecording}
        >
          <Paperclip className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="flex flex-col gap-2">
          <Button
            variant="ghost"
            className="justify-start"
            onClick={onFileUpload}
          >
            <Paperclip className="h-4 w-4 mr-2" />
            <span>Anexar arquivo</span>
          </Button>
          
          <Button
            variant="ghost"
            className="justify-start"
            onClick={onStartRecording}
            disabled={isRecording}
          >
            <Mic className="h-4 w-4 mr-2" />
            <span>Gravar áudio</span>
          </Button>
          
          {onRecordVideo && (
            <Button
              variant="ghost"
              className="justify-start"
              onClick={onRecordVideo}
            >
              <Video className="h-4 w-4 mr-2" />
              <span>Gravar vídeo</span>
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ActionsMenu;
