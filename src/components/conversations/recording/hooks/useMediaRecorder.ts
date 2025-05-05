
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
  const pausedTimeRef = useRef<number>(0); // Track accumulated time during pauses
  const pausedTimestampRef = useRef<number | null>(null); // Track when we paused
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
    console.log("Starting/resuming timer, pausedTime:", pausedTimeRef.current);
    
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
    }

    if (!isPaused) {
      // If not resuming from pause, reset the time tracking
      if (pausedTimeRef.current === 0) {
        startTimeRef.current = Date.now();
      } else {
        // When resuming, adjust start time to account for paused time
        startTimeRef.current = Date.now() - pausedTimeRef.current;
      }
    }

    // Update recording time every 100ms
    timerIntervalRef.current = window.setInterval(() => {
      const elapsedTime = Date.now() - startTimeRef.current;
      setRecordingTime(elapsedTime);
    }, 100);
  }, [isPaused]);

  const stopTimer = useCallback(() => {
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // When pausing, store the current elapsed time
    if (isPaused) {
      pausedTimeRef.current = Date.now() - startTimeRef.current;
      pausedTimestampRef.current = Date.now();
      console.log("Paused timer at", pausedTimeRef.current, "ms");
    }
  }, [isPaused]);

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
      
      if (!isPaused) {
        // Only reset chunks and time if not resuming
        setRecordingTime(0);
        pausedTimeRef.current = 0;
        pausedTimestampRef.current = null;
        mediaChunksRef.current = [];
      }
      
      // Create media recorder if not resuming
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
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
          console.log('MediaRecorder stopped, creating blob from chunks:', mediaChunksRef.current.length);
          
          if (mediaChunksRef.current.length === 0) {
            console.error('No data collected during recording');
            toast.error('Nenhum áudio gravado');
            setIsRecording(false);
            setIsPaused(false);
            stopTimer();
            return;
          }
          
          const mimeType = mediaType === 'audio' ? 'audio/webm' : 'video/webm';
          const blob = new Blob(mediaChunksRef.current, { type: mimeType });
          console.log('Created blob:', blob.size, 'bytes');
          
          if (blob.size === 0) {
            console.error('Created blob has zero size');
            toast.error('Erro ao processar a gravação');
            setIsRecording(false);
            setIsPaused(false);
            stopTimer();
            return;
          }
          
          const url = URL.createObjectURL(blob);
          const fileName = `${mediaType}-${new Date().toISOString().replace(/:/g, '-')}.webm`;
          
          const duration = recordingTime;
          
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
      }
      
      // Start or resume recording
      if (mediaRecorderRef.current.state === 'inactive') {
        console.log('Starting MediaRecorder');
        mediaRecorderRef.current.start();
        
        // Request data every second for longer recordings
        // This helps create chunks for more reliable recording
        setInterval(() => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.requestData();
          }
        }, 1000);
      } else if (mediaRecorderRef.current.state === 'paused') {
        console.log('Resuming MediaRecorder');
        mediaRecorderRef.current.resume();
      }
      
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
  }, [mediaType, onRecordingComplete, startTimer, stopTimer, isPaused]);

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
  }, [mediaType, stopTimer]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      console.log('Pausing MediaRecorder');
      try {
        mediaRecorderRef.current.pause();
        setIsPaused(true);
        stopTimer();
        pausedTimestampRef.current = Date.now();
      } catch (error) {
        console.error('Error pausing recording:', error);
      }
    }
  }, [stopTimer]);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      console.log('Resuming MediaRecorder from pausedTime:', pausedTimeRef.current);
      try {
        mediaRecorderRef.current.resume();
        setIsPaused(false);
        startTimer(); // Resume timer from where it left off
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
    pausedTimeRef.current = 0;
    pausedTimestampRef.current = null;
    
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
