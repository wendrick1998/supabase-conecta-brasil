
// Service Worker for Vendah+ PWA
importScripts('./sw-modules/cache-strategies.js');
importScripts('./sw-modules/routes.js');
importScripts('./sw-modules/offline-sync.js');
importScripts('./sw-modules/notifications.js');
importScripts('./sw-modules/sw-utils.js');
importScripts('./sw-modules/update-handler.js');
importScripts('./sw-modules/lifecycle-events.js');

// Install event - precache static assets
self.addEventListener('install', event => {
  self.handleInstallEvent(event);
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  self.handleActivateEvent(event);
});

// Fetch event - with different strategies
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  const url = new URL(event.request.url);
  
  // Skip some cross-origin requests but make sure Supabase is handled
  if (url.origin !== self.location.origin && !self.isApiRequest(url.href)) {
    return;
  }

  const strategy = self.getCacheStrategy(url);
  
  if (strategy === 'network-first') {
    event.respondWith(self.networkFirstStrategy(event, self.getCurrentCacheName()));
  } else if (strategy === 'stale-while-revalidate') {
    event.respondWith(self.staleWhileRevalidateStrategy(event, self.getCurrentCacheName()));
  } else {
    event.respondWith(self.cacheFirstStrategy(event, self.getCurrentCacheName()));
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

// Listen for messages from clients
self.addEventListener('message', event => {
  self.handleMessageEvent(event);
});
