
import { supabase } from "@/integrations/supabase/client";
import { Conversation } from "@/types/conversation";

// Show notification for new conversation
export const showNewConversationNotification = (conversation: Conversation): void => {
  // Only show notification when app is in background
  if (document.visibilityState === 'hidden' && Notification.permission === 'granted') {
    const notificationTitle = 'Nova conversa';
    const notificationOptions = {
      body: `Nova mensagem de ${conversation.lead_nome}`,
      icon: '/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png',
      badge: '/lovable-uploads/5cd87705-c40b-4d5a-9a43-57cff2564fbf.png',
      vibrate: [100, 50, 100],
      data: {
        url: `/inbox`
      }
    };
    
    try {
      navigator.serviceWorker.ready.then(registration => {
        registration.showNotification(notificationTitle, notificationOptions);
      });
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }
};

// Subscribe to conversation changes
export const subscribeToConversations = (
  onInsert?: (conversation: Conversation) => void,
  onUpdate?: (conversation: Conversation) => void,
  onDelete?: (id: string) => void
) => {
  const channel = supabase
    .channel('conversation-changes')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'conversations' },
      (payload) => {
        if (onInsert) {
          const conversation = payload.new as Conversation;
          onInsert(conversation);
          
          showNewConversationNotification(conversation);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'conversations' },
      (payload) => {
        if (onUpdate) {
          const conversation = payload.new as Conversation;
          onUpdate(conversation);
        }
      }
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'conversations' },
      (payload) => {
        if (onDelete) {
          const id = payload.old.id;
          onDelete(id);
        }
      }
    )
    .subscribe();
  
  return () => {
    supabase.removeChannel(channel);
  };
};
