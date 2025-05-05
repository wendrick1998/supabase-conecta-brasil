
import { useState, useRef, useCallback } from 'react';

export function useAudioTime() {
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  
  // Format recording time (mm:ss)
  const formatTime = useCallback((ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);
  
  const formattedTime = formatTime(recordingTime);
  
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    startTimeRef.current = Date.now() - pausedTimeRef.current;
    
    timerRef.current = window.setInterval(() => {
      setRecordingTime(Date.now() - startTimeRef.current);
    }, 100);
  }, []);
  
  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    pausedTimeRef.current = recordingTime;
  }, [recordingTime]);
  
  const resumeTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    startTimeRef.current = Date.now() - pausedTimeRef.current;
    
    timerRef.current = window.setInterval(() => {
      setRecordingTime(Date.now() - startTimeRef.current);
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
    pausedTimeRef.current = 0;
    setRecordingTime(0);
  }, [stopTimer]);
  
  return {
    recordingTime,
    formattedTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer
  };
}
