
import { useState, useRef, useEffect } from 'react';

export const useRecordingTimer = (maxDuration: number = 5 * 60 * 1000) => {
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
  const startTimer = () => {
    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    // Reset and start the timer
    startTimeRef.current = Date.now();
    setRecordingTime(0);
    
    timerRef.current = window.setInterval(() => {
      const currentTime = Date.now() - startTimeRef.current;
      setRecordingTime(currentTime);
      
      // Auto-stop if we hit max duration
      if (currentTime >= maxDuration) {
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
      }
    }, 100);
  };
  
  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const resetTimer = () => {
    stopTimer();
    setRecordingTime(0);
  };
  
  return {
    recordingTime,
    startTimer,
    stopTimer,
    resetTimer,
    isMaxDurationReached: recordingTime >= maxDuration
  };
};
