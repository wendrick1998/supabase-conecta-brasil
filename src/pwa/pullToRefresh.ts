
import { SafeTouchEvent, getTouchPosition } from '@/types/touchEvents';
import { isIOS } from './deviceDetection';
import { isRunningAsPWA } from './installation';

// Setup pull-to-refresh functionality
export function setupPullToRefresh() {
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
      
      // Touch start event with proper typing
      container.addEventListener('touchstart', (e: Event) => {
        // Only process if it's a touch event 
        if (!('touches' in e)) return;
        
        const touchEvent = e as SafeTouchEvent;
        
        // Only trigger if at the top of the container
        if ((container as HTMLElement).scrollTop === 0) {
          startY = touchEvent.touches[0].clientY;
          isPulling = true;
        }
      }, { passive: true });
      
      // Touch move event with proper typing
      container.addEventListener('touchmove', (e: Event) => {
        if (!isPulling || !('touches' in e)) return;
        
        const touchEvent = e as SafeTouchEvent;
        
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
