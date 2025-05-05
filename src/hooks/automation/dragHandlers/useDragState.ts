
import { useState, useRef } from 'react';

/**
 * Hook for managing basic drag state
 */
export const useDragState = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);

  return {
    isDragging,
    setIsDragging,
    dragOffset,
    setDragOffset,
    canvasRef
  };
};
