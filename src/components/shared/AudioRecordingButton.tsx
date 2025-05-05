
import React, { useEffect } from 'react';
import { useAudioRecording, RecordedAudio } from '@/hooks/useAudioRecording';
import IdleButton from './audio/IdleButton';
import RecordingState from './audio/RecordingState';
import LockedRecording from './audio/LockedRecording';
import AudioPreview from './audio/AudioPreview';

interface AudioRecordingButtonProps {
  onAudioCaptured?: (audio: RecordedAudio) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const AudioRecordingButton: React.FC<AudioRecordingButtonProps> = ({ 
  onAudioCaptured,
  size = 'md',
  className 
}) => {
  const {
    isRecording,
    isLocked,
    recordingTime,
    recordedAudio,
    dragDirection,
    buttonRef,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useAudioRecording();

  // Handle audio capture
  useEffect(() => {
    if (recordedAudio && onAudioCaptured) {
      onAudioCaptured(recordedAudio);
    }
  }, [recordedAudio, onAudioCaptured]);

  // Handle sending the audio (same as resetting in this case)
  const handleSendAudio = () => {
    // Audio already captured by the effect above
    resetRecording();
  };

  // Prevent accidental touch scrolling when recording
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (isRecording) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => {
      document.removeEventListener('touchmove', preventDefault);
    };
  }, [isRecording]);
  
  // Clean up recording if component unmounts
  useEffect(() => {
    return () => {
      if (isRecording) {
        cancelRecording();
      }
    };
  }, [isRecording, cancelRecording]);
  
  // Render the appropriate UI based on recording state
  if (isLocked) {
    return (
      <LockedRecording 
        recordingTime={recordingTime}
        onStopRecording={stopRecording}
        onCancelRecording={cancelRecording}
        size={size}
        className={className}
      />
    );
  }

  if (isRecording) {
    return (
      <RecordingState
        recordingTime={recordingTime}
        dragDirection={dragDirection}
        buttonRef={buttonRef}
        size={size}
        className={className}
        handlePointerDown={handlePointerDown}
        handlePointerMove={handlePointerMove}
        handlePointerUp={handlePointerUp}
      />
    );
  }

  if (recordedAudio) {
    return (
      <AudioPreview
        audioUrl={recordedAudio.url}
        onDiscard={resetRecording}
        onSend={handleSendAudio}
      />
    );
  }

  // Default idle state
  return (
    <IdleButton
      buttonRef={buttonRef}
      size={size}
      className={className}
      onClick={startRecording}
    />
  );
};

export default AudioRecordingButton;
