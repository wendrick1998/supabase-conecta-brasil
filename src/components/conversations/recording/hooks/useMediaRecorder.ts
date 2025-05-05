
import { useState, useRef, useCallback } from 'react';
import { MediaType } from '../types';

interface UseMediaRecorderProps {
  mediaType: MediaType;
  onRecordingComplete?: () => void;
}

export const useMediaRecorder = ({ 
  mediaType, 
  onRecordingComplete 
}: UseMediaRecorderProps) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [recordedMedia, setRecordedMedia] = useState<{
    url: string;
    blob: Blob | null;
    fileName: string;
  } | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<BlobPart[]>([]);

  const startRecording = useCallback((stream: MediaStream) => {
    if (mediaType === 'photo') {
      // For photos, we just access the camera without recording
      setIsRecording(true);
      return;
    }
    
    // Reset chunks
    mediaChunksRef.current = [];
    
    // Create media recorder
    const mimeType = mediaType === 'audio' ? 'audio/webm' : 'video/webm';
    mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
    
    // Add data handler
    mediaRecorderRef.current.ondataavailable = (e) => {
      if (e.data.size > 0) {
        mediaChunksRef.current.push(e.data);
      }
    };
    
    // Handle recording stop
    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(mediaChunksRef.current, { type: mimeType });
      const url = URL.createObjectURL(blob);
      const fileName = `${mediaType}-${new Date().toISOString().replace(/:/g, '-')}.webm`;
      
      setRecordedMedia({
        url,
        blob,
        fileName
      });
      
      setIsRecording(false);
      setIsPaused(false);
      
      if (onRecordingComplete) onRecordingComplete();
    };
    
    // Start recording
    mediaRecorderRef.current.start();
    setIsRecording(true);
  }, [mediaType, onRecordingComplete]);

  const stopRecording = useCallback(() => {
    if (mediaType === 'photo') {
      setIsRecording(false);
      return;
    }
    
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  }, [isRecording, mediaType]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
    }
  }, []);

  const resetRecording = useCallback(() => {
    setIsRecording(false);
    setIsPaused(false);
    
    if (recordedMedia?.url) {
      URL.revokeObjectURL(recordedMedia.url);
    }
    
    setRecordedMedia(null);
  }, [recordedMedia]);

  return {
    isRecording,
    isPaused,
    recordedMedia,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording
  };
};
