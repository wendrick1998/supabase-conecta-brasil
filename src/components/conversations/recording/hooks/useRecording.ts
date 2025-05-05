
import { useCallback } from 'react';
import { useMediaStream } from './useMediaStream';
import { useMediaRecorder } from './useMediaRecorder';
import { MediaType } from '../types';

interface UseRecordingProps {
  mediaType: MediaType;
  onStop?: () => void;
}

export const useRecording = ({ mediaType, onStop }: UseRecordingProps) => {
  const { stream, requestMediaStream, stopMediaStream } = useMediaStream({ 
    mediaType 
  });
  
  const { 
    isRecording,
    isPaused,
    recordedMedia,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording: resetRecorderState
  } = useMediaRecorder({ 
    mediaType,
    onRecordingComplete: onStop
  });

  const handleStartRecording = useCallback(async () => {
    const mediaStream = await requestMediaStream();
    if (mediaStream) {
      startRecording(mediaStream);
    }
  }, [requestMediaStream, startRecording]);

  const handleStopRecording = useCallback(() => {
    stopRecording();
    if (mediaType === 'photo') {
      stopMediaStream();
    }
  }, [stopRecording, stopMediaStream, mediaType]);

  const resetRecording = useCallback(() => {
    resetRecorderState();
    stopMediaStream();
  }, [resetRecorderState, stopMediaStream]);

  return {
    isRecording,
    isPaused,
    recordedMedia,
    stream,
    startRecording: handleStartRecording,
    stopRecording: handleStopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    stopMediaStream
  };
};

export type { MediaType } from '../types';
