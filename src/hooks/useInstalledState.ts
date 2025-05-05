
import { useState, useEffect } from 'react';
import { isIOS, isRunningAsPWA, showInstallPrompt } from '@/pwa';

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
  
  // We're using the imported functions here
  return {
    isInstalled,
    isStandalone,
    isIOS: isIOS(),
    showInstallPrompt
  };
};

export default useInstalledState;
