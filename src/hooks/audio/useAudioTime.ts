
import { useState, useRef, useCallback } from 'react';

/**
 * Hook for managing recording time and formatting
 */
export function useAudioTime() {
  const [recordingTime, setRecordingTime] = useState(0);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  
  const startTimer = useCallback(() => {
    startTimeRef.current = Date.now();
    pausedTimeRef.current = 0;
    
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current - pausedTimeRef.current;
      setRecordingTime(elapsed);
    }, 100);
  }, []);
  
  const pauseTimer = useCallback(() => {
    pausedTimeRef.current += Date.now() - startTimeRef.current - pausedTimeRef.current;
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  
  const resumeTimer = useCallback(() => {
    timerRef.current = window.setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current - pausedTimeRef.current;
      setRecordingTime(elapsed);
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
    startTimeRef.current = 0;
    pausedTimeRef.current = 0;
  }, [stopTimer]);
  
  const formatTime = useCallback((ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  return {
    recordingTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    formattedTime: formatTime(recordingTime)
  };
}
