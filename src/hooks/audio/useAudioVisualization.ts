
import { useState, useRef, useCallback } from 'react';

export function useAudioVisualization() {
  const [audioLevel, setAudioLevel] = useState<number[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const frameRef = useRef<number | null>(null);
  const dataArrayRef = useRef<Uint8Array | null>(null);
  
  const setupAnalyser = useCallback((audioContext: AudioContext, stream: MediaStream) => {
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;
    
    source.connect(analyser);
    analyserRef.current = analyser;
    
    const bufferLength = analyser.frequencyBinCount;
    dataArrayRef.current = new Uint8Array(bufferLength);
  }, []);
  
  const startVisualization = useCallback(() => {
    if (!analyserRef.current || !dataArrayRef.current) return;
    
    const updateVisualizer = () => {
      if (analyserRef.current && dataArrayRef.current) {
        analyserRef.current.getByteFrequencyData(dataArrayRef.current);
        
        // Calculate audio levels (normalize values between 0-1)
        const bufferLength = dataArrayRef.current.length;
        const levels = Array.from({ length: 10 }, (_, i) => {
          const start = Math.floor(i * bufferLength / 10);
          const end = Math.floor((i + 1) * bufferLength / 10);
          let sum = 0;
          for (let j = start; j < end; j++) {
            sum += dataArrayRef.current![j];
          }
          return Math.min(1, (sum / (end - start)) / 255);
        });
        
        setAudioLevel(levels);
        frameRef.current = requestAnimationFrame(updateVisualizer);
      }
    };
    
    frameRef.current = requestAnimationFrame(updateVisualizer);
  }, []);
  
  const stopVisualization = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }
  }, []);
  
  const resetVisualization = useCallback(() => {
    stopVisualization();
    setAudioLevel([]);
    analyserRef.current = null;
    dataArrayRef.current = null;
  }, [stopVisualization]);
  
  return {
    audioLevel,
    setupAnalyser,
    startVisualization,
    stopVisualization,
    resetVisualization
  };
}
