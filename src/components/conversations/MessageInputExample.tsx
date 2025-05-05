
import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SendHorizontal, PlusCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import AudioRecordingButton from '@/components/shared/AudioRecordingButton';

interface MessageInputExampleProps {
  onSendMessage?: (text: string) => void;
  onSendAudio?: (audio: { blob: Blob; url: string; duration: number }) => void;
  placeholder?: string;
  className?: string;
}

const MessageInputExample: React.FC<MessageInputExampleProps> = ({
  onSendMessage,
  onSendAudio,
  placeholder = 'Digite uma mensagem...',
  className
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && onSendMessage) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (inputValue.trim()) {
        handleSubmit(e);
      }
    }
  };

  const handleAudioCaptured = (audio: { url: string; blob: Blob; duration: number }) => {
    setIsRecording(false);
    if (onSendAudio) {
      onSendAudio(audio);
    }
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className={cn("flex items-end gap-2 bg-white p-3 border-t", className)}
    >
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="flex-shrink-0 text-gray-500 hover:text-gray-700"
      >
        <PlusCircle className="h-5 w-5" />
      </Button>
      
      <div className="flex-grow relative">
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="min-h-[60px] max-h-[150px] resize-none pr-10"
          disabled={isRecording}
        />
      </div>
      
      <div className="flex-shrink-0 flex items-center">
        {!isRecording && inputValue.trim() ? (
          <Button 
            type="submit" 
            size="icon"
            className="bg-pink-500 hover:bg-pink-600 text-white"
          >
            <SendHorizontal className="h-5 w-5" />
          </Button>
        ) : (
          <AudioRecordingButton
            onAudioCaptured={handleAudioCaptured}
            size="md"
          />
        )}
      </div>
    </form>
  );
};

export default MessageInputExample;
