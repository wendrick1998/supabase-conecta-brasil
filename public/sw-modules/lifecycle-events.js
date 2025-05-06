
// Service worker lifecycle events handlers

import { logSW } from './sw-utils.js';
import { STATIC_ASSETS } from './routes.js';
import { getCurrentCacheName, cleanupOldVersions, forceActivateServiceWorker } from './update-handler.js';

// Handler for 'install' event
export async function handleInstallEvent(event) {
  logSW('Service Worker installing');

  // Precache static assets
  const cacheName = getCurrentCacheName();
  
  event.waitUntil(
    caches.open(cacheName)
      .then(cache => {
        logSW(`Opened cache ${cacheName}`);
        logSW(`Precaching ${STATIC_ASSETS.length} static assets`);
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        logSW('Installation complete');
        return forceActivateServiceWorker();
      })
      .catch(error => {
        logSW(`Installation failed: ${error}`, 'error');
      })
  );
}

// Handler for 'activate' event
export async function handleActivateEvent(event) {
  logSW('Service Worker activating');
  
  event.waitUntil(
    cleanupOldVersions()
      .then(() => forceActivateServiceWorker())
      .then(() => {
        logSW('Activation complete. Service worker now controls all clients.');
      })
      .catch(error => {
        logSW(`Activation failed: ${error}`, 'error');
      })
  );
}

// Handler for 'message' event
export function handleMessageEvent(event) {
  const message = event.data;
  
  logSW(`Received message: ${JSON.stringify(message)}`);
  
  if (message.type === 'SKIP_WAITING') {
    logSW('Skip waiting command received');
    self.skipWaiting();
  }
}
