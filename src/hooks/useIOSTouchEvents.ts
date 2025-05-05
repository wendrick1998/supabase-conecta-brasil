
import { useEffect, RefObject } from 'react';
import { SafeTouchEvent, isIOSTouchEvent } from '@/types/touchEvents';

type TouchEventHandler = (event: SafeTouchEvent) => void;

interface UseIOSTouchEventsOptions {
  onStart?: TouchEventHandler;
  onMove?: TouchEventHandler;
  onEnd?: TouchEventHandler;
  onCancel?: TouchEventHandler;
  passive?: boolean;
}

/**
 * Hook for handling iOS-specific touch events properly
 */
export function useIOSTouchEvents(
  elementRef: RefObject<HTMLElement>,
  options: UseIOSTouchEventsOptions = {}
) {
  const { onStart, onMove, onEnd, onCancel, passive = true } = options;
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    // Safely handle touch events with proper type checking
    const handleTouchStart = (e: Event) => {
      if (isIOSTouchEvent(e) && onStart) {
        onStart(e);
      }
    };
    
    const handleTouchMove = (e: Event) => {
      if (isIOSTouchEvent(e) && onMove) {
        onMove(e);
      }
    };
    
    const handleTouchEnd = (e: Event) => {
      if (isIOSTouchEvent(e) && onEnd) {
        onEnd(e);
      }
    };
    
    const handleTouchCancel = (e: Event) => {
      if (isIOSTouchEvent(e) && onCancel) {
        onCancel(e);
      }
    };
    
    // Add all event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive });
    element.addEventListener('touchmove', handleTouchMove, { passive });
    element.addEventListener('touchend', handleTouchEnd, { passive });
    element.addEventListener('touchcancel', handleTouchCancel, { passive });
    
    // Clean up
    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('touchcancel', handleTouchCancel);
    };
  }, [elementRef, onStart, onMove, onEnd, onCancel, passive]);
}

export default useIOSTouchEvents;
