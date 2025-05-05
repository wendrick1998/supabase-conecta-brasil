
import { toast } from 'sonner';
import { isIOS } from './deviceDetection';

// Store the deferred prompt for later use
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

// Setup installation prompt handling
export function setupInstallPrompt() {
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

// Check if the app is running as a PWA or in browser
export function isRunningAsPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true || 
         document.referrer.includes('android-app://');
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
export function showIOSInstallInstructions() {
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

// Check if user is in standalone mode (installed) or browser
export function checkAndShowInstallationTutorial() {
  // Check if not already installed as PWA
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;
                      
  // Only show tutorial if on iOS, not installed, and hasn't seen it before
  if (isIOS() && !isStandalone && !localStorage.getItem('installTutorialShown')) {
    // Set a 50% chance to show tutorial (A/B testing)
    if (Math.random() > 0.5) {
      setTimeout(showIOSInstallInstructions, 5000);
      // Mark as shown
      localStorage.setItem('installTutorialShown', 'true');
    }
  }
}

// Add TypeScript declaration for window.showInstallPrompt
declare global {
  interface Window {
    showInstallPrompt?: () => void;
  }
}

// Expose global installation function
if (typeof window !== 'undefined') {
  window.showInstallPrompt = showInstallPrompt;
}
