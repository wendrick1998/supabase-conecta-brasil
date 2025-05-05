
import { toast } from 'sonner';
import { requestNotificationPermission } from './registerServiceWorker';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Add TouchEvent interface for TypeScript
interface TouchEventWithTouches extends TouchEvent {
  touches: TouchList;
}

// Store the deferred prompt for later use
let deferredPrompt: BeforeInstallPromptEvent | null = null;

export async function enablePWAFeatures() {
  setupInstallPrompt();
  setupIOSSpecificFeatures();
  setupOfflineDetection();
  setupAppUpdateCheck();
  
  // Request notification permissions after a delay (don't bombard user on first load)
  setTimeout(() => {
    tryRequestNotificationPermission();
  }, 10000); // 10 seconds delay
  
  // Set up iOS specific pull-to-refresh
  setupPullToRefresh();
}

// Check if the app is running as a PWA or in browser
export function isRunningAsPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true || 
         document.referrer.includes('android-app://');
}

// Check if the device is running iOS
export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) || 
         (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
}

// Install prompt handling
function setupInstallPrompt() {
  // Listen for beforeinstallprompt event
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the default prompt
    e.preventDefault();
    
    // Store the event for later use
    deferredPrompt = e as BeforeInstallPromptEvent;
    
    // If not running as PWA, show install button after a delay
    if (!isRunningAsPWA()) {
      setTimeout(() => {
        // Show install button or notification
        showInstallPrompt();
      }, 30000); // 30 seconds delay
    }
  });
  
  // Listen for the appinstalled event
  window.addEventListener('appinstalled', () => {
    // Clear the deferredPrompt variable
    deferredPrompt = null;
    
    // Log or track app installation
    console.log('PWA was installed');
    
    // Show success message
    toast.success('Aplicativo instalado com sucesso!');
  });
}

// Show install prompt to the user
export function showInstallPrompt() {
  if (deferredPrompt) {
    // For non-iOS devices that support the install prompt
    toast('Instale o Vendah+ para uma experiência melhor', {
      action: {
        label: 'Instalar',
        onClick: async () => {
          if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log(`User ${outcome} the A2HS prompt`);
            deferredPrompt = null;
          }
        }
      },
      duration: 10000,
    });
  } else if (isIOS()) {
    // For iOS devices that don't support the install prompt
    showIOSInstallInstructions();
  }
}

// Show instructions for installing on iOS
function showIOSInstallInstructions() {
  // Only show if in Safari on iOS and not already installed
  if (isIOS() && !isRunningAsPWA() && navigator.userAgent.includes('Safari')) {
    toast('Instale o Vendah+ no seu iPhone', {
      action: {
        label: 'Como instalar',
        onClick: () => {
          // Show modal with installation instructions
          const modal = document.createElement('div');
          modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
          modal.innerHTML = `
            <div class="bg-surface p-6 rounded-lg max-w-md w-full">
              <h3 class="text-lg font-bold mb-4">Instale o Vendah+ no seu iPhone</h3>
              <ol class="list-decimal pl-5 space-y-2 mb-4">
                <li>Toque no botão de compartilhamento <span class="inline-block w-5 h-5 bg-blue-500 text-white rounded text-xs flex items-center justify-center">↑</span></li>
                <li>Role para baixo e toque em "Adicionar à Tela de Início"</li>
                <li>Confirme tocando em "Adicionar"</li>
              </ol>
              <button class="w-full bg-vendah-purple text-white py-2 rounded-md" id="close-modal">Entendi</button>
            </div>
          `;
          document.body.appendChild(modal);
          
          // Add event listener to close button
          document.getElementById('close-modal')?.addEventListener('click', () => {
            document.body.removeChild(modal);
          });
        }
      },
      duration: 10000,
    });
  }
}

// Setup iOS specific features
function setupIOSSpecificFeatures() {
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
  
  // Use proper CSS property names with TypeScript
  // Use setAttribute to apply non-standard webkit properties
  document.body.setAttribute('style', document.body.getAttribute('style') + '-webkit-touch-callout: none;');
  
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

// Offline detection
function setupOfflineDetection() {
  // Show offline/online status
  window.addEventListener('online', () => {
    toast.success('Você está online novamente');
    document.body.classList.remove('offline-mode');
  });
  
  window.addEventListener('offline', () => {
    toast.error('Você está offline. Alguns recursos podem ficar indisponíveis.');
    document.body.classList.add('offline-mode');
  });
  
  // Check initial status
  if (!navigator.onLine) {
    document.body.classList.add('offline-mode');
  }
}

// Setup app update check
function setupAppUpdateCheck() {
  // Check for app updates periodically
  if ('serviceWorker' in navigator) {
    setInterval(() => {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration) {
          registration.update();
        }
      });
    }, 1000 * 60 * 60); // Check every hour
  }
}

// Request notification permission with a better UX approach
async function tryRequestNotificationPermission() {
  if (isRunningAsPWA() && Notification.permission === 'default') {
    toast('Receba notificações de novos leads e mensagens', {
      action: {
        label: 'Permitir',
        onClick: async () => {
          const granted = await requestNotificationPermission();
          if (granted) {
            toast.success('Notificações ativadas!');
          } else {
            toast.error('Notificações não autorizadas');
          }
        }
      },
      duration: 8000,
    });
  }
}

// Setup pull-to-refresh functionality for iOS-like experience
function setupPullToRefresh() {
  // Only setup on iOS or in PWA mode
  if (isIOS() || isRunningAsPWA()) {
    // Find scrollable containers
    const scrollContainers = document.querySelectorAll('.overflow-y-auto, .overflow-auto');
    
    scrollContainers.forEach(container => {
      let startY = 0;
      let pullDistance = 0;
      let isPulling = false;
      
      // Create pull indicator
      const indicator = document.createElement('div');
      indicator.className = 'fixed top-0 left-0 right-0 flex justify-center items-center h-16 -translate-y-full transition-transform duration-300 z-50 pointer-events-none';
      indicator.innerHTML = '<div class="bg-vendah-purple/80 text-white px-4 py-2 rounded-full flex items-center gap-2"><svg class="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Atualizando...</div>';
      document.body.appendChild(indicator);
      
      // Touch start event
      container.addEventListener('touchstart', (e: Event) => {
        // Cast Event to TouchEvent since we know this is a touch event
        const touchEvent = e as TouchEventWithTouches;
        
        // Only trigger if at the top of the container
        if ((container as HTMLElement).scrollTop === 0) {
          startY = touchEvent.touches[0].clientY;
          isPulling = true;
        }
      }, { passive: true });
      
      // Touch move event
      container.addEventListener('touchmove', (e: Event) => {
        if (!isPulling) return;
        
        // Cast Event to TouchEvent
        const touchEvent = e as TouchEventWithTouches;
        
        pullDistance = Math.max(0, touchEvent.touches[0].clientY - startY);
        
        // Show pull indicator with resistance
        if (pullDistance > 0) {
          const resistance = 0.4;
          const transformY = Math.min(80, pullDistance * resistance);
          indicator.style.transform = `translateY(${transformY}px)`;
        }
      }, { passive: true });
      
      // Touch end event
      container.addEventListener('touchend', () => {
        if (!isPulling) return;
        
        // If pulled enough, trigger refresh
        if (pullDistance > 80) {
          // Show full indicator
          indicator.style.transform = 'translateY(80px)';
          
          // Trigger app refresh
          window.location.reload();
        } else {
          // Hide indicator
          indicator.style.transform = 'translateY(-100%)';
        }
        
        // Reset
        isPulling = false;
        pullDistance = 0;
      }, { passive: true });
    });
  }
}

