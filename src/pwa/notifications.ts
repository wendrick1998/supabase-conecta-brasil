
import { toast } from 'sonner';
import { requestNotificationPermission } from '@/registerServiceWorker';

// Request notification permission with a better UX approach
export async function tryRequestNotificationPermission() {
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

// Check if the app is running as a PWA or in browser
function isRunningAsPWA(): boolean {
  return window.matchMedia('(display-mode: standalone)').matches || 
         (window.navigator as any).standalone === true || 
         document.referrer.includes('android-app://');
}
