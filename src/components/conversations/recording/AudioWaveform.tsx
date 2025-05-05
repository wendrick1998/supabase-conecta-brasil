
import React from 'react';

interface AudioWaveformProps {
  audioLevel: number[];
  isRecording: boolean;
  isPaused: boolean;
  className?: string;
}

const AudioWaveform: React.FC<AudioWaveformProps> = ({ 
  audioLevel, 
  isRecording, 
  isPaused,
  className = ''
}) => {
  // Default to a flat line if no data
  const levels = audioLevel && audioLevel.length > 0 
    ? audioLevel 
    : new Array(10).fill(0.1);
    
  // Determine bar color based on recording state
  const getBarColor = () => {
    if (isRecording && !isPaused) {
      return 'bg-red-500 animate-pulse';
    } else if (isPaused) {
      return 'bg-amber-500';
    } else {
      return 'bg-blue-400';
    }
  };

  const barColor = getBarColor();

  return (
    <div className={`flex items-end justify-center space-x-1 h-12 w-full max-w-xs ${className}`}>
      {levels.map((level, i) => {
        // Calculate height - minimum 10%, maximum 100%
        const height = Math.max(Math.min(level * 100, 100), 10);
        
        // Add slight randomization to width for more natural look
        const baseWidth = 2;
        const width = isRecording ? (baseWidth + (i % 3 === 0 ? 1 : 0)) : baseWidth;
        
        return (
          <div
            key={i}
            className={`rounded-sm ${barColor}`}
            style={{ 
              height: `${height}%`,
              width: `${width}px`,
              transition: isRecording ? 'height 150ms ease' : 'height 400ms ease'
            }}
          />
        );
      })}
    </div>
  );
};

export default AudioWaveform;
