import { useState, useRef, useEffect, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';

// Define all possible states for our recording state machine
type RecorderState = 'idle' | 'recording' | 'paused' | 'stopped';

export interface RecordedAudio {
  url: string;
  blob: Blob;
  fileName: string;
  duration: number;
}

export interface UseAudioRecorderProps {
  onComplete?: (audio: RecordedAudio) => void;
}

export function useAudioRecorder({ onComplete }: UseAudioRecorderProps = {}) {
  // Core states
  const [state, setState] = useState<RecorderState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<RecordedAudio | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioLevel, setAudioLevel] = useState<number[]>([]);

  // Refs to hold non-reactive values
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  // Cleanup function to be called when recording stops or component unmounts
  const cleanup = useCallback(() => {
    // Stop animation frame if running
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Clear timer if running
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Stop and close media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    // Close audio context if open
    if (audioContext && audioContext.state !== 'closed') {
      // Only close if we're done with it completely
      if (state === 'idle' || state === 'stopped') {
        audioContext.close().catch(console.error);
        setAudioContext(null);
      }
    }

    // Reset audio level visualization if we're stopping completely
    if (state === 'idle' || state === 'stopped') {
      setAudioLevel([]);
    }
  }, [audioContext, state]);

  // Initialize audio context and analyzer for visualization
  const initializeAudioContext = useCallback(async (stream: MediaStream) => {
    try {
      const newAudioContext = new AudioContext();
      const source = newAudioContext.createMediaStreamSource(stream);
      const analyser = newAudioContext.createAnalyser();
      
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      setAudioContext(newAudioContext);
      
      // Start visualization
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      
      const updateVisualization = () => {
        if (state === 'recording' || state === 'paused') {
          analyser.getByteFrequencyData(dataArray);
          
          // Calculate average level for visualization (simplified)
          const average = [...dataArray].reduce((sum, value) => sum + value, 0) / bufferLength;
          const normalizedLevel = Math.min(average / 128, 1); // Normalize to 0-1
          
          setAudioLevel(prev => {
            const newLevels = [...prev, normalizedLevel];
            // Keep only the last 50 points for visualization
            return newLevels.slice(-50);
          });
          
          animationFrameRef.current = requestAnimationFrame(updateVisualization);
        }
      };
      
      animationFrameRef.current = requestAnimationFrame(updateVisualization);
    } catch (error) {
      console.error('Error initializing audio context:', error);
    }
  }, [state]);

  // Start recording function
  const startRecording = useCallback(async () => {
    try {
      // Reset state
      chunksRef.current = [];
      setRecordingTime(0);
      setRecordedAudio(null);
      
      // Access microphone
      console.log('Requesting microphone access');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Initialize visualization
      await initializeAudioContext(stream);
      
      // Create media recorder
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      // Set up event handlers
      mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        if (chunksRef.current.length === 0) {
          toast.error('Nenhum áudio gravado');
          return;
        }
        
        // Create blob and file from recorded chunks
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const fileName = `audio-${new Date().toISOString().replace(/:/g, '-')}.webm`;
        
        const audio: RecordedAudio = {
          url,
          blob,
          fileName,
          duration: recordingTime / 1000 // Convert ms to seconds
        };
        
        setRecordedAudio(audio);
        
        if (onComplete) {
          onComplete(audio);
        }
      };
      
      // Start recording
      mediaRecorder.start();
      
      // Start timer
      startTimeRef.current = Date.now();
      pausedTimeRef.current = 0;
      
      timerRef.current = window.setInterval(() => {
        const elapsed = Date.now() - startTimeRef.current - pausedTimeRef.current;
        setRecordingTime(elapsed);
      }, 100);
      
      setState('recording');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Não foi possível acessar o microfone');
      cleanup();
    }
  }, [cleanup, initializeAudioContext, onComplete]);

  // Pause recording function
  const pauseRecording = useCallback(() => {
    if (state !== 'recording' || !mediaRecorderRef.current) return;
    
    try {
      if (mediaRecorderRef.current.state === 'recording') {
        // Store current pause time to calculate offsets
        pausedTimeRef.current += Date.now() - startTimeRef.current - pausedTimeRef.current;
        
        // Pause media recorder
        mediaRecorderRef.current.pause();
        
        // Stop timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        setState('paused');
      }
    } catch (error) {
      console.error('Error pausing recording:', error);
      toast.error('Erro ao pausar gravação');
    }
  }, [state]);

  // Resume recording function
  const resumeRecording = useCallback(() => {
    if (state !== 'paused' || !mediaRecorderRef.current) return;
    
    try {
      if (mediaRecorderRef.current.state === 'paused') {
        // Resume media recorder
        mediaRecorderRef.current.resume();
        
        // Resume timer
        timerRef.current = window.setInterval(() => {
          const elapsed = Date.now() - startTimeRef.current - pausedTimeRef.current;
          setRecordingTime(elapsed);
        }, 100);
        
        setState('recording');
      }
    } catch (error) {
      console.error('Error resuming recording:', error);
      toast.error('Erro ao retomar gravação');
    }
  }, [state]);

  // Stop recording function
  const stopRecording = useCallback(() => {
    if ((state !== 'recording' && state !== 'paused') || !mediaRecorderRef.current) return;
    
    try {
      if (mediaRecorderRef.current.state !== 'inactive') {
        // Request final data and stop
        mediaRecorderRef.current.requestData();
        mediaRecorderRef.current.stop();
        
        // Stop timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        setState('stopped');
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      toast.error('Erro ao finalizar gravação');
    }
  }, [state]);

  // Reset recording function
  const resetRecording = useCallback(() => {
    // Revoke any object URLs to prevent memory leaks
    if (recordedAudio?.url) {
      URL.revokeObjectURL(recordedAudio.url);
    }
    
    // Reset all state
    setRecordedAudio(null);
    setRecordingTime(0);
    setState('idle');
    setAudioLevel([]);
    
    // Full cleanup
    cleanup();
  }, [recordedAudio, cleanup]);

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Format time for display (mm:ss)
  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Return all necessary state and functions
  return {
    state,
    isRecording: state === 'recording',
    isPaused: state === 'paused',
    isStopped: state === 'stopped',
    recordingTime,
    formattedTime: formatTime(recordingTime),
    recordedAudio,
    audioLevel,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording
  };
}

export default useAudioRecorder;
