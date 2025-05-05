// Different caching strategies for the service worker

// Cache-first strategy (for static assets)
export function cacheFirstStrategy(event, CACHE_NAME) {
  return caches.match(event.request)
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
    });
}

// Network-first strategy (for API calls)
export function networkFirstStrategy(event, CACHE_NAME) {
  return fetch(event.request)
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
    });
}

// Stale-while-revalidate (for dynamic content)
export function staleWhileRevalidateStrategy(event, CACHE_NAME) {
  return caches.match(event.request)
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
    });
}
