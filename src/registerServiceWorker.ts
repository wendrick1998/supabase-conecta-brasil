
// Unique identifier to track service worker version
const SW_VERSION = '1.0.0';

// Function to register the service worker
export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Check for updates on page load
        registration.addEventListener('updatefound', () => {
          // New service worker is being installed
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                showUpdateNotification();
              }
            });
          }
        });
        
        // Set up periodic check for updates (every 1 hour)
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000);
        
        // Setup background sync for offline functionality
        setupBackgroundSync(registration);
        
      } catch (error) {
        console.error('ServiceWorker registration failed: ', error);
      }
    });
    
    // Listen for controlling service worker changing
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      // The controlling service worker changed, probably due to a new worker being activated
      console.log('Service worker controller changed');
    });
  }
}

// Function to setup background sync
async function setupBackgroundSync(registration: ServiceWorkerRegistration) {
  try {
    if ('sync' in registration) {
      // Register for background sync - this would sync messages when online
      await registration.sync.register('sync-messages');
      console.log('Background sync registered');
    }
  } catch (err) {
    console.error('Background sync registration failed:', err);
  }
}

// Function to show update notification
function showUpdateNotification() {
  // This would be implemented to show a notification when a new version is available
  // You could use your existing toast system
  if (window.confirm('Nova versão disponível! Atualizar agora?')) {
    window.location.reload();
  }
}

// Function to request push notification permission
export async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted');
      return true;
    } else {
      console.log('Notification permission denied');
      return false;
    }
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
}

// Subscribe to push notifications
export async function subscribeToPushNotifications() {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    console.log('Push notifications not supported');
    return;
  }
  
  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        // This would be your VAPID public key - for now using a placeholder
        'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U'
      )
    });
    
    console.log('User is subscribed to push notifications');
    // Here you would send the subscription to your server
    return subscription;
  } catch (error) {
    console.error('Failed to subscribe to push notifications:', error);
  }
}

// Helper function to convert base64 to Uint8Array for VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');
  
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
