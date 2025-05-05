
import { useRef, useState, useCallback, useEffect } from 'react';

export type DragDirection = 'none' | 'up' | 'left';

export interface RecordedAudio {
  url: string;
  blob: Blob;
  fileName: string;
  duration: number;
}

export const useAudioRecording = () => {
  // Recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<RecordedAudio | null>(null);
  const [dragDirection, setDragDirection] = useState<DragDirection>('none');
  
  // Refs
  const buttonRef = useRef<HTMLButtonElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      stopMediaStream();
      stopTimer();
    };
  }, []);

  const stopMediaStream = useCallback(() => {
    console.log('Stopping media stream');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
      });
      streamRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    startTimeRef.current = Date.now();
    setRecordingTime(0);
    
    timerRef.current = window.setInterval(() => {
      const currentTime = Date.now() - startTimeRef.current;
      setRecordingTime(currentTime);
    }, 100);
  }, []);
  
  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  const resetTimer = useCallback(() => {
    stopTimer();
    setRecordingTime(0);
  }, [stopTimer]);

  const startRecording = useCallback(async () => {
    try {
      console.log('Starting audio recording');
      
      // Stop any existing recording
      if (isRecording) {
        await stopRecording();
      }
      
      // Reset state
      setIsRecording(true);
      setIsLocked(false);
      setRecordedAudio(null);
      setDragDirection('none');
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Reset audio chunks
      audioChunksRef.current = [];
      
      // Create media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      // Start recording
      mediaRecorderRef.current.start();
      startTimer();
      
      // Handle data available
      mediaRecorderRef.current.ondataavailable = (e) => {
        console.log('Data available from recorder:', e.data?.size || 'No data');
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      // Handle recording stop
      mediaRecorderRef.current.onstop = () => {
        console.log('MediaRecorder stopped, creating blob');
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const fileName = `audio-${new Date().toISOString().replace(/:/g, '-')}.webm`;
        const duration = recordingTime / 1000; // in seconds
        
        // Stop timer
        stopTimer();
        
        setIsRecording(false);
        setIsLocked(false);
        setRecordedAudio({
          url,
          blob,
          fileName,
          duration
        });
        
        // Stop the media stream
        stopMediaStream();
      };
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setIsRecording(false);
      setIsLocked(false);
    }
  }, [isRecording, recordingTime, startTimer, stopMediaStream, stopTimer]);

  const stopRecording = useCallback(() => {
    console.log('Stopping recording');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Clear timer
    stopTimer();
  }, [stopTimer]);

  const cancelRecording = useCallback(() => {
    console.log('Canceling recording');
    stopRecording();
    setIsRecording(false);
    setIsLocked(false);
    setRecordedAudio(null);
    setDragDirection('none');
    stopMediaStream();
  }, [stopMediaStream, stopRecording]);
  
  const resetRecording = useCallback(() => {
    console.log('Resetting recording');
    setIsRecording(false);
    setIsLocked(false);
    resetTimer();
    setDragDirection('none');
    
    if (recordedAudio?.url) {
      URL.revokeObjectURL(recordedAudio.url);
    }
    setRecordedAudio(null);
  }, [recordedAudio, resetTimer]);
  
  // Handle pointer events for drag-to-lock functionality
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only handle left clicks
    if (e.button !== 0) return;
    
    // Start recording
    if (!isRecording) {
      startRecording();
    }
    
    // Set up pointer capture
    if (buttonRef.current) {
      buttonRef.current.setPointerCapture(e.pointerId);
    }
    
    // Prevent text selection
    e.preventDefault();
  }, [isRecording, startRecording]);
  
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isRecording || isLocked) return;
    
    // Get button element for position calculation
    const buttonElement = buttonRef.current;
    if (!buttonElement) return;
    
    // Calculate relative movement from center of button
    const rect = buttonElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = e.clientX - centerX;
    const deltaY = e.clientY - centerY;
    
    // Threshold for drag detection
    const DRAG_THRESHOLD = 40;
    
    // Check if user is dragging up (lock) or left (cancel)
    if (Math.abs(deltaY) > DRAG_THRESHOLD && deltaY < 0) {
      setDragDirection('up');
    } else if (Math.abs(deltaX) > DRAG_THRESHOLD && deltaX < 0) {
      setDragDirection('left');
    } else {
      setDragDirection('none');
    }
  }, [isRecording, isLocked]);
  
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isRecording) return;
    
    // Release pointer capture
    if (buttonRef.current) {
      buttonRef.current.releasePointerCapture(e.pointerId);
    }
    
    // Handle different drag directions
    if (dragDirection === 'up') {
      // Lock the recording
      setIsLocked(true);
    } else if (dragDirection === 'left') {
      // Cancel the recording
      cancelRecording();
    } else if (!isLocked) {
      // Regular stop if not locked and not dragged
      stopRecording();
    }
    
    setDragDirection('none');
  }, [isRecording, dragDirection, isLocked, cancelRecording, stopRecording]);

  // Format recording time (mm:ss)
  const formatTime = useCallback((ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);

  const formattedTime = formatTime(recordingTime);
  
  return {
    isRecording,
    isLocked,
    recordingTime,
    formattedTime,
    recordedAudio,
    dragDirection,
    buttonRef,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording,
    setIsLocked,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};
