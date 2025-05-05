
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
  
  const { 
    isRecording,
    isPaused,
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

  // Log state changes for debugging
  useEffect(() => {
    console.log('RecordingDialog state:', { 
      open, 
      mediaType, 
      isRecording, 
      isPaused, 
      recordedMedia: !!recordedMedia 
    });
  }, [open, mediaType, isRecording, isPaused, recordedMedia]);

  const closeDialog = () => {
    console.log('Closing recording dialog');
    stopMediaStream();
    resetRecording();
    onOpenChange(false);
  };

  const handleSaveRecording = () => {
    if (recordedMedia && recordedMedia.blob) {
      console.log('Saving recorded media:', recordedMedia);
      const file = new File([recordedMedia.blob], recordedMedia.fileName, {
        type: recordedMedia.blob.type
      });
      
      onSave(file, mediaType);
      closeDialog();
    } else {
      console.error('Attempted to save recording but no valid media found');
    }
  };

  const handleReset = () => {
    console.log('Resetting recording');
    resetRecording();
  };

  const handlePauseRecording = () => {
    if (isRecording && !isPaused) {
      console.log('Pausing recording');
      pauseRecording();
    }
  };

  const handleResumeRecording = () => {
    if (isPaused) {
      console.log('Resuming recording');
      resumeRecording();
    }
  };

  // Reset state when dialog opens or closes
  useEffect(() => {
    if (open) {
      console.log('Recording dialog opened');
      resetRecording();
      setRecordingTime(0);
    } else {
      stopMediaStream();
    }
  }, [open, resetRecording, stopMediaStream]);

  return {
    isPaused,
    isRecording,
    isInitializing,
    initError,
    recordingTime,
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
