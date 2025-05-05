import React, { useState, useEffect } from 'react';

interface RecordingTimerProps {
  isRecording: boolean;
  initialTimeMs?: number; // Added to support resuming from a paused state
  onTimeUpdate?: (seconds: number) => void;
}

const RecordingTimer: React.FC<RecordingTimerProps> = ({
  isRecording,
  initialTimeMs = 0, // Default to 0 if not provided
  onTimeUpdate
}) => {
  const [seconds, setSeconds] = useState(Math.floor(initialTimeMs / 1000));
  
  useEffect(() => {
    let interval: number | null = null;
    
    // Only start the timer if we're recording
    if (isRecording) {
      // Keep the existing seconds when resuming
      interval = window.setInterval(() => {
        setSeconds(prev => {
          const newValue = prev + 1;
          if (onTimeUpdate) onTimeUpdate(newValue);
          return newValue;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, onTimeUpdate]);
  
  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="text-center font-mono font-medium">
      {formatTime(seconds)}
    </div>
  );
};

export default RecordingTimer;
