
import { useEffect, useCallback } from 'react';
import { useAudioState } from './audio/useAudioState';
import { useAudioTime } from './audio/useAudioTime';
import { useAudioVisualization } from './audio/useAudioVisualization';
import { useMediaRecorder, AudioRecorderResult } from './audio/useMediaRecorder';
import { toast } from '@/components/ui/sonner';

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
  // Incorporate all the individual hooks
  const {
    state,
    setIdle,
    setRecording,
    setPaused,
    setStopped,
    isRecording,
    isPaused
  } = useAudioState();
  
  const {
    recordingTime,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer,
    resetTimer,
    formattedTime
  } = useAudioTime();
  
  const {
    audioLevel,
    setupAnalyser,
    startVisualization,
    stopVisualization,
    resetVisualization
  } = useAudioVisualization();
  
  const {
    recordedAudio,
    audioContext,
    initializeAudioContext,
    requestMicrophoneAccess,
    setupMediaRecorder,
    startRecording: startMediaRecording,
    pauseRecording: pauseMediaRecording,
    resumeRecording: resumeMediaRecording,
    stopRecording: stopMediaRecording,
    cleanup: cleanupMediaRecorder,
    reset: resetMediaRecorder
  } = useMediaRecorder();

  // Cleanup function for all resources
  const cleanup = useCallback(() => {
    stopVisualization();
    stopTimer();
    cleanupMediaRecorder();
  }, [cleanupMediaRecorder, stopTimer, stopVisualization]);

  // Clean up on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Start recording function
  const startRecording = useCallback(async () => {
    try {
      // Reset state and prepare for new recording
      resetVisualization();
      resetTimer();
      
      // Access microphone
      console.log('Requesting microphone access');
      const stream = await requestMicrophoneAccess();
      if (!stream) return;
      
      // Initialize visualization
      const audioCtx = await initializeAudioContext(stream);
      if (!audioCtx) return;
      
      setupAnalyser(audioCtx, stream);
      
      // Create media recorder
      const mediaRecorder = setupMediaRecorder(stream);
      
      // Start everything
      startMediaRecording();
      startTimer();
      startVisualization();
      setRecording();
      
    } catch (error) {
      console.error('Error starting recording:', error);
      cleanup();
      setIdle();
    }
  }, [
    cleanup, 
    initializeAudioContext, 
    requestMicrophoneAccess, 
    resetTimer, 
    resetVisualization, 
    setIdle, 
    setRecording, 
    setupAnalyser, 
    setupMediaRecorder, 
    startMediaRecording, 
    startTimer, 
    startVisualization
  ]);

  // Pause recording function
  const pauseRecording = useCallback(() => {
    if (!isRecording) return;
    
    try {
      const paused = pauseMediaRecording();
      if (paused) {
        pauseTimer();
        setPaused();
      }
    } catch (error) {
      console.error('Error pausing recording:', error);
      toast.error('Erro ao pausar gravação');
    }
  }, [isRecording, pauseMediaRecording, pauseTimer, setPaused]);

  // Resume recording function
  const resumeRecording = useCallback(() => {
    if (!isPaused) return;
    
    try {
      const resumed = resumeMediaRecording();
      if (resumed) {
        resumeTimer();
        setRecording();
      }
    } catch (error) {
      console.error('Error resuming recording:', error);
      toast.error('Erro ao retomar gravação');
    }
  }, [isPaused, resumeMediaRecording, resumeTimer, setRecording]);

  // Stop recording function
  const stopRecording = useCallback(async () => {
    if (!isRecording && !isPaused) return;
    
    try {
      stopTimer();
      const audio = await stopMediaRecording(recordingTime);
      setStopped();
      
      if (audio && onComplete) {
        onComplete(audio);
      }
    } catch (error) {
      console.error('Error stopping recording:', error);
      toast.error('Erro ao finalizar gravação');
      setIdle();
    }
  }, [isRecording, isPaused, onComplete, recordingTime, setIdle, setStopped, stopMediaRecording, stopTimer]);

  // Reset recording function
  const resetRecording = useCallback(() => {
    resetMediaRecorder();
    resetTimer();
    resetVisualization();
    setIdle();
  }, [resetMediaRecorder, resetTimer, resetVisualization, setIdle]);

  // Return all necessary state and functions
  return {
    state,
    isRecording,
    isPaused,
    isStopped: state === 'stopped',
    recordingTime,
    formattedTime,
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
