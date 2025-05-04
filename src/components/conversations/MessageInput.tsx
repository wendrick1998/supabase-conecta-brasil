
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, FileText, Loader2, Mic, Video } from 'lucide-react';
import { 
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';

interface MessageInputProps {
  onSend: (message: string) => void;
  onFileUpload: () => void;
  onAddNote: () => void;
  onRecordAudio?: () => void;
  onRecordVideo?: () => void;
  isLoading: boolean;
}

const MessageInput = ({ 
  onSend, 
  onFileUpload, 
  onAddNote, 
  onRecordAudio, 
  onRecordVideo,
  isLoading 
}: MessageInputProps) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t sticky bottom-0 bg-white">
      <Textarea
        placeholder="Digite sua mensagem..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[80px] mb-2 resize-none"
        autoFocus
      />
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                title="Anexar arquivo ou mídia"
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
                {onRecordAudio && (
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={onRecordAudio}
                  >
                    <Mic className="h-4 w-4 mr-2" />
                    <span>Gravar áudio</span>
                  </Button>
                )}
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

          <Button
            variant="outline"
            size="sm"
            onClick={onAddNote}
            className="flex items-center"
          >
            <FileText className="h-4 w-4 mr-2" />
            <span>Nota interna</span>
          </Button>
        </div>
        
        <Button
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default MessageInput;
