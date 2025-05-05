
// Service Worker for Vendah+ PWA
importScripts('./sw-modules/cache-strategies.js');
importScripts('./sw-modules/routes.js');
importScripts('./sw-modules/offline-sync.js');
importScripts('./sw-modules/notifications.js');

const CACHE_NAME = 'vendah-plus-v1';

// Install event - precache static assets
self.addEventListener('install', event => {
  // Skip waiting forces the waiting service worker to become the active one
  self.skipWaiting();
  
  // Precache static assets
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(self.STATIC_ASSETS);
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

// Fetch event - with different strategies
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Skip some cross-origin requests but make sure Supabase is handled
  if (url.origin !== self.location.origin && !url.href.includes('supabase.co')) {
    return;
  }

  const strategy = self.getCacheStrategy(url);
  
  if (strategy === 'network-first') {
    event.respondWith(self.networkFirstStrategy(event, CACHE_NAME));
  } else if (strategy === 'stale-while-revalidate') {
    event.respondWith(self.staleWhileRevalidateStrategy(event, CACHE_NAME));
  } else {
    event.respondWith(self.cacheFirstStrategy(event, CACHE_NAME));
  }
});

// Background sync for offline messages
self.addEventListener('sync', event => {
  if (event.tag === 'sync-messages') {
    event.waitUntil(self.syncMessages());
  } else if (event.tag === 'sync-leads') {
    event.waitUntil(self.syncLeads());
  }
});

// Push notification event handler
self.addEventListener('push', event => {
  event.waitUntil(self.handlePushEvent(event));
});

// Notification click handler - open specific URL
self.addEventListener('notificationclick', event => {
  event.waitUntil(self.handleNotificationClick(event));
});

// Add periodic cache cleanup
self.addEventListener('periodicsync', event => {
  if (event.tag === 'cache-cleanup') {
    event.waitUntil(self.cleanupCache());
  }
});
