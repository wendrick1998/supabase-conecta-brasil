
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
    if (!audioLevel || audioLevel.length === 0) {
      // Create a default flat line if no audio data
      const defaultLevel = 0.1;
      const points = 10;
      const height = 40;
      const width = 200;
      const gap = width / (points - 1);
      
      let path = '';
      
      // Top part (mirrored)
      for (let i = 0; i < points; i++) {
        const x = i * gap;
        const y = height / 2 * (1 - defaultLevel);
        if (i === 0) {
          path += `M ${x},${y}`;
        } else {
          path += ` L ${x},${y}`;
        }
      }
      
      // Bottom part (mirrored reflection)
      for (let i = points - 1; i >= 0; i--) {
        const x = i * gap;
        const y = height / 2 * (1 + defaultLevel);
        path += ` L ${x},${y}`;
      }
      
      path += ' Z'; // Close path
      return path;
    }
    
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
  const animationClass = isRecording && !isPaused ? 'animate-pulse' : '';
  const pauseClass = isPaused ? 'opacity-50' : 'opacity-90';
  
  if (!isRecording && !isPaused && (!audioLevel || audioLevel.length === 0)) {
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
        <path 
          d={svgPath} 
          fill="rgba(239, 68, 68, 0.5)" 
          stroke="rgb(239, 68, 68)" 
          strokeWidth="1" 
        />
      </svg>
    </div>
  );
};

export default AudioWaveform;
