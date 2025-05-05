
import React from 'react';
import { toast } from '@/components/ui/sonner';
import AudioRecordButton from './AudioRecordButton';

interface RecordingButtonProps {
  onRecordAudio?: (file: File) => void;
  isRecording?: boolean;
}

const RecordingButton = ({ 
  onRecordAudio,
  isRecording = false 
}: RecordingButtonProps) => {
  const handleClick = () => {
    if (onRecordAudio) {
      try {
        // Just trigger the dialog opening via parent component
        // The actual recording happens in the dialog
      } catch (error) {
        console.error("Error accessing microphone:", error);
        toast.error("Não foi possível acessar o microfone");
      }
    }
  };

  return (
    <>
      {onRecordAudio && (
        <AudioRecordButton 
          onClick={handleClick}
        />
      )}
    </>
  );
};

export default RecordingButton;
