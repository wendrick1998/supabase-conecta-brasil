
// Define custom TypeScript types for better touch event handling
// especially for iOS-specific compatibility

// Full TouchEvent with guaranteed properties for iOS compatibility
export interface SafeTouchEvent extends TouchEvent {
  touches: TouchList;
  targetTouches: TouchList;
  changedTouches: TouchList;
}

// Helper type guard function to check if an event is a TouchEvent
export function isTouchEvent(event: Event): event is SafeTouchEvent {
  return 'touches' in event && event instanceof TouchEvent;
}

// Specific helper for iOS devices
export function isIOSTouchEvent(event: Event): event is SafeTouchEvent {
  return isTouchEvent(event) && /iPad|iPhone|iPod/.test(navigator.userAgent);
}

// Touch position helper types
export interface TouchPosition {
  x: number;
  y: number;
}

// Get touch position from a TouchEvent in a cross-platform way
export function getTouchPosition(event: SafeTouchEvent): TouchPosition | null {
  if (event.touches && event.touches.length > 0) {
    return {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  }
  return null;
}
