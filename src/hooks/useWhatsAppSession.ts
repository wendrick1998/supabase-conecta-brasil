
import { useState, useEffect } from 'react';
import { 
  WhatsAppSession, 
  SessionEvent,
  getWhatsAppSession,
  subscribeToSessionEvents,
  updateWhatsAppSession
} from '@/services/whatsappSessionService';

export const useWhatsAppSession = (sessionId?: string) => {
  const [session, setSession] = useState<WhatsAppSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  // Handle session events
  const handleSessionEvent = (event: SessionEvent) => {
    if (event.event_type === 'qrAtualizado' && event.payload?.qr_code) {
      setQrCode(event.payload.qr_code);
    } else if (event.event_type === 'sessaoConectada') {
      // Update session status
      if (sessionId) {
        updateWhatsAppSession(sessionId, { status: 'conectado' })
          .then((updatedSession) => {
            if (updatedSession) {
              setSession(updatedSession);
              setQrCode(null);
            }
          });
      }
    } else if (event.event_type === 'sessaoDesconectada') {
      // Update session status
      if (sessionId) {
        updateWhatsAppSession(sessionId, { status: 'desconectado' })
          .then((updatedSession) => {
            if (updatedSession) {
              setSession(updatedSession);
            }
          });
      }
    }
  };

  // Load session data and subscribe to events
  useEffect(() => {
    if (!sessionId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    // Get initial session data
    getWhatsAppSession(sessionId)
      .then((sessionData) => {
        setSession(sessionData);
        setQrCode(sessionData?.qr_code || null);
      })
      .catch((err) => {
        console.error('Error loading WhatsApp session:', err);
        setError('Erro ao carregar sessão do WhatsApp');
      })
      .finally(() => {
        setLoading(false);
      });

    // Subscribe to real-time events
    const unsubscribe = subscribeToSessionEvents(sessionId, handleSessionEvent);

    return () => {
      unsubscribe();
    };
  }, [sessionId]);

  return {
    session,
    loading,
    error,
    qrCode
  };
};
