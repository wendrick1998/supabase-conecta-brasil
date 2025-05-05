
import { useCallback } from 'react';

/**
 * Hook for calculating positions and applying grid snapping
 */
export const usePositionCalculation = (canvasRef: React.RefObject<HTMLDivElement>) => {
  // Calculate position relative to canvas with grid snapping
  const calculateCanvasPosition = useCallback((x: number, y: number, snapToGrid?: (x: number, y: number) => { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    
    const canvasRect = canvas.getBoundingClientRect();
    const canvasScrollLeft = canvas.scrollLeft;
    const canvasScrollTop = canvas.scrollTop;
    
    // Calculate position relative to canvas
    const posX = Math.max(0, x - canvasRect.left + canvasScrollLeft);
    const posY = Math.max(0, y - canvasRect.top + canvasScrollTop);
    
    // Apply grid snapping if provided
    if (snapToGrid) {
      return snapToGrid(posX, posY);
    }
    
    return { x: posX, y: posY };
  }, [canvasRef]);

  return {
    calculateCanvasPosition
  };
};
