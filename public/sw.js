// Service Worker for Vendah+ PWA
const CACHE_NAME = 'vendah-plus-v1';

// Assets to precache
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png',
  '/lovable-uploads/02517599-ec7d-4486-a1f3-a3c80647cbda.png'
];

// URLs that should be cached with stale-while-revalidate strategy
const DYNAMIC_CONTENT = [
  '/dashboard',
  '/leads',
  '/pipeline',
  '/inbox',
  '/pulse',
];

// API endpoints that should be handled with network-first strategy
const API_URLS = [
  '/api/',
  'supabase.co'
];

// Install event - precache static assets
self.addEventListener('install', event => {
  // Skip waiting forces the waiting service worker to become the active one
  self.skipWaiting();
  
  // Precache static assets
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Take control of all clients/tabs immediately
      return self.clients.claim();
    })
  );
});

// Helper function to determine caching strategy based on URL
function getCacheStrategy(url) {
  // Is it an API request?
  if (API_URLS.some(apiUrl => url.includes(apiUrl))) {
    return 'network-first';
  }
  
  // Is it a dynamic page?
  if (DYNAMIC_CONTENT.some(path => url.pathname.includes(path))) {
    return 'stale-while-revalidate';
  }
  
  // Default to cache-first for static assets
  return 'cache-first';
}

// Fetch event - with different strategies
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Skip some cross-origin requests but make sure Supabase is handled
  if (url.origin !== self.location.origin && !url.href.includes('supabase.co')) {
    return;
  }

  const strategy = getCacheStrategy(url);
  
  if (strategy === 'network-first') {
    // Network-first strategy (for API calls)
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response to store in cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              if (response.status === 200) {
                cache.put(event.request, responseToCache);
              }
            });
            
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              
              // If no cache found, return offline fallback
              return caches.match('/index.html');
            });
        })
    );
  } else if (strategy === 'stale-while-revalidate') {
    // Stale-while-revalidate (for dynamic content)
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          const fetchPromise = fetch(event.request)
            .then(networkResponse => {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  if (networkResponse.status === 200) {
                    cache.put(event.request, responseToCache);
                  }
                });
              return networkResponse;
            })
            .catch(() => {
              // If network fails and no cache, return offline fallback
              return caches.match('/index.html');
            });
          
          // Return the cached response immediately, or the network response when it arrives
          return cachedResponse || fetchPromise;
        })
    );
  } else {
    // Cache-first strategy (for static assets)
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Not in cache, fetch from network
          return fetch(event.request)
            .then(response => {
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  if (response.status === 200) {
                    cache.put(event.request, responseToCache);
                  }
                });
                
              return response;
            })
            .catch(() => {
              // For navigation requests, return the offline fallback
              if (event.request.mode === 'navigate') {
                return caches.match('/index.html');
              }
              
              // For image requests, provide a placeholder
              if (event.request.destination === 'image') {
                return caches.match('/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png');
              }
              
              // Otherwise, just fail silently
              return new Response('Offline content not available');
            });
        })
    );
  }
});

// Background sync for offline messages
self.addEventListener('sync', event => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  } else if (event.tag === 'sync-leads') {
    event.waitUntil(syncLeads());
  }
});

// Function to sync messages from IndexedDB when online
async function syncMessages() {
  console.log('Syncing messages in background');
  
  // Implementation would depend on your data storage strategy
  try {
    // Example implementation using localStorage for simplicity
    const offlineMessages = localStorage.getItem('offline-messages');
    
    if (offlineMessages) {
      const messages = JSON.parse(offlineMessages);
      
      // Process each offline message
      for (const message of messages) {
        try {
          // Send to server - would be implemented with fetch or your API client
          console.log('Syncing message:', message);
          
          // After successful sync, remove from offline storage
        } catch (error) {
          console.error('Failed to sync message:', error);
        }
      }
      
      // Clear synced messages
      localStorage.removeItem('offline-messages');
    }
  } catch (error) {
    console.error('Error syncing messages:', error);
  }
}

// Function to sync leads from IndexedDB when online
async function syncLeads() {
  console.log('Syncing leads in background');
  
  // Similar implementation as syncMessages but for leads
}

// Push notification event handler
self.addEventListener('push', event => {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body || 'Nova notificação',
    icon: '/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png',
    badge: '/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'view',
        title: 'Ver',
        icon: '/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png'
      }
    ],
    silent: false,
    renotify: true,
    tag: data.tag || 'default-tag'
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Vendah+', options)
  );
});

// Notification click handler - open specific URL
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  // Handle notification actions
  if (event.action === 'view') {
    // Handle View action
    const url = event.notification.data.url;
    
    event.waitUntil(
      clients.matchAll({type: 'window'})
        .then(clientList => {
          // Check if there's already a window/tab open with the target URL
          for (const client of clientList) {
            if (client.url === url && 'focus' in client) {
              return client.focus();
            }
          }
          
          // If no window/tab is open, open a new one
          if (clients.openWindow) {
            return clients.openWindow(url);
          }
        })
    );
  }
  // If no action or 'close' action, just close the notification
});

// Add periodic cache cleanup
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(cleanupCache());
  }
});

// Function to cleanup old cached data
async function cleanupCache() {
  const cache = await caches.open(CACHE_NAME);
  const keys = await cache.keys();
  
  // Find entries older than 7 days and remove them
  const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
  
  for (const request of keys) {
    // This would need a way to check timestamp which isn't directly available
    // Would require additional tracking of cache age
  }
}
