
import { useRef, useEffect } from 'react';
import { MediaType } from '../types';

interface UseMediaStreamProps {
  mediaType: MediaType;
}

export const useMediaStream = ({ mediaType }: UseMediaStreamProps) => {
  const streamRef = useRef<MediaStream | null>(null);
  
  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopMediaStream();
    };
  }, []);

  const requestMediaStream = async () => {
    try {
      let constraints;
      
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
      
      // Request media permissions
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      return null;
    }
  };

  return {
    stream: streamRef.current,
    requestMediaStream,
    stopMediaStream
  };
};
