
import { useState, useRef, useCallback } from 'react';

export type DragDirection = 'none' | 'up' | 'left';

interface UseDragHandlerProps {
  isRecording: boolean;
  isLocked: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
  setIsLocked: (locked: boolean) => void;
}

export const useDragHandler = ({
  isRecording,
  isLocked,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  setIsLocked
}: UseDragHandlerProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<DragDirection>('none');
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Constants
  const DRAG_THRESHOLD = 40;
  
  // Drag handlers for mobile-like audio recording experience
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    // Only handle left clicks
    if (e.button !== 0) return;
    
    // Start recording
    if (!isRecording) {
      onStartRecording();
    }
    
    // Set up dragging
    startPosRef.current = { x: e.clientX, y: e.clientY };
    setDragDirection('none');
    setIsDragging(true);
    
    // Capture the pointer to detect movements outside the button
    if (buttonRef.current) {
      buttonRef.current.setPointerCapture(e.pointerId);
    }
    
    // Prevent text selection
    e.preventDefault();
  }, [isRecording, onStartRecording]);
  
  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!isRecording || !startPosRef.current || isLocked) return;
    
    const deltaX = e.clientX - startPosRef.current.x;
    const deltaY = e.clientY - startPosRef.current.y;
    
    // Check if user is dragging up (lock) or left (cancel)
    if (Math.abs(deltaY) > DRAG_THRESHOLD && deltaY < 0) {
      setDragDirection('up');
    } else if (Math.abs(deltaX) > DRAG_THRESHOLD && deltaX < 0) {
      setDragDirection('left');
    } else {
      setDragDirection('none');
    }
  }, [isRecording, isLocked]);
  
  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (!isRecording) return;
    
    // Release pointer capture
    if (buttonRef.current) {
      buttonRef.current.releasePointerCapture(e.pointerId);
    }
    
    // Handle different drag directions
    if (dragDirection === 'up') {
      // Lock the recording
      setIsLocked(true);
    } else if (dragDirection === 'left') {
      // Cancel the recording
      onCancelRecording();
    } else if (!isLocked) {
      // Regular stop if not locked and not dragged
      onStopRecording();
    }
    
    startPosRef.current = null;
    setIsDragging(false);
    setDragDirection('none');
  }, [isRecording, dragDirection, isLocked, setIsLocked, onCancelRecording, onStopRecording]);

  return {
    isDragging,
    dragDirection,
    buttonRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};
