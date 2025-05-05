
import React, { useEffect } from 'react';
import { useAudioRecording } from '@/hooks/useAudioRecording';
import IdleButton from './audio/IdleButton';
import RecordingState from './audio/RecordingState';
import LockedRecording from './audio/LockedRecording';
import AudioPreview from './audio/AudioPreview';

interface AudioRecordingButtonProps {
  onAudioCaptured?: (audio: { url: string; blob: Blob; duration: number }) => void;
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
