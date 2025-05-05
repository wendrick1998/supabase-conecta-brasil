
import React, { useMemo } from 'react';

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
  // Generate the waveform SVG path
  const svgPath = useMemo(() => {
    if (audioLevel.length === 0) return '';
    
    const height = 40;
    const width = 200;
    const points = audioLevel.length;
    const gap = width / (points - 1);
    
    let path = '';
    
    // Top part (mirrored)
    audioLevel.forEach((level, i) => {
      const x = i * gap;
      const y = height / 2 * (1 - level);
      if (i === 0) {
        path += `M ${x},${y}`;
      } else {
        path += ` L ${x},${y}`;
      }
    });
    
    // Bottom part (mirrored reflection)
    for (let i = audioLevel.length - 1; i >= 0; i--) {
      const x = i * gap;
      const y = height / 2 * (1 + audioLevel[i]);
      path += ` L ${x},${y}`;
    }
    
    path += ' Z'; // Close path
    return path;
  }, [audioLevel]);
  
  // Animation class based on recording state
  const animationClass = isRecording ? 'animate-pulse' : '';
  const pauseClass = isPaused ? 'opacity-50' : 'opacity-90';
  
  if (audioLevel.length === 0 && !isRecording) {
    // Show placeholder when no data and not recording
    return (
      <div className={`w-full h-12 flex items-center justify-center ${className}`}>
        <div className="text-gray-400 text-sm">Forma de onda aparecerá durante gravação</div>
      </div>
    );
  }
  
  return (
    <div className={`w-full flex justify-center ${className}`}>
      <svg width="200" height="40" className={`${pauseClass} ${animationClass} transition-opacity duration-300`}>
        {audioLevel.length > 0 ? (
          <path d={svgPath} fill="rgba(239, 68, 68, 0.5)" stroke="rgb(239, 68, 68)" strokeWidth="1" />
        ) : (
          // Placeholder flat line when starting to record
          <line x1="0" y1="20" x2="200" y2="20" stroke="rgb(239, 68, 68)" strokeWidth="1" />
        )}
      </svg>
    </div>
  );
};

export default AudioWaveform;
