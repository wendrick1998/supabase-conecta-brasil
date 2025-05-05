
import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';
import { MediaType } from '../types';

interface UseMediaStreamProps {
  mediaType: MediaType;
}

export const useMediaStream = ({ mediaType }: UseMediaStreamProps) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const stopMediaStream = useCallback(() => {
    console.log('Stopping media stream');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}`, track.readyState);
        track.stop();
      });
      streamRef.current = null;
      setStream(null);
    }
  }, []);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopMediaStream();
    };
  }, [stopMediaStream]);

  const requestMediaStream = useCallback(async () => {
    try {
      setIsInitializing(true);
      setInitError(null);
      let constraints;
      
      console.log(`Requesting media stream for type: ${mediaType}`);
      
      if (mediaType === 'photo') {
        constraints = { video: true };
      } else {
        constraints = {
          audio: true,
          video: mediaType === 'video'
        };
      }

      // Stop any existing stream
      stopMediaStream();
      
      console.log('Requesting media permissions with constraints:', constraints);
      
      // Request media permissions
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('Media stream obtained:', mediaStream);
      console.log('Tracks:', mediaStream.getTracks().map(t => `${t.kind}: ${t.label}`));
      
      streamRef.current = mediaStream;
      setStream(mediaStream);
      
      return mediaStream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setInitError(errorMessage);
      toast.error('Erro ao acessar dispositivos de mídia');
      return null;
    } finally {
      setIsInitializing(false);
    }
  }, [mediaType, stopMediaStream]);

  return {
    stream,
    streamRef,
    isInitializing,
    initError,
    requestMediaStream,
    stopMediaStream
  };
};
