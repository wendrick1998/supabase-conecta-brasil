
// Hook for haptic feedback using the Web Vibration API

type FeedbackType = 'light' | 'medium' | 'heavy' | 'success' | 'error' | 'warning';

const useHapticFeedback = () => {
  // Check if vibration is supported
  const isSupported = (): boolean => {
    return 'vibrate' in navigator;
  };

  // Trigger haptic feedback
  const trigger = (type: FeedbackType = 'medium'): void => {
    if (!isSupported()) return;

    // Different vibration patterns for different feedback types
    const patterns = {
      light: [10],
      medium: [25],
      heavy: [50],
      success: [10, 30, 10],
      error: [100, 30, 100, 30],
      warning: [30, 20, 30]
    };

    navigator.vibrate(patterns[type]);
  };

  // Specific feedback methods for common actions
  const success = (): void => trigger('success');
  const error = (): void => trigger('error');
  const warning = (): void => trigger('warning');
  
  // Subtle tap feedback (for buttons, etc)
  const tap = (): void => trigger('light');
  
  // Selection change feedback
  const selectionChanged = (): void => trigger('light');
  
  // Notification feedback
  const notification = (): void => trigger('medium');
  
  // Impact feedback (for drag & drop operations)
  const impact = (): void => trigger('heavy');

  return {
    isSupported,
    trigger,
    success,
    error,
    warning,
    tap,
    selectionChanged,
    notification,
    impact
  };
};

export default useHapticFeedback;
