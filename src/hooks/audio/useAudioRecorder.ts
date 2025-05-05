
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { useRecordingTimer } from './useRecordingTimer';

interface AudioRecordingResult {
  url: string;
  blob: Blob;
  duration: number;
}

export const useAudioRecorder = () => {
  // State for recording flow
  const [isRecording, setIsRecording] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [recordedAudio, setRecordedAudio] = useState<AudioRecordingResult | null>(null);
  const [dragDirection, setDragDirection] = useState<'none' | 'up' | 'left'>('none');
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Recording timer
  const { recordingTime, startTimer, stopTimer, resetTimer } = useRecordingTimer();
  
  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      stopMediaStream();
    };
  }, []);

  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      // Stop any existing recording
      if (isRecording) {
        await stopRecording();
      }
      
      // Reset state
      setIsRecording(true);
      setIsLocked(false);
      setRecordedAudio(null);
      setDragDirection('none');
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Reset audio chunks
      audioChunksRef.current = [];
      
      // Create media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      // Start recording
      mediaRecorderRef.current.start();
      startTimer();
      
      // Handle data available
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      // Handle recording stop
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(blob);
        const duration = recordingTime / 1000; // in seconds
        
        // Stop timer
        stopTimer();
        
        setIsRecording(false);
        setIsLocked(false);
        setRecordedAudio({
          url,
          blob,
          duration
        });
        
        // Stop the media stream
        stopMediaStream();
      };
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Não foi possível acessar o microfone. Verifique suas permissões.');
      setIsRecording(false);
      setIsLocked(false);
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Clear timer
    stopTimer();
  };

  const cancelRecording = () => {
    stopRecording();
    setIsRecording(false);
    setIsLocked(false);
    setRecordedAudio(null);
    setDragDirection('none');
    stopMediaStream();
  };
  
  const resetRecording = () => {
    setIsRecording(false);
    setIsLocked(false);
    resetTimer();
    setDragDirection('none');
    
    if (recordedAudio?.url) {
      URL.revokeObjectURL(recordedAudio.url);
    }
    setRecordedAudio(null);
  };
  
  // Export audio recorder interface
  return {
    isRecording,
    isLocked,
    recordingTime,
    recordedAudio,
    dragDirection,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording,
    setIsLocked,
    setDragDirection
  };
};

export type DragDirection = 'none' | 'up' | 'left';
