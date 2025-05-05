
import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import ActionsMenu from './input/ActionsMenu';
import NoteButton from './input/NoteButton';
import SendButton from './input/SendButton';
import AudioRecordButton from './input/AudioRecordButton';
import CameraButton from './input/CameraButton';

interface MessageInputProps {
  onSend: (message: string) => void;
  onFileUpload: () => void;
  onAddNote: () => void;
  onOpenRecordingModal: (type: 'audio' | 'video' | 'photo') => void;
  onGalleryUpload: () => void;
  isLoading: boolean;
}

const MessageInput = ({ 
  onSend, 
  onFileUpload, 
  onAddNote, 
  onOpenRecordingModal,
  onGalleryUpload,
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

  const handleOpenAudioRecording = () => {
    console.log('Opening audio recording modal');
    onOpenRecordingModal('audio');
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
          {/* Audio Recording Button */}
          <AudioRecordButton 
            onClick={handleOpenAudioRecording} 
          />

          {/* File Attachment Button */}
          <ActionsMenu 
            onFileUpload={onFileUpload}
          />

          {/* Camera Button (Direct action) */}
          <CameraButton 
            onAttachFromGallery={onGalleryUpload}
          />

          {/* Note Button */}
          <NoteButton 
            onAddNote={onAddNote}
            disabled={isLoading}
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
