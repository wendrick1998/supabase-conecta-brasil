
import { useEffect, useCallback, useState } from 'react';
import { RecordedAudio } from './useAudioRecording';
import { toast } from '@/components/ui/sonner';

export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

interface UseAudioRecorderProps {
  onComplete?: (audio: RecordedAudio) => void;
}

export function useAudioRecorder({ onComplete }: UseAudioRecorderProps = {}) {
  const [state, setState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<RecordedAudio | null>(null);
  const [audioLevel, setAudioLevel] = useState<number[]>([]);
  
  const isRecording = state === 'recording';
  const isPaused = state === 'paused';
  
  // Media recorder and stream references
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [timerInterval, setTimerInterval] = useState<number | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  
  // Format recording time (mm:ss)
  const formatTime = useCallback((ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }, []);
  
  const formattedTime = formatTime(recordingTime);
  
  // Cleanup all resources
  const cleanup = useCallback(() => {
    console.log('Cleaning up audio recorder resources');
    
    // Stop timer
    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }
    
    // Stop audio stream
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    
    // Reset media recorder
    setMediaRecorder(null);
    
    // Reset audio level
    setAudioLevel([]);
  }, [timerInterval, audioStream]);
  
  // Clean up on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);
  
  // Start recording
  const startRecording = useCallback(async () => {
    console.log('Starting recording');
    try {
      // Reset previous recording data
      setRecordingTime(0);
      setAudioChunks([]);
      setRecordedAudio(null);
      
      // Request microphone access
      console.log('Requesting microphone access');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      
      // Set up audio visualization
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      
      // Create visualizer update function
      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const updateVisualizer = () => {
        if (state === 'recording') {
          analyser.getByteFrequencyData(dataArray);
          
          // Calculate audio levels (normalize values between 0-1)
          const levels = Array.from({ length: 10 }, (_, i) => {
            const start = Math.floor(i * bufferLength / 10);
            const end = Math.floor((i + 1) * bufferLength / 10);
            let sum = 0;
            for (let j = start; j < end; j++) {
              sum += dataArray[j];
            }
            return (sum / (end - start)) / 255;
          });
          
          setAudioLevel(levels);
          requestAnimationFrame(updateVisualizer);
        }
      };
      requestAnimationFrame(updateVisualizer);
      
      // Create media recorder
      console.log('Creating media recorder');
      const recorder = new MediaRecorder(stream);
      setMediaRecorder(recorder);
      
      // Handle data available
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks(prev => [...prev, e.data]);
        }
      };
      
      // Handle recording stop
      recorder.onstop = () => {
        const chunks = audioChunks;
        const blob = new Blob(chunks, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const duration = recordingTime / 1000; // in seconds
        const fileName = `audio-${new Date().toISOString().replace(/:/g, '-')}.webm`;
        
        const audio: RecordedAudio = {
          url,
          blob,
          fileName,
          duration
        };
        
        setRecordedAudio(audio);
        setState('stopped');
        
        if (onComplete) {
          onComplete(audio);
        }
        
        // Clean up audio context
        if (audioContext.state !== 'closed') {
          audioContext.close().catch(console.error);
        }
      };
      
      // Start recording
      recorder.start(1000); // Collect data in 1-second chunks
      
      // Start timer
      const startTimeMs = Date.now();
      setStartTime(startTimeMs);
      const interval = window.setInterval(() => {
        setRecordingTime(Date.now() - startTimeMs);
      }, 100);
      setTimerInterval(interval);
      
      setState('recording');
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Não foi possível acessar o microfone');
      cleanup();
      setState('idle');
    }
  }, [state, cleanup, audioChunks, recordingTime, onComplete]);
  
  // Stop recording
  const stopRecording = useCallback(() => {
    console.log('Stopping recording');
    if (mediaRecorder && (mediaRecorder.state === 'recording' || mediaRecorder.state === 'paused')) {
      mediaRecorder.stop();
      
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
    }
  }, [mediaRecorder, timerInterval]);
  
  // Pause recording
  const pauseRecording = useCallback(() => {
    console.log('Pausing recording');
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.pause();
      
      if (timerInterval) {
        clearInterval(timerInterval);
        setTimerInterval(null);
      }
      
      setState('paused');
    }
  }, [mediaRecorder, timerInterval]);
  
  // Resume recording
  const resumeRecording = useCallback(() => {
    console.log('Resuming recording');
    if (mediaRecorder && mediaRecorder.state === 'paused') {
      mediaRecorder.resume();
      
      // Resume timer
      const pausedTime = recordingTime;
      const resumeStartTime = Date.now() - pausedTime;
      setStartTime(resumeStartTime);
      
      const interval = window.setInterval(() => {
        setRecordingTime(Date.now() - resumeStartTime);
      }, 100);
      setTimerInterval(interval);
      
      setState('recording');
    }
  }, [mediaRecorder, recordingTime]);
  
  // Reset recording
  const resetRecording = useCallback(() => {
    console.log('Resetting recording');
    cleanup();
    
    // Revoke object URL for the audio
    if (recordedAudio?.url) {
      URL.revokeObjectURL(recordedAudio.url);
    }
    
    setRecordingTime(0);
    setAudioChunks([]);
    setRecordedAudio(null);
    setState('idle');
  }, [cleanup, recordedAudio]);
  
  // Set idle state
  const setIdle = useCallback(() => {
    setState('idle');
  }, []);
  
  // Set recording state
  const setRecording = useCallback(() => {
    setState('recording');
  }, []);
  
  // Set paused state
  const setPaused = useCallback(() => {
    setState('paused');
  }, []);
  
  // Set stopped state
  const setStopped = useCallback(() => {
    setState('stopped');
  }, []);
  
  return {
    state,
    isRecording,
    isPaused,
    recordingTime,
    formattedTime,
    recordedAudio,
    audioLevel,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording,
    setIdle,
    setRecording,
    setPaused,
    setStopped
  };
}

export default useAudioRecorder;
