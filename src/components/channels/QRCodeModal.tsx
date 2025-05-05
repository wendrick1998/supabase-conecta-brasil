
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw, Check } from 'lucide-react';
import QRCode from 'qrcode.react';
import { toast } from "sonner";
import { supabase } from '@/integrations/supabase/client';

interface QRCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  channelId?: string;
  channelType: string;
  qrCodeValue?: string;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({
  isOpen,
  onClose,
  channelId,
  channelType,
  qrCodeValue: initialQRValue
}) => {
  const [qrCodeValue, setQRCodeValue] = useState<string | undefined>(initialQRValue);
  const [status, setStatus] = useState<'generating' | 'ready' | 'scanning' | 'connected'>('generating');
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // In a real implementation, we would call our backend to generate a QR code
      // For now, we'll simulate the process
      setStatus('generating');
      
      const timer = setTimeout(() => {
        // Simulate QR code generation
        setQRCodeValue(`https://example.com/whatsapp-auth-${Date.now()}`);
        setStatus('ready');
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    if (qrCodeValue && status === 'ready') {
      // Simulate connection status changes
      const scanningTimer = setTimeout(() => {
        setStatus('scanning');
        
        const connectedTimer = setTimeout(() => {
          setStatus('connected');
          
          // Simulate saving the connection to the database
          if (channelId) {
            handleSuccessfulConnection(channelId);
          } else {
            createNewChannelConnection();
          }
        }, 3000);
        
        return () => clearTimeout(connectedTimer);
      }, 5000);
      
      return () => clearTimeout(scanningTimer);
    }
  }, [qrCodeValue, status, channelId]);

  const refreshQRCode = () => {
    setIsRefreshing(true);
    
    // Simulate refreshing the QR code
    setTimeout(() => {
      setQRCodeValue(`https://example.com/whatsapp-auth-${Date.now()}`);
      setStatus('ready');
      setIsRefreshing(false);
    }, 1500);
  };

  const handleSuccessfulConnection = async (channelId: string) => {
    try {
      // Update the existing channel connection
      const { error } = await supabase
        .from('canais_conectados')
        .update({
          status: true,
          qr_code: qrCodeValue,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', channelId);
      
      if (error) throw error;
      
      toast.success("WhatsApp conectado com sucesso!");
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      toast.error(`Erro ao atualizar conexão: ${error.message}`);
    }
  };

  const createNewChannelConnection = async () => {
    try {
      // Create a new channel connection
      const { error } = await supabase
        .from('canais_conectados')
        .insert({
          canal: channelType,
          nome: `WhatsApp ${new Date().toLocaleString('pt-BR')}`,
          status: true,
          qr_code: qrCodeValue
        });
      
      if (error) throw error;
      
      toast.success("WhatsApp conectado com sucesso!");
      
      // Close the modal after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error: any) {
      toast.error(`Erro ao criar conexão: ${error.message}`);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Conectar WhatsApp</DialogTitle>
          <DialogDescription>
            Escaneie o QR code abaixo usando seu WhatsApp para conectar sua conta.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4 space-y-4">
          {status === 'generating' ? (
            <div className="w-64 h-64 bg-muted flex items-center justify-center rounded-lg">
              <RefreshCw className="h-10 w-10 animate-spin text-muted-foreground" />
            </div>
          ) : status === 'connected' ? (
            <div className="w-64 h-64 bg-green-50 flex items-center justify-center rounded-lg">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-green-700 font-medium">Conectado com sucesso!</p>
              </div>
            </div>
          ) : (
            qrCodeValue && (
              <div className="bg-white p-4 rounded-lg">
                <QRCode value={qrCodeValue} size={256} />
              </div>
            )
          )}
          
          {status === 'ready' && (
            <p className="text-center text-sm text-muted-foreground">
              Escaneie o QR code usando seu WhatsApp. O código expira em 5 minutos.
            </p>
          )}
          
          {status === 'scanning' && (
            <p className="text-center text-sm text-blue-600 animate-pulse">
              Escaneado! Aguardando confirmação...
            </p>
          )}
          
          {(status === 'ready' || status === 'scanning') && (
            <Button
              variant="outline"
              onClick={refreshQRCode}
              disabled={isRefreshing || status === 'scanning'}
              className="mt-4"
              aria-label="Atualizar QR Code"
            >
              {isRefreshing && <RefreshCw className="h-4 w-4 mr-2 animate-spin" />}
              {isRefreshing ? 'Atualizando...' : 'Atualizar QR Code'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
