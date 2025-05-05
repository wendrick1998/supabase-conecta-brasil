
import { useState, useRef, useCallback, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';
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
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedMedia, setRecordedMedia] = useState<{
    url: string;
    blob: Blob | null;
    fileName: string;
  } | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<BlobPart[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const errorTimeoutRef = useRef<number | null>(null);

  // Cleanup effect for timers
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (errorTimeoutRef.current) {
        clearTimeout(errorTimeoutRef.current);
      }
    };
  }, []);

  // Function to handle timer updates
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    // Update recording time every 100ms
    timerIntervalRef.current = window.setInterval(() => {
      const elapsedTime = Date.now() - startTimeRef.current;
      setRecordingTime(elapsedTime);
    }, 100);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, []);

  const startRecording = useCallback((stream: MediaStream) => {
    if (mediaType === 'photo') {
      // For photos, we just access the camera without recording
      setIsRecording(true);
      return;
    }
    
    console.log('Starting recording with stream:', stream);
    
    try {
      // Reset state
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      
      // Reset chunks
      mediaChunksRef.current = [];
      
      // Create media recorder
      const mimeType = mediaType === 'audio' ? 'audio/webm' : 'video/webm';
      console.log('Creating MediaRecorder with mimeType:', mimeType);
      
      // Check if MediaRecorder is supported
      if (!window.MediaRecorder) {
        throw new Error('MediaRecorder is not supported in this browser');
      }
      
      // Check if mimeType is supported
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.warn(`MimeType ${mimeType} not supported, using default`);
      }
      
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      
      // Add data handler
      mediaRecorderRef.current.ondataavailable = (e) => {
        console.log('Data available from recorder:', e.data?.size || 'No data');
        if (e.data && e.data.size > 0) {
          mediaChunksRef.current.push(e.data);
        }
      };
      
      // Handle recording stop
      mediaRecorderRef.current.onstop = () => {
        console.log('MediaRecorder stopped');
        const blob = new Blob(mediaChunksRef.current, { type: mimeType });
        console.log('Created blob:', blob.size, 'bytes');
        const url = URL.createObjectURL(blob);
        const fileName = `${mediaType}-${new Date().toISOString().replace(/:/g, '-')}.webm`;
        
        setRecordedMedia({
          url,
          blob,
          fileName
        });
        
        setIsRecording(false);
        setIsPaused(false);
        stopTimer();
        
        if (onRecordingComplete) onRecordingComplete();
      };

      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        toast.error('Erro durante a gravação');
        stopRecording();
      };
      
      // Start recording
      console.log('Starting MediaRecorder');
      mediaRecorderRef.current.start();
      startTimer();
      
      // Set a verification timeout to check if recording started correctly
      errorTimeoutRef.current = window.setTimeout(() => {
        if (isRecording && mediaChunksRef.current.length === 0) {
          console.warn('No data received after timeout, possible issue with recording');
        }
      }, 2000);
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Erro ao iniciar gravação');
      setIsRecording(false);
    }
  }, [mediaType, onRecordingComplete, startTimer, stopTimer]);

  const stopRecording = useCallback(() => {
    console.log('Stop recording called');
    
    if (mediaType === 'photo') {
      setIsRecording(false);
      return;
    }
    
    if (mediaRecorderRef.current && (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused')) {
      console.log('Stopping MediaRecorder');
      try {
        mediaRecorderRef.current.stop();
        stopTimer();
      } catch (error) {
        console.error('Error stopping recording:', error);
        setIsRecording(false);
        setIsPaused(false);
      }
    } else {
      console.warn('MediaRecorder not active or not initialized');
      setIsRecording(false);
      setIsPaused(false);
    }
  }, [isRecording, mediaType, stopTimer]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log('Pausing MediaRecorder');
      try {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        stopTimer();
      } catch (error) {
        console.error('Error pausing recording:', error);
      }
    }
  }, [stopTimer]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      console.log('Resuming MediaRecorder');
      try {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        startTimer();
      } catch (error) {
        console.error('Error resuming recording:', error);
      }
    }
  }, [startTimer]);

  const resetRecording = useCallback(() => {
    console.log('Resetting recording state');
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
    
    if (recordedMedia?.url) {
      URL.revokeObjectURL(recordedMedia.url);
    }
    
    setRecordedMedia(null);
    stopTimer();
  }, [recordedMedia, stopTimer]);

  return {
    isRecording,
    isPaused,
    recordingTime,
    recordedMedia,
    startRecording,
    stopRecording,
    pauseRecording,
    resumeRecording,
    resetRecording
  };
};
