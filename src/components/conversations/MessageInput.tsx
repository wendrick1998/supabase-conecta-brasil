
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import ActionsMenu from './input/ActionsMenu';
import NoteButton from './input/NoteButton';
import SendButton from './input/SendButton';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';

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
  const [showAudioRecording, setShowAudioRecording] = useState(false);
  
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

  const handleOpenAudioRecording = () => {
    if (onRecordAudio) {
      setShowAudioRecording(true);
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
          {/* Simple Audio Button */}
          {onRecordAudio && (
            <Button
              variant="outline"
              size="icon"
              onClick={handleOpenAudioRecording}
              className="hover:bg-blue-50"
              title="Gravar áudio"
            >
              <Mic className="h-4 w-4" />
            </Button>
          )}

          {/* Actions Menu */}
          <ActionsMenu 
            onFileUpload={onFileUpload}
            onStartRecording={handleOpenAudioRecording}
            onRecordVideo={onRecordVideo}
          />

          {/* Note Button */}
          <NoteButton 
            onAddNote={onAddNote}
          />
        </div>
        
        {/* Send Button */}
        <SendButton 
          onClick={handleSend}
          disabled={!message.trim() || isLoading}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default MessageInput;
