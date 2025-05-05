
import { useState, useEffect } from 'react';

interface InstalledStateResult {
  isInstalled: boolean;
  isStandalone: boolean;
  isIOS: boolean;
  showInstallPrompt: () => void;
}

const useInstalledState = (): InstalledStateResult => {
  const [isInstalled, setIsInstalled] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  
  useEffect(() => {
    // Check if running as standalone PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches || 
                     (window.navigator as any).standalone === true;
    
    setIsStandalone(standalone);
    setIsInstalled(standalone);
    
    // Listen for display mode changes
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
      setIsInstalled(e.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Detect iOS
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  
  const showInstallPrompt = () => {
    if (isIOS) {
      // Show iOS-specific install instructions
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
          <p class="text-sm mb-4">Instale para ter uma experiência completa com acesso offline e notificações!</p>
          <button class="w-full bg-vendah-purple text-white py-2 rounded-md" id="close-install-modal">Entendi</button>
        </div>
      `;
      document.body.appendChild(modal);
      
      // Add event listener to close button
      document.getElementById('close-install-modal')?.addEventListener('click', () => {
        document.body.removeChild(modal);
      });
    } else {
      // For other browsers, we'll use the deferredPrompt from pwaFeatures.ts
      // It's already implemented in pwaFeatures.ts as showInstallPrompt()
      if (typeof window !== 'undefined' && window.showInstallPrompt) {
        window.showInstallPrompt();
      } else {
        console.warn('Install prompt not available');
      }
    }
  };
  
  return {
    isInstalled,
    isStandalone,
    isIOS,
    showInstallPrompt
  };
};

// Add TypeScript declaration for window.showInstallPrompt
declare global {
  interface Window {
    showInstallPrompt?: () => void;
  }
}

export default useInstalledState;
