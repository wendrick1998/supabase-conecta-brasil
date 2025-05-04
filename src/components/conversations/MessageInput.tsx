
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import RecordingButton from './input/RecordingButton';
import ActionsMenu from './input/ActionsMenu';
import NoteButton from './input/NoteButton';
import SendButton from './input/SendButton';

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

  // Audio button handlers now separated into RecordingButton component
  const handleStartRecording = () => {
    setIsRecording(true);
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
        disabled={isRecording}
      />
      
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {/* Audio Recording Button */}
          <RecordingButton 
            onRecordAudio={onRecordAudio}
            isRecording={isRecording}
          />

          {/* Actions Menu */}
          <ActionsMenu 
            onFileUpload={onFileUpload}
            onStartRecording={handleStartRecording}
            onRecordVideo={onRecordVideo}
            isRecording={isRecording}
          />

          {/* Note Button */}
          <NoteButton 
            onAddNote={onAddNote}
            disabled={isRecording}
          />
        </div>
        
        {/* Send Button */}
        <SendButton 
          onClick={handleSend}
          disabled={(!message.trim() && !isRecording) || isLoading}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default MessageInput;
