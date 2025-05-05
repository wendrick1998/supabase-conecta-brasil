
import { setupInstallPrompt, checkAndShowInstallationTutorial } from './installation';
import { setupIOSSpecificFeatures, setupTouchFeedback } from './deviceDetection';
import { setupOfflineDetection } from './connectivity';
import { setupAppUpdateCheck } from './updates';
import { setupPullToRefresh } from './pullToRefresh';
import { tryRequestNotificationPermission } from './notifications';

export async function enablePWAFeatures() {
  // Setup installation
  setupInstallPrompt();
  
  // Setup iOS specific features
  setupIOSSpecificFeatures();
  
  // Setup offline detection
  setupOfflineDetection();
  
  // Setup app update check
  setupAppUpdateCheck();
  
  // Request notification permissions after a delay (don't bombard user on first load)
  setTimeout(() => {
    tryRequestNotificationPermission();
  }, 10000); // 10 seconds delay
  
  // Set up iOS specific pull-to-refresh
  setupPullToRefresh();
}

// Export public functions from each module
export { showInstallPrompt, isRunningAsPWA } from './installation';
export { isIOS } from './deviceDetection';
export { showNotification } from './connectivity';
export { showUpdateNotification } from './updates';

// For use in vanilla JS context (index.html)
export { setupTouchFeedback, checkAndShowInstallationTutorial };
