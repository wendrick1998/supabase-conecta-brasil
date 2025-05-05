
// Service Worker for Vendah+ PWA
const CACHE_NAME = 'vendah-plus-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png',
  '/lovable-uploads/02517599-ec7d-4486-a1f3-a3c80647cbda.png'
];

// Dynamic data URL patterns
const API_URLS = [
  '/api/',
  'supabase.co'
];

// Install event - precache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS);
      })
  );
  // Force immediate activation
  self.skipWaiting();
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
      // Take control of all clients/tabs
      return self.clients.claim();
    })
  );
});

// Fetch event - network-first for API, cache-first for assets
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip cross-origin requests
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin && !url.href.includes('supabase.co')) {
    return;
  }

  // Is this an API request?
  const isApiRequest = API_URLS.some(apiUrl => event.request.url.includes(apiUrl));

  if (isApiRequest) {
    // Network-first strategy for API requests
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone the response to store in cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              // Only cache successful responses
              if (response.status === 200) {
                cache.put(event.request, responseToCache);
              }
            });
            
          return response;
        })
        .catch(() => {
          // Fallback to cache if network fails
          return caches.match(event.request);
        })
    );
  } else {
    // Cache-first strategy for static assets
    event.respondWith(
      caches.match(event.request)
        .then(cachedResponse => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // Not in cache, fetch from network
          return fetch(event.request)
            .then(response => {
              // Clone the response to store in cache
              const responseToCache = response.clone();
              
              caches.open(CACHE_NAME)
                .then(cache => {
                  // Only cache successful responses
                  if (response.status === 200) {
                    cache.put(event.request, responseToCache);
                  }
                });
                
              return response;
            });
        })
    );
  }
});

// Background sync for offline messages
self.addEventListener('sync', event => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(syncMessages());
  }
});

// Function to sync messages from IndexedDB when online
async function syncMessages() {
  // This would be implemented to sync any stored messages from IndexedDB
  console.log('Syncing messages in background');
  // Implementation would depend on your data storage strategy
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
    }
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Vendah+', options)
  );
});

// Notification click handler - open specific URL
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({type: 'window'})
      .then(clientList => {
        const url = event.notification.data.url;
        
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
});
