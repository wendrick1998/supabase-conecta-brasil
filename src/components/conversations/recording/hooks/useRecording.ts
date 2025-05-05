
import { useCallback, useEffect, useState } from 'react';
import { toast } from '@/components/ui/sonner';
import { useMediaStream } from './useMediaStream';
import { useMediaRecorder } from './useMediaRecorder';
import { MediaType } from '../types';

interface UseRecordingProps {
  mediaType: MediaType;
  onStop?: () => void;
}

export const useRecording = ({ mediaType, onStop }: UseRecordingProps) => {
  const [browserSupport, setBrowserSupport] = useState<boolean | null>(null);
  
  const { 
    stream, 
    isInitializing,
    initError,
    requestMediaStream, 
    stopMediaStream 
  } = useMediaStream({ 
    mediaType 
  });
  
  const { 
    isRecording,
    isPaused,
    recordingTime,
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

  // Check browser compatibility on mount
  useEffect(() => {
    const isMediaRecorderSupported = 'MediaRecorder' in window;
    const isUserMediaSupported = 'getUserMedia' in (navigator.mediaDevices || {});
    const isSupported = isMediaRecorderSupported && isUserMediaSupported;
    
    console.log('Browser support check:', {
      MediaRecorder: isMediaRecorderSupported,
      getUserMedia: isUserMediaSupported,
      isSupported
    });
    
    setBrowserSupport(isSupported);
    
    if (!isSupported) {
      toast.error('Seu navegador não suporta gravação de áudio/vídeo');
    }
  }, []);

  const handleStartRecording = useCallback(async () => {
    if (!browserSupport) {
      toast.error('Seu navegador não suporta gravação');
      return;
    }
    
    console.log('Starting recording process for mediaType:', mediaType);
    try {
      const mediaStream = await requestMediaStream();
      if (mediaStream) {
        console.log('Stream acquired successfully, starting recorder');
        startRecording(mediaStream);
      } else {
        console.error('Failed to get media stream');
        toast.error('Não foi possível acessar o microfone');
      }
    } catch (error) {
      console.error('Error in handleStartRecording:', error);
      toast.error('Erro ao iniciar gravação');
    }
  }, [browserSupport, requestMediaStream, startRecording, mediaType]);

  const handleStopRecording = useCallback(() => {
    console.log('Handling stop recording');
    stopRecording();
    if (mediaType === 'photo') {
      stopMediaStream();
    }
  }, [stopRecording, stopMediaStream, mediaType]);

  const resetRecording = useCallback(() => {
    console.log('Resetting recording completely');
    resetRecorderState();
    stopMediaStream();
  }, [resetRecorderState, stopMediaStream]);

  return {
    isRecording,
    isPaused,
    isInitializing,
    initError,
    recordingTime,
    recordedMedia,
    stream,
    browserSupport,
    startRecording: handleStartRecording,
    stopRecording: handleStopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording,
    stopMediaStream
  };
};

export type { MediaType } from '../types';
