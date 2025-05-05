
import { useRef } from 'react';
import { useAudioRecorder } from './audio/useAudioRecorder';
import { useDragHandler } from './audio/useDragHandler';

export type DragDirection = 'none' | 'up' | 'left';

export const useAudioRecording = () => {
  // Use the refactored audio recorder hook
  const {
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
  } = useAudioRecorder();
  
  // Create button ref for drag handling
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Set up drag handlers
  const { 
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useDragHandler({
    isRecording,
    isLocked,
    onStartRecording: startRecording,
    onStopRecording: stopRecording,
    onCancelRecording: cancelRecording,
    setIsLocked
  });

  // Return the same interface as the original hook to maintain compatibility
  return {
    isRecording,
    isLocked,
    recordingTime,
    recordedAudio,
    dragDirection,
    buttonRef,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording,
    setIsLocked,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};

