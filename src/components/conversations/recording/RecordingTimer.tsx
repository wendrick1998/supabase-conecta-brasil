
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
  const [elapsedTime, setElapsedTime] = useState(initialTimeMs);
  const [startTime, setStartTime] = useState<number | null>(null);
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRecording) {
      // If recording is starting or resuming, set the start time
      const now = Date.now();
      // When initialTimeMs is provided, adjust the start time to account for previous recording
      setStartTime(now - initialTimeMs);
      
      // Start the interval to update elapsed time
      interval = window.setInterval(() => {
        const currentTime = Date.now() - (startTime || now) + initialTimeMs;
        setElapsedTime(currentTime);
        
        if (onTimeUpdate) {
          onTimeUpdate(Math.floor(currentTime / 1000));
        }
      }, 100);
    } else if (!isRecording && startTime) {
      // When recording is paused or stopped, preserve the elapsed time
      setElapsedTime(Date.now() - startTime + initialTimeMs);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording, initialTimeMs, onTimeUpdate]);
  
  const formatTime = (timeMs: number) => {
    const totalSeconds = Math.floor(timeMs / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className="text-center font-mono font-medium">
      {formatTime(elapsedTime)}
    </div>
  );
};

export default RecordingTimer;
