
import { useEffect, useCallback, useState, useRef } from 'react';
import { toast } from '@/components/ui/sonner';

export type RecordingState = 'idle' | 'recording' | 'paused' | 'stopped';

export interface RecordedAudio {
  url: string;
  blob: Blob;
  fileName: string;
  duration: number;
}

interface UseAudioRecorderProps {
  onComplete?: (audio: RecordedAudio) => void;
}

export function useAudioRecorder({ onComplete }: UseAudioRecorderProps = {}) {
  const [state, setState] = useState<RecordingState>('idle');
  const [recordingTime, setRecordingTime] = useState(0);
  const [recordedAudio, setRecordedAudio] = useState<RecordedAudio | null>(null);
  const [audioLevel, setAudioLevel] = useState<number[]>(new Array(10).fill(0.1));
  
  const isRecording = state === 'recording';
  const isPaused = state === 'paused';
  
  // Media recorder and stream references
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  
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
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    
    // Stop audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close().catch(console.error);
      audioContextRef.current = null;
    }
    
    // Stop audio stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log(`Stopping track: ${track.kind}`, track.readyState);
        track.stop();
      });
      streamRef.current = null;
    }
    
    // Reset media recorder
    mediaRecorderRef.current = null;
    
    // Reset audio level
    setAudioLevel(new Array(10).fill(0.1));
    
    analyserRef.current = null;
  }, []);
  
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
      audioChunksRef.current = [];
      setRecordedAudio(null);
      
      // Request microphone access
      console.log('Requesting microphone access');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      console.log('Microphone access granted', stream);
      streamRef.current = stream;
      
      // Set up audio visualization
      try {
        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;
        
        // Create visualizer update function
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        
        const updateVisualizer = () => {
          if (state === 'recording' && analyserRef.current) {
            analyserRef.current.getByteFrequencyData(dataArray);
            
            // Calculate audio levels (normalize values between 0-1)
            const levels = Array.from({ length: 10 }, (_, i) => {
              const start = Math.floor(i * bufferLength / 10);
              const end = Math.floor((i + 1) * bufferLength / 10);
              let sum = 0;
              for (let j = start; j < end; j++) {
                sum += dataArray[j];
              }
              // Ensure we don't divide by zero
              const avg = (end - start) > 0 ? (sum / (end - start)) / 255 : 0.1;
              // Ensure minimum value for visual effect
              return Math.max(avg, 0.1);
            });
            
            setAudioLevel(levels);
            requestAnimationFrame(updateVisualizer);
          }
        };
        requestAnimationFrame(updateVisualizer);
      } catch (vizError) {
        console.warn('Error setting up audio visualization:', vizError);
        // Continue with recording even if visualization fails
      }
      
      // Create media recorder with specific options for better compatibility
      console.log('Creating media recorder');
      const options = { mimeType: 'audio/webm' };
      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;
      
      // Handle data available - collect chunks as they come
      recorder.ondataavailable = (e) => {
        console.log(`Data available event: ${e.data?.size} bytes`);
        if (e.data && e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      // Handle recording stop
      recorder.onstop = () => {
        console.log('Media recorder stopped, processing audio chunks');
        if (audioChunksRef.current.length === 0) {
          console.error('No audio chunks collected');
          toast.error('Erro na gravação: nenhum áudio gravado');
          setState('idle');
          cleanup();
          return;
        }
        
        console.log(`Creating blob from ${audioChunksRef.current.length} chunks`);
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        
        if (blob.size === 0) {
          console.error('Created blob has zero size');
          toast.error('Erro na gravação: arquivo vazio');
          setState('idle');
          cleanup();
          return;
        }
        
        console.log(`Audio blob created: ${blob.size} bytes`);
        const url = URL.createObjectURL(blob);
        const fileName = `audio-${new Date().toISOString().replace(/:/g, '-')}.webm`;
        const duration = recordingTime / 1000; // in seconds
        
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
      };
      
      // Start recording with 100ms chunks for better reliability
      recorder.start(100);
      
      // Start timer
      const startTimeMs = Date.now();
      startTimeRef.current = startTimeMs;
      const interval = window.setInterval(() => {
        setRecordingTime(Date.now() - startTimeMs);
      }, 100);
      timerIntervalRef.current = interval;
      
      setState('recording');
      
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Não foi possível acessar o microfone');
      cleanup();
      setState('idle');
    }
  }, [state, cleanup, onComplete]);
  
  // Stop recording
  const stopRecording = useCallback(() => {
    console.log('Stopping recording');
    if (mediaRecorderRef.current && (mediaRecorderRef.current.state === 'recording' || mediaRecorderRef.current.state === 'paused')) {
      try {
        // Request final data chunk before stopping
        mediaRecorderRef.current.requestData();
        mediaRecorderRef.current.stop();
        
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      } catch (error) {
        console.error('Error stopping recorder:', error);
        // Clean up anyway
        cleanup();
        setState('idle');
      }
    }
  }, [cleanup]);
  
  // Pause recording
  const pauseRecording = useCallback(() => {
    console.log('Pausing recording');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      try {
        mediaRecorderRef.current.pause();
        
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
        
        setState('paused');
      } catch (error) {
        console.error('Error pausing recording:', error);
      }
    }
  }, []);
  
  // Resume recording
  const resumeRecording = useCallback(() => {
    console.log('Resuming recording');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      try {
        mediaRecorderRef.current.resume();
        
        // Resume timer
        const pausedTime = recordingTime;
        const resumeStartTime = Date.now() - pausedTime;
        startTimeRef.current = resumeStartTime;
        
        const interval = window.setInterval(() => {
          setRecordingTime(Date.now() - resumeStartTime);
        }, 100);
        timerIntervalRef.current = interval;
        
        setState('recording');
      } catch (error) {
        console.error('Error resuming recording:', error);
      }
    }
  }, [mediaRecorderRef, recordingTime]);
  
  // Reset recording
  const resetRecording = useCallback(() => {
    console.log('Resetting recording');
    cleanup();
    
    // Revoke object URL for the audio
    if (recordedAudio?.url) {
      URL.revokeObjectURL(recordedAudio.url);
    }
    
    setRecordingTime(0);
    audioChunksRef.current = [];
    setRecordedAudio(null);
    setState('idle');
  }, [cleanup, recordedAudio]);
  
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
    setIdle: () => setState('idle'),
    setRecording: () => setState('recording'),
    setPaused: () => setState('paused'),
    setStopped: () => setState('stopped')
  };
}

export default useAudioRecorder;
