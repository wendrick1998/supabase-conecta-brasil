
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { QRCodeModal } from "@/components/channels/QRCodeModal";
import { useWhatsAppSession } from '@/hooks/useWhatsAppSession';
import { createWhatsAppSession } from '@/services/whatsappSessionService';
import { getChannelConnectionsByType, updateChannelConnection } from '@/services/channelService';
import { toast } from "sonner";
import { MessageSquare, Loader2 } from 'lucide-react';

interface WhatsAppQRCodeConnectProps {
  userId?: string;
  onSessionCreated?: (sessionId: string) => void;
}

export const WhatsAppQRCodeConnect: React.FC<WhatsAppQRCodeConnectProps> = ({ 
  userId,
  onSessionCreated
}) => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const [whatsAppChannel, setWhatsAppChannel] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | undefined>(undefined);
  const { session, qrCode, loading } = useWhatsAppSession(sessionId);

  // Fetch WhatsApp channel
  useEffect(() => {
    const fetchWhatsAppChannel = async () => {
      try {
        const channels = await getChannelConnectionsByType('whatsapp');
        if (channels.length > 0) {
          setWhatsAppChannel(channels[0]);
          if (channels[0].session_id) {
            setSessionId(channels[0].session_id);
          }
        }
      } catch (error) {
        console.error('Error fetching WhatsApp channel:', error);
      }
    };

    fetchWhatsAppChannel();
  }, []);

  // Handle QR code generation
  const handleConnectWhatsApp = async () => {
    // If we don't have a WhatsApp channel yet, we need to create one
    if (!whatsAppChannel) {
      toast.error("Nenhum canal WhatsApp configurado. Crie um canal WhatsApp primeiro.");
      return;
    }

    // If user ID is not provided, we can't create a session
    if (!userId) {
      toast.error("Usuário não autenticado. Faça login para conectar o WhatsApp.");
      return;
    }

    setIsCreatingSession(true);

    try {
      // Create a new WhatsApp session
      const newSession = await createWhatsAppSession(
        userId,
        whatsAppChannel.id,
        `session_${Date.now()}`
      );

      if (newSession) {
        // Update the channel with the session ID
        await updateChannelConnection(whatsAppChannel.id, {
          session_id: newSession.id
        });

        setSessionId(newSession.id);
        
        if (onSessionCreated) {
          onSessionCreated(newSession.id);
        }

        // Open the QR code modal
        setIsQRModalOpen(true);
      }
    } catch (error) {
      console.error('Error creating WhatsApp session:', error);
      toast.error("Erro ao criar sessão do WhatsApp");
    } finally {
      setIsCreatingSession(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 text-[#25D366] mr-2" /> WhatsApp
          </CardTitle>
          <CardDescription>Conecte o WhatsApp via QR code</CardDescription>
        </CardHeader>
        <CardContent>
          {session ? (
            <div className="text-sm">
              <p className="mb-2">
                <span className="font-semibold">Status:</span>{' '}
                <span className={`${
                  session.status === 'conectado' ? 'text-green-500' : 
                  session.status === 'conectando' ? 'text-amber-500' : 
                  session.status === 'erro' ? 'text-red-500' : 'text-gray-500'
                }`}>
                  {session.status === 'conectado' ? 'Conectado' : 
                   session.status === 'conectando' ? 'Conectando...' : 
                   session.status === 'erro' ? 'Erro' : 'Desconectado'}
                </span>
              </p>
              <p className="mb-2">
                <span className="font-semibold">Última atividade:</span>{' '}
                {new Date(session.last_activity).toLocaleString('pt-BR')}
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma sessão ativa. Clique em "Conectar WhatsApp" para começar.
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            onClick={handleConnectWhatsApp}
            className="w-full bg-[#25D366] hover:bg-[#20bd59] text-white"
            aria-label="Conectar WhatsApp"
            disabled={isCreatingSession || loading}
          >
            {isCreatingSession || loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Aguarde...
              </>
            ) : (
              <>Conectar WhatsApp</>
            )}
          </Button>
        </CardFooter>
      </Card>

      {sessionId && (
        <QRCodeModal 
          isOpen={isQRModalOpen} 
          onClose={() => setIsQRModalOpen(false)}
          channelId={whatsAppChannel?.id}
          channelType="whatsapp"
          qrCodeValue={qrCode || undefined}
        />
      )}
    </>
  );
};
