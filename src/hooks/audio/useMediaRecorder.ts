
import { useRef, useState, useCallback } from 'react';
import { toast } from '@/components/ui/sonner';

export type AudioRecorderResult = {
  url: string;
  blob: Blob;
  fileName: string;
  duration: number;
};

/**
 * Hook for handling MediaRecorder API interactions
 */
export function useMediaRecorder() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [recordedAudio, setRecordedAudio] = useState<AudioRecorderResult | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const initializeAudioContext = useCallback(async (stream: MediaStream) => {
    try {
      const newAudioContext = new AudioContext();
      setAudioContext(newAudioContext);
      return newAudioContext;
    } catch (error) {
      console.error('Error initializing audio context:', error);
      return null;
    }
  }, []);
  
  const requestMicrophoneAccess = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      return stream;
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Não foi possível acessar o microfone');
      return null;
    }
  }, []);
  
  const setupMediaRecorder = useCallback((stream: MediaStream) => {
    // Reset chunks array
    chunksRef.current = [];
    
    // Create media recorder
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    
    // Set up data handler
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };
    
    return mediaRecorder;
  }, []);
  
  const startRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'inactive') {
      mediaRecorderRef.current.start();
      return true;
    }
    return false;
  }, []);
  
  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      return true;
    }
    return false;
  }, []);
  
  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      return true;
    }
    return false;
  }, []);
  
  const stopRecording = useCallback((duration: number) => {
    return new Promise<AudioRecorderResult | null>((resolve) => {
      if (!mediaRecorderRef.current || mediaRecorderRef.current.state === 'inactive') {
        resolve(null);
        return;
      }
      
      mediaRecorderRef.current.onstop = () => {
        if (chunksRef.current.length === 0) {
          toast.error('Nenhum áudio gravado');
          resolve(null);
          return;
        }
        
        // Create blob and file from recorded chunks
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const fileName = `audio-${new Date().toISOString().replace(/:/g, '-')}.webm`;
        
        const audio: AudioRecorderResult = {
          url,
          blob,
          fileName,
          duration: duration / 1000 // Convert ms to seconds
        };
        
        setRecordedAudio(audio);
        resolve(audio);
      };
      
      // Request final data and stop
      mediaRecorderRef.current.requestData();
      mediaRecorderRef.current.stop();
    });
  }, []);
  
  const cleanup = useCallback(() => {
    // Stop and close media tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Clear chunks
    chunksRef.current = [];
    
    // Reset media recorder
    mediaRecorderRef.current = null;
    
    // Close audio context if open
    if (audioContext && audioContext.state !== 'closed') {
      audioContext.close().catch(console.error);
      setAudioContext(null);
    }
  }, [audioContext]);
  
  const reset = useCallback(() => {
    // Revoke any object URLs to prevent memory leaks
    if (recordedAudio?.url) {
      URL.revokeObjectURL(recordedAudio.url);
    }
    
    setRecordedAudio(null);
    cleanup();
  }, [cleanup, recordedAudio]);
  
  return {
    recordedAudio,
    audioContext,
    initializeAudioContext,
    requestMicrophoneAccess,
    setupMediaRecorder,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    cleanup,
    reset
  };
}
