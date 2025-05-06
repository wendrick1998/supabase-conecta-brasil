
// Handle service worker updates and versioning

import { logSW } from './sw-utils.js';

const CURRENT_VERSION = 'vendah-plus-v1.1';
const PREVIOUS_VERSIONS = ['vendah-plus-v1'];

// Check for and clean up old cache versions
export async function cleanupOldVersions() {
  const cacheNames = await caches.keys();
  
  logSW(`Checking for old cache versions to clean up...`);
  
  const oldCacheNames = cacheNames.filter(name => 
    PREVIOUS_VERSIONS.includes(name) || (name.startsWith('vendah-plus-') && !name.includes(CURRENT_VERSION))
  );
  
  if (oldCacheNames.length > 0) {
    logSW(`Found ${oldCacheNames.length} old cache versions to delete: ${oldCacheNames.join(', ')}`);
    return Promise.all(oldCacheNames.map(cacheName => caches.delete(cacheName)));
  }
  
  logSW('No old cache versions to clean up');
  return Promise.resolve();
}

// Notify clients about an update
export function notifyClientsAboutUpdate() {
  logSW('Notifying clients about new version');
  
  self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'UPDATE_AVAILABLE',
        version: CURRENT_VERSION
      });
    });
  });
}

// Force activate the service worker on all open clients
export async function forceActivateServiceWorker() {
  logSW('Taking control of all clients');
  
  // Skip waiting forces the waiting service worker to become the active one
  await self.skipWaiting();
  
  // Claim all open clients
  await self.clients.claim();
  
  logSW('Service worker activated and controlling all clients');
}

// Get the current cache name
export function getCurrentCacheName() {
  return CURRENT_VERSION;
}
