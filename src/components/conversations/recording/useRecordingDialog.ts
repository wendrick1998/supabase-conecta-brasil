
import React, { useEffect } from 'react';
import useAudioRecorder from '@/hooks/useAudioRecorder';
import { MediaType } from './types';

interface UseRecordingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaType: MediaType;
  onSave: (file: File, type: MediaType) => void;
}

export function useRecordingDialog({
  open,
  onOpenChange,
  mediaType,
  onSave
}: UseRecordingDialogProps) {
  const {
    state,
    isRecording,
    isPaused,
    recordingTime,
    formattedTime,
    recordedAudio,
    audioLevel,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording
  } = useAudioRecorder({
    onComplete: (audio) => {
      console.log('Recording completed:', audio);
    }
  });

  // Handle closing dialog
  const handleCloseDialog = () => {
    if (isRecording || isPaused) {
      // Prevent closing while recording is active
      return;
    }
    resetRecording();
    onOpenChange(false);
  };

  // Handle saving the recording
  const handleSaveRecording = () => {
    if (recordedAudio) {
      const file = new File([recordedAudio.blob], recordedAudio.fileName, {
        type: 'audio/webm'
      });
      onSave(file, mediaType);
      resetRecording();
      onOpenChange(false);
    }
  };

  // Start recording when dialog opens
  useEffect(() => {
    if (open && state === 'idle' && mediaType === 'audio') {
      const timer = setTimeout(() => {
        startRecording();
      }, 500);
      return () => clearTimeout(timer);
    }
    
    // Cleanup when dialog closes
    if (!open && (isRecording || isPaused)) {
      resetRecording();
    }
  }, [open, state, mediaType, isRecording, isPaused, startRecording, resetRecording]);

  return {
    state,
    isRecording,
    isPaused,
    recordingTime,
    formattedTime,
    recordedAudio,
    audioLevel,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
    handleSaveRecording,
    handleCloseDialog
  };
}

export default useRecordingDialog;
