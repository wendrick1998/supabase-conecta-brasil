
import React, { useState, useEffect } from 'react';

interface RecordingTimerProps {
  isRecording: boolean;
  onTimeUpdate?: (seconds: number) => void;
}

const RecordingTimer: React.FC<RecordingTimerProps> = ({
  isRecording,
  onTimeUpdate
}) => {
  const [seconds, setSeconds] = useState(0);
  
  useEffect(() => {
    let interval: number | null = null;
    
    if (isRecording) {
      setSeconds(0);
      interval = window.setInterval(() => {
        setSeconds(prev => {
          const newValue = prev + 1;
          if (onTimeUpdate) onTimeUpdate(newValue);
          return newValue;
        });
      }, 1000);
    } else {
      setSeconds(0);
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
