
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';

export type DragDirection = 'none' | 'up' | 'left';

interface AudioRecordingState {
  isRecording: boolean;
  isLocked: boolean;
  recordingTime: number;
  recordedAudio: {
    url: string;
    blob: Blob;
    duration: number;
  } | null;
  dragDirection: DragDirection;
}

export const useAudioRecording = () => {
  // State management
  const [state, setState] = useState<AudioRecordingState>({
    isRecording: false,
    isLocked: false,
    recordingTime: 0,
    recordedAudio: null,
    dragDirection: 'none',
  });
  
  // Refs
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const startTimeRef = useRef<number>(0);
  
  // Constants
  const MAX_RECORDING_TIME_MS = 5 * 60 * 1000; // 5 minutes
  const DRAG_THRESHOLD = 40;

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopRecording();
      stopMediaStream();
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
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
      if (state.isRecording) {
        await stopRecording();
      }
      
      // Reset state
      setState(prev => ({
        ...prev, 
        isRecording: true, 
        isLocked: false,
        recordingTime: 0,
        recordedAudio: null,
        dragDirection: 'none'
      }));
      
      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      // Reset audio chunks
      audioChunksRef.current = [];
      
      // Create media recorder
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      // Start recording
      mediaRecorderRef.current.start();
      startTimeRef.current = Date.now();
      
      // Set up timer for recording duration
      timerRef.current = window.setInterval(() => {
        const currentTime = Date.now() - startTimeRef.current;
        setState(prev => ({ ...prev, recordingTime: currentTime }));
        
        // Auto-stop if we hit max duration
        if (currentTime >= MAX_RECORDING_TIME_MS) {
          stopRecording();
        }
      }, 100);
      
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
        const duration = (Date.now() - startTimeRef.current) / 1000; // in seconds
        
        // Stop timer
        if (timerRef.current) {
          clearInterval(timerRef.current);
          timerRef.current = null;
        }
        
        setState(prev => ({
          ...prev,
          isRecording: false,
          isLocked: false,
          recordedAudio: {
            url,
            blob,
            duration
          }
        }));
        
        // Stop the media stream
        stopMediaStream();
      };
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Não foi possível acessar o microfone. Verifique suas permissões.');
      setState(prev => ({ ...prev, isRecording: false, isLocked: false }));
    }
  };

  const stopRecording = async () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    // Clear timer if it exists
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const cancelRecording = () => {
    stopRecording();
    setState(prev => ({ 
      ...prev, 
      isRecording: false, 
      isLocked: false,
      recordedAudio: null,
      dragDirection: 'none' 
    }));
    stopMediaStream();
  };
  
  const resetRecording = () => {
    setState({
      isRecording: false,
      isLocked: false,
      recordingTime: 0,
      recordedAudio: null,
      dragDirection: 'none'
    });
    
    if (state.recordedAudio?.url) {
      URL.revokeObjectURL(state.recordedAudio.url);
    }
  };
  
  // Drag handlers for mobile-like audio recording experience
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only handle left clicks
    if (e.button !== 0) return;
    
    // Start recording
    if (!state.isRecording) {
      startRecording();
    }
    
    // Set up dragging
    startPosRef.current = { x: e.clientX, y: e.clientY };
    setState(prev => ({ ...prev, dragDirection: 'none' }));
    
    // Capture the pointer to detect movements outside the button
    if (buttonRef.current) {
      buttonRef.current.setPointerCapture(e.pointerId);
    }
    
    // Prevent text selection
    e.preventDefault();
  };
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!state.isRecording || !startPosRef.current || state.isLocked) return;
    
    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;
    
    // Check if user is dragging up (lock) or left (cancel)
    if (Math.abs(deltaY) > DRAG_THRESHOLD && deltaY < 0) {
      setState(prev => ({ ...prev, dragDirection: 'up' }));
    } else if (Math.abs(deltaX) > DRAG_THRESHOLD && deltaX < 0) {
      setState(prev => ({ ...prev, dragDirection: 'left' }));
    } else {
      setState(prev => ({ ...prev, dragDirection: 'none' }));
    }
  };
  
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!state.isRecording) return;
    
    // Release pointer capture
    if (buttonRef.current) {
      buttonRef.current.releasePointerCapture(e.pointerId);
    }
    
    // Handle different drag directions
    if (state.dragDirection === 'up') {
      // Lock the recording
      setState(prev => ({ ...prev, isLocked: true, dragDirection: 'none' }));
    } else if (state.dragDirection === 'left') {
      // Cancel the recording
      cancelRecording();
    } else if (!state.isLocked) {
      // Regular stop if not locked and not dragged
      stopRecording();
    }
    
    startPosRef.current = null;
  };

  return {
    ...state,
    buttonRef,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording,
    setIsLocked: (locked: boolean) => setState(prev => ({ ...prev, isLocked: locked })),
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};
