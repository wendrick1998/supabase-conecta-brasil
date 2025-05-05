
// Push notification handling

// Handle incoming push notifications
export function handlePushEvent(event) {
  if (!event.data) return;
  
  const data = event.data.json();
  
  const options = {
    body: data.body || 'Nova notificação',
    icon: '/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png',
    badge: '/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/'
    },
    actions: [
      {
        action: 'view',
        title: 'Ver',
        icon: '/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png'
      }
    ],
    silent: false,
    renotify: true,
    tag: data.tag || 'default-tag'
  };
  
  return self.registration.showNotification(data.title || 'Vendah+', options);
}

// Handle notification click events
export function handleNotificationClick(event) {
  event.notification.close();
  
  // Handle notification actions
  if (event.action === 'view') {
    // Handle View action
    const url = event.notification.data.url;
    
    return clients.matchAll({type: 'window'})
      .then(clientList => {
        // Check if there's already a window/tab open with the target URL
        for (const client of clientList) {
          if (client.url === url && 'focus' in client) {
            return client.focus();
          }
        }
        
        // If no window/tab is open, open a new one
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      });
  }
  // If no action or 'close' action, just close the notification
}
