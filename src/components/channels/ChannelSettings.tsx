
import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Settings, AtSign, Link, Megaphone } from 'lucide-react';

interface ChannelSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  channelId: string;
  channelName: string;
  channelType: string;
}

const ChannelSettings: React.FC<ChannelSettingsProps> = ({
  isOpen,
  onClose,
  channelId,
  channelName,
  channelType
}) => {
  const [displayName, setDisplayName] = useState(channelName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSave = async () => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('canais_conectados')
        .update({ nome: displayName })
        .eq('id', channelId);
      
      if (error) throw error;
      
      toast.success('Configurações salvas com sucesso');
      onClose();
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast.error('Erro ao salvar configurações');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Configurações da Conta</DialogTitle>
          <DialogDescription>
            Configure as opções para {channelName}
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="general">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="webhook">Webhooks</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <h3 className="text-sm font-medium">Configurações Básicas</h3>
              </div>
              <Separator />
            </div>
            
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="displayName">Nome da Conta</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              
              {(channelType === 'WhatsApp' || channelType === 'Instagram' || channelType === 'Facebook') && (
                <div className="grid gap-2">
                  <Label htmlFor="username">@Username ou Telefone</Label>
                  <div className="flex items-center gap-2">
                    <AtSign className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      placeholder={channelType === 'WhatsApp' ? "+5511999999999" : "@username"}
                      disabled
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Definido automaticamente na conexão com {channelType}
                  </p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="webhook" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Link className="h-4 w-4" />
                <h3 className="text-sm font-medium">Configuração de Webhook</h3>
              </div>
              <Separator />
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Configure URLs de webhook para receber atualizações em tempo real dessa conta.
              </p>
              
              <div className="grid gap-2">
                <Label htmlFor="webhookUrl">URL do Webhook</Label>
                <Input 
                  id="webhookUrl" 
                  placeholder="https://seu-dominio.com/webhook" 
                  disabled
                  value={`${window.location.origin}/api/functions/v1/webhook-${channelType.toLowerCase()}`}
                />
                <p className="text-xs text-muted-foreground">Esta é a URL configurada para receber atualizações</p>
              </div>
              
              <div className="mt-4">
                <Button variant="outline" size="sm" className="h-7">
                  Testar Webhook
                </Button>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications" className="space-y-4 mt-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Megaphone className="h-4 w-4" />
                <h3 className="text-sm font-medium">Configurações de Notificações</h3>
              </div>
              <Separator />
            </div>
            
            <p className="text-sm text-muted-foreground">
              Configure como você deseja receber notificações desta conta.
            </p>
            
            <div className="grid gap-4">
              {/* Implementação futura de notificações */}
              <p className="text-sm italic text-muted-foreground">
                Configurações de notificação serão disponibilizadas em breve.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Configurações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChannelSettings;
