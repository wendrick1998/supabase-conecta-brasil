
import { useState, useEffect } from 'react';
import { useRecording, MediaType } from './useRecording';

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
    recordedMedia, 
    stream,
    startRecording, 
    stopRecording, 
    resetRecording,
    stopMediaStream,
    pauseRecording,
    resumeRecording
  } = useRecording({ 
    mediaType 
  });

  const closeDialog = () => {
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
      const file = new File([recordedMedia.blob], recordedMedia.fileName, {
        type: recordedMedia.blob.type
      });
      
      onSave(file, mediaType);
      closeDialog();
    }
  };

  const handleReset = () => {
    resetRecording();
    setIsPaused(false);
  };

  const handlePauseRecording = () => {
    if (isRecording) {
      pauseRecording();
      setIsPaused(true);
    }
  };

  const handleResumeRecording = () => {
    if (isPaused) {
      resumeRecording();
      setIsPaused(false);
    }
  };

  useEffect(() => {
    // Reset state when dialog opens
    if (open) {
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
    recordedMedia,
    stream,
    startRecording,
    stopRecording,
    handlePauseRecording,
    handleResumeRecording,
    handleReset,
    handleSaveRecording,
    closeDialog
  };
};
