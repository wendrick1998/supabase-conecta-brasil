
import { useState, useEffect } from 'react';
import { useRecording } from './hooks/useRecording';
import { MediaType } from './types';

interface UseRecordingDialogProps {
  open: boolean;
  mediaType: MediaType;
  onSave: (file: File, type: MediaType) => void;
  onOpenChange: (open: boolean) => void;
}

export const useRecordingDialog = ({
  open,
  mediaType,
  onSave,
  onOpenChange
}: UseRecordingDialogProps) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const { 
    isRecording,
    isInitializing,
    initError, 
    recordingTime: currentRecordingTime,
    recordedMedia, 
    stream,
    browserSupport,
    startRecording, 
    stopRecording, 
    resetRecording,
    stopMediaStream,
    pauseRecording,
    resumeRecording
  } = useRecording({ 
    mediaType 
  });

  // Update recording time from the hook
  useEffect(() => {
    setRecordingTime(currentRecordingTime);
  }, [currentRecordingTime]);

  const closeDialog = () => {
    console.log('Closing recording dialog');
    stopMediaStream();
    resetRecording();
    setIsPaused(false);
    onOpenChange(false);
  };

  const handleTimeUpdate = (seconds: number) => {
    setRecordingTime(seconds);
  };

  const handleSaveRecording = () => {
    if (recordedMedia && recordedMedia.blob) {
      console.log('Saving recorded media:', recordedMedia);
      const file = new File([recordedMedia.blob], recordedMedia.fileName, {
        type: recordedMedia.blob.type
      });
      
      onSave(file, mediaType);
      closeDialog();
    }
  };

  const handleReset = () => {
    console.log('Resetting recording');
    resetRecording();
    setIsPaused(false);
  };

  const handlePauseRecording = () => {
    if (isRecording) {
      console.log('Pausing recording');
      pauseRecording();
      setIsPaused(true);
    }
  };

  const handleResumeRecording = () => {
    if (isPaused) {
      console.log('Resuming recording');
      resumeRecording();
      setIsPaused(false);
    }
  };

  // Reset state when dialog opens or closes
  useEffect(() => {
    if (open) {
      console.log('Recording dialog opened');
      resetRecording();
      setRecordingTime(0);
      setIsPaused(false);
    } else {
      stopMediaStream();
    }
  }, [open, resetRecording, stopMediaStream]);

  return {
    recordingTime,
    isPaused,
    isRecording,
    isInitializing,
    initError,
    recordedMedia,
    stream,
    browserSupport,
    startRecording,
    stopRecording,
    handlePauseRecording,
    handleResumeRecording,
    handleReset,
    handleSaveRecording,
    closeDialog
  };
};
