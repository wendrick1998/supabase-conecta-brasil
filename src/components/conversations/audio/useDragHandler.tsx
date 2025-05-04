
import { useState, useRef } from 'react';

export type DragDirection = 'none' | 'up' | 'left';

interface UseDragHandlerProps {
  isRecording: boolean;
  isLocked: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
  setIsLocked: (isLocked: boolean) => void;
}

interface UseDragHandlerResult {
  isDragging: boolean;
  dragDirection: DragDirection;
  startPos: React.MutableRefObject<{ x: number; y: number } | null>;
  buttonRef: React.RefObject<HTMLButtonElement>;
  handlePointerDown: (e: React.PointerEvent) => void;
  handlePointerMove: (e: React.PointerEvent) => void;
  handlePointerUp: (e: React.PointerEvent) => void;
}

export const useDragHandler = ({
  isRecording,
  isLocked,
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  setIsLocked
}: UseDragHandlerProps): UseDragHandlerResult => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<DragDirection>('none');
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Threshold for dragging (in pixels)
  const DRAG_THRESHOLD = 40;
  
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only handle left clicks
    if (e.button !== 0) return;
    
    // Start recording
    if (!isRecording) {
      onStartRecording();
    }
    
    // Set up dragging
    startPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    setDragDirection('none');
    
    // Capture the pointer to detect movements outside the button
    if (buttonRef.current) {
      buttonRef.current.setPointerCapture(e.pointerId);
    }
    
    // Prevent text selection
    e.preventDefault();
  };
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !startPos.current || isLocked) return;
    
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    
    // Check if user is dragging up (lock) or left (cancel)
    if (Math.abs(deltaY) > DRAG_THRESHOLD && deltaY < 0) {
      setDragDirection('up');
    } else if (Math.abs(deltaX) > DRAG_THRESHOLD && deltaX < 0) {
      setDragDirection('left');
    } else {
      setDragDirection('none');
    }
  };
  
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !isRecording) return;
    
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
      setIsLocked(false);
    } else if (!isLocked) {
      // Regular stop if not locked and not dragged
      onStopRecording();
    }
    
    setIsDragging(false);
    startPos.current = null;
  };
  
  return {
    isDragging,
    dragDirection,
    startPos,
    buttonRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};
