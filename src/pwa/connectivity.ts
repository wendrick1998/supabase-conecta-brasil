
import { toast } from 'sonner';

// Offline detection
export function setupOfflineDetection() {
  // Show offline/online status
  window.addEventListener('online', () => {
    toast.success('Você está online novamente');
    document.body.classList.remove('offline-mode');
  });
  
  window.addEventListener('offline', () => {
    toast.error('Você está offline. Alguns recursos podem ficar indisponíveis.');
    document.body.classList.add('offline-mode');
  });
  
  // Check initial status
  if (!navigator.onLine) {
    document.body.classList.add('offline-mode');
  }
}

// Simple notification function
export function showNotification(message: string, type?: 'success' | 'warning' | 'info') {
  const notification = document.createElement('div');
  notification.className = 'pwa-notification ' + (type || 'info');
  notification.style.cssText = 'position: fixed; top: env(safe-area-inset-top, 0); left: 0; right: 0; padding: 16px; background-color: ' + 
    (type === 'success' ? '#4CAF50' : type === 'warning' ? '#FF9800' : '#2196F3') + 
    '; color: white; text-align: center; z-index: 9999; font-family: "Poppins", sans-serif; transform: translateY(-100%); transition: transform 0.3s ease-out;';
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.style.transform = 'translateY(0)';
    
    // Auto-hide after 3 seconds
    setTimeout(() => {
      notification.style.transform = 'translateY(-100%)';
      
      // Remove from DOM after transition
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }, 10);
}
