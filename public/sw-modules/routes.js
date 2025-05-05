
// Define which URLs should use which caching strategy

// Assets to precache
export const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png',
  '/lovable-uploads/02517599-ec7d-4486-a1f3-a3c80647cbda.png'
];

// URLs that should be cached with stale-while-revalidate strategy
export const DYNAMIC_CONTENT = [
  '/dashboard',
  '/leads',
  '/pipeline',
  '/inbox',
  '/pulse',
];

// API endpoints that should be handled with network-first strategy
export const API_URLS = [
  '/api/',
  'supabase.co'
];

// Helper function to determine caching strategy based on URL
export function getCacheStrategy(url) {
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
