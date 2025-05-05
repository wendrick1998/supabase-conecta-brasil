
// Initialize service worker for PWA functionality
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        // Handle service worker updates
        if (registration.installing) {
          console.log('Service worker installing');
        } else if (registration.waiting) {
          console.log('Service worker installed and waiting');
        } else if (registration.active) {
          console.log('Service worker active');
        }
        
        // Listen for new service worker installation
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New service worker available, reload to update');
                // Notify the user that an update is available
                window.dispatchEvent(new CustomEvent('serviceWorkerUpdateAvailable'));
              }
            });
          }
        });
        
        // Handle controller changes
        let refreshing = false;
        navigator.serviceWorker.addEventListener('controllerchange', () => {
          if (!refreshing) {
            refreshing = true;
            console.log('New service worker controller, refreshing page');
            window.location.reload();
          }
        });
        
        console.log('Service worker registered successfully');
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    });
  }
}

// Request notification permission with better UX
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}
