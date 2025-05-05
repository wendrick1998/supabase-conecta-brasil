
import React from 'react';
import { cn } from '@/lib/utils';

interface RecordingTimerProps {
  timeMs: number;
  className?: string;
}

const RecordingTimer: React.FC<RecordingTimerProps> = ({ timeMs, className }) => {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={cn("text-xs font-mono", className)}>
      {formatTime(timeMs)}
    </div>
  );
};

export default RecordingTimer;
