
import { toast } from 'sonner';

// Setup app update check
export function setupAppUpdateCheck() {
  // Check for app updates periodically
  if ('serviceWorker' in navigator) {
    setInterval(() => {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          registration.update();
        }
      });
    }, 1000 * 60 * 60); // Check every hour
  }
}

// Show update notification
export function showUpdateNotification() {
  // This would be implemented to show a notification when a new version is available
  toast('Nova versão disponível!', {
    action: {
      label: 'Atualizar',
      onClick: () => {
        window.location.reload();
      }
    },
    duration: 0, // No auto-dismiss
  });
}
