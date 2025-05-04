
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Send, Paperclip, FileText, Loader2, Mic, Video } from 'lucide-react';
import { 
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import AudioRecordButton from './AudioRecordButton';
import { toast } from '@/components/ui/sonner';

interface MessageInputProps {
  onSend: (message: string) => void;
  onFileUpload: () => void;
  onAddNote: () => void;
  onRecordAudio?: (file: File) => void;
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
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);

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

  const startRecording = useCallback(async () => {
    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Initialize recorder
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
      toast.error("Não foi possível acessar o microfone");
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (!mediaRecorderRef.current || !isRecording) return;
    
    return new Promise<File>((resolve) => {
      mediaRecorderRef.current!.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioFile = new File(
          [audioBlob],
          `audio-${new Date().toISOString().replace(/:/g, '-')}.webm`,
          { type: 'audio/webm' }
        );
        
        // Stop all tracks
        mediaRecorderRef.current!
          .stream
          .getTracks()
          .forEach(track => track.stop());
        
        resolve(audioFile);
      };
      
      mediaRecorderRef.current!.stop();
      setIsRecording(false);
    });
  }, [isRecording]);

  const handleStopRecording = useCallback(async () => {
    if (!onRecordAudio) return;
    
    try {
      const audioFile = await stopRecording();
      if (audioFile) {
        onRecordAudio(audioFile);
        toast.success("Áudio enviado com sucesso");
      }
    } catch (error) {
      console.error("Error processing audio:", error);
      toast.error("Erro ao processar o áudio");
    }
  }, [onRecordAudio, stopRecording]);

  const handleCancelRecording = useCallback(() => {
    if (!mediaRecorderRef.current || !isRecording) return;
    
    // Stop all tracks without saving
    mediaRecorderRef.current
      .stream
      .getTracks()
      .forEach(track => track.stop());
    
    setIsRecording(false);
    toast.info("Gravação cancelada");
  }, [isRecording]);

  return (
    <div className="p-4 border-t sticky bottom-0 bg-white">
      <Textarea
        placeholder="Digite sua mensagem..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        className="min-h-[80px] mb-2 resize-none"
        autoFocus
        disabled={isRecording}
      />
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {/* Audio Recording Button */}
          {onRecordAudio && (
            <AudioRecordButton 
              onStartRecording={startRecording}
              onStopRecording={handleStopRecording}
              onCancelRecording={handleCancelRecording}
              isRecording={isRecording}
            />
          )}

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
                {onRecordAudio && (
                  <Button
                    variant="ghost"
                    className="justify-start"
                    onClick={startRecording}
                    disabled={isRecording}
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
            disabled={isRecording}
          >
            <FileText className="h-4 w-4 mr-2" />
            <span>Nota interna</span>
          </Button>
        </div>
        
        <Button
          onClick={handleSend}
          disabled={(!message.trim() && !isRecording) || isLoading}
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
