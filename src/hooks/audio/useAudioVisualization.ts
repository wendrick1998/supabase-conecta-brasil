import { useState, useRef, useCallback } from 'react';

/**
 * Hook for handling audio visualization based on audio levels
 */
export function useAudioVisualization() {
  const [audioLevel, setAudioLevel] = useState<number[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const setupAnalyser = useCallback((audioContext: AudioContext, stream: MediaStream) => {
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256; // Power of 2, controls detail level
    source.connect(analyser);
    analyserRef.current = analyser;
  }, []);
  
  const startVisualization = useCallback(() => {
    if (!analyserRef.current) return;
    
    const analyser = analyserRef.current;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    
    const updateVisualization = () => {
      analyser.getByteFrequencyData(dataArray);
      
      // Calculate average level for visualization
      const average = [...dataArray].reduce((sum, value) => sum + value, 0) / bufferLength;
      const normalizedLevel = Math.min(average / 128, 1); // Normalize to 0-1
      
      setAudioLevel(prev => {
        const newLevels = [...prev, normalizedLevel];
        // Keep only the last 50 points for visualization
        return newLevels.slice(-50);
      });
      
      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    };
    
    animationFrameRef.current = requestAnimationFrame(updateVisualization);
  }, []);
  
  const stopVisualization = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, []);
  
  const resetVisualization = useCallback(() => {
    setAudioLevel([]);
  }, []);

  return {
    audioLevel,
    setupAnalyser,
    startVisualization,
    stopVisualization,
    resetVisualization
  };
}
