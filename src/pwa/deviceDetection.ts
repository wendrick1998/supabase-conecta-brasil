
// Check if the device is running iOS
export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Setup iOS specific features
export function setupIOSSpecificFeatures() {
  if (isIOS()) {
    // Add iOS specific class to body
    document.body.classList.add('ios-device');
    
    // Fix viewport issues on iOS devices with notches
    updateViewportForNotch();
    
    // Setup iOS-specific interactions
    setupIOSInteractions();
  }
}

// Update viewport for iOS devices with notches
function updateViewportForNotch() {
  // Add padding for the notch and home indicator
  document.body.style.paddingTop = 'env(safe-area-inset-top)';
  document.body.style.paddingBottom = 'env(safe-area-inset-bottom)';
  document.body.style.paddingLeft = 'env(safe-area-inset-left)';
  document.body.style.paddingRight = 'env(safe-area-inset-right)';
}

// Setup iOS-specific interactions
function setupIOSInteractions() {
  // Disable text selection to feel more native
  document.body.style.webkitUserSelect = 'none';
  
  // Apply webkit properties correctly
  const style = document.body.getAttribute('style') || '';
  document.body.setAttribute('style', style + '-webkit-touch-callout: none;');
  
  // Disable long-press context menu on links and images
  document.addEventListener('contextmenu', (e) => {
    // Allow context menu in text inputs and textareas
    if (!(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
      e.preventDefault();
    }
  });
  
  // Add touch feedback to buttons
  document.querySelectorAll('button, a').forEach(el => {
    el.addEventListener('touchstart', () => {
      el.classList.add('active-touch');
    });
    
    el.addEventListener('touchend', () => {
      el.classList.remove('active-touch');
    });
  });
}

// Setup touch feedback for buttons and interactive elements
export function setupTouchFeedback() {
  const interactiveElements = document.querySelectorAll('button, a, [role="button"], .interactive');
  
  interactiveElements.forEach(element => {
    element.addEventListener('touchstart', function() {
      this.classList.add('active-touch');
    });
    
    ['touchend', 'touchcancel'].forEach(event => {
      element.addEventListener(event, function() {
        this.classList.remove('active-touch');
      });
    });
  });
}
