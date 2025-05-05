
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

  return (
    <div className={`flex items-end justify-center space-x-1 h-12 w-full max-w-xs ${className}`}>
      {levels.map((level, i) => {
        // Calculate height - minimum 10%, maximum 100%
        const height = Math.max(Math.min(level * 100, 100), 10);
        
        return (
          <div
            key={i}
            className={`w-2 rounded-sm ${
              isRecording && !isPaused 
                ? 'bg-red-500 animate-pulse' 
                : isPaused 
                  ? 'bg-amber-500' 
                  : 'bg-blue-400'
            }`}
            style={{ 
              height: `${height}%`,
              transition: 'height 150ms ease'
            }}
          />
        );
      })}
    </div>
  );
};

export default AudioWaveform;
