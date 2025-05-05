
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { registerServiceWorker } from './registerServiceWorker'
import { enablePWAFeatures } from './pwa' 

// Initialize the app
const initApp = async () => {
  // Register service worker for PWA functionality
  registerServiceWorker();
  
  // Enable PWA-specific features (offline mode, native integration, etc.)
  await enablePWAFeatures();

  // Create the React root and render the app
  const rootElement = document.getElementById("root");
  if (rootElement) {
    createRoot(rootElement).render(<App />);
  }
}

// Start the application
initApp();

// Add iOS bounce/overscroll handling
if (document.documentElement) {
  document.documentElement.style.height = '100%';
  document.documentElement.style.overflowY = 'hidden';
  document.body.style.height = '100%';
  document.body.style.overflowY = 'auto';
  
  // Add iOS-specific classes to scrollable containers
  const addIosScrollClass = () => {
    document.querySelectorAll('.overflow-y-auto, .overflow-auto').forEach(el => {
      el.classList.add('ios-scroll');
    });
  };
  
  // Add initially and whenever DOM changes
  addIosScrollClass();
  
  // Set up a mutation observer to add iOS scroll to new elements
  const observer = new MutationObserver(addIosScrollClass);
  observer.observe(document.body, { childList: true, subtree: true });
}

// Disable iOS-specific feature detection
window.onload = () => {
  // Disable overscroll/bounce at the document level
  document.body.addEventListener('touchmove', function(e) {
    if (document.body.classList.contains('disable-overscroll')) {
      e.preventDefault();
    }
  }, { passive: false });
};
