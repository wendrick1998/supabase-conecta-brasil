
// Device utility functions

// Trigger haptic feedback when available
export function hapticFeedback() {
  if ('navigator' in window && 'vibrate' in navigator) {
    navigator.vibrate(10); // Short vibration of 10ms
  }
}

// Check if device is iOS
export function isIOSDevice() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Check if running in standalone PWA mode
export function isRunningAsPWA() {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true;
}
