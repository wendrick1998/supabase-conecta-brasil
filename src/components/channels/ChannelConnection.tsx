
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Facebook, Instagram, Mail, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { getChannelConnectionsByType } from '@/services/channelService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getChannelBgColor } from '@/utils/conversationUtils';
import { supabase } from '@/integrations/supabase/client';

interface ChannelItem {
  id: string;
  type: 'whatsapp' | 'facebook' | 'instagram' | 'email';
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  connections: any[];
  loading: boolean;
}

interface ChannelConnectionProps {
  onConnectChannel: (channelType: string) => void;
}

export const ChannelConnection: React.FC<ChannelConnectionProps> = ({ onConnectChannel }) => {
  const [channels, setChannels] = useState<ChannelItem[]>([
    {
      id: 'whatsapp',
      type: 'whatsapp',
      title: 'WhatsApp',
      description: 'Conecte ao WhatsApp para enviar e receber mensagens dos seus leads',
      icon: <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>,
      color: 'text-[#25D366]',
      bgColor: 'bg-[#25D366]/20',
      connections: [],
      loading: true
    },
    {
      id: 'instagram',
      type: 'instagram',
      title: 'Instagram',
      description: 'Conecte sua conta comercial do Instagram para interagir com seguidores',
      icon: <Instagram className="h-6 w-6" />,
      color: 'text-[#C13584]',
      bgColor: 'bg-[#C13584]/20',
      connections: [],
      loading: true
    },
    {
      id: 'facebook',
      type: 'facebook',
      title: 'Facebook',
      description: 'Conecte suas páginas do Facebook para gerenciar mensagens',
      icon: <Facebook className="h-6 w-6" />,
      color: 'text-[#1877F2]',
      bgColor: 'bg-[#1877F2]/20',
      connections: [],
      loading: true
    },
    {
      id: 'email',
      type: 'email',
      title: 'Email',
      description: 'Conecte sua conta de email para gerenciar comunicações por email',
      icon: <Mail className="h-6 w-6" />,
      color: 'text-[#4285F4]',
      bgColor: 'bg-[#4285F4]/20',
      connections: [],
      loading: true
    },
  ]);
  
  useEffect(() => {
    const fetchChannelConnections = async () => {
      try {
        // Fetch channels in parallel
        const fetchPromises = channels.map(async (channel) => {
          const connections = await getChannelConnectionsByType(channel.type);
          return {
            ...channel,
            connections,
            loading: false
          };
        });
        
        const updatedChannels = await Promise.all(fetchPromises);
        setChannels(updatedChannels);
      } catch (error) {
        console.error('Error fetching channel connections:', error);
        toast.error('Erro ao carregar canais conectados');
        setChannels(channels.map(channel => ({ ...channel, loading: false })));
      }
    };
    
    fetchChannelConnections();
  }, []);
  
  const handleConnect = async (channelType: string) => {
    if (channelType === 'instagram' || channelType === 'facebook') {
      try {
        // Open popup window for OAuth flow
        const width = 600;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        
        const popup = window.open(
          `about:blank`,
          `${channelType}-oauth`,
          `width=${width},height=${height},left=${left},top=${top}`
        );
        
        if (!popup) {
          toast.error('Por favor, habilite popups para continuar com a autenticação');
          return;
        }
        
        // Redirect to OAuth endpoint
        popup.location.href = `${window.location.origin}/api/functions/v1/meta-oauth/authorize?platform=${channelType}`;
        
        // Listen for messages from the popup
        const handleMessage = async (event: MessageEvent) => {
          if (event.data && event.data.type === 'META_AUTH_SUCCESS') {
            window.removeEventListener('message', handleMessage);
            
            toast.success(`Conta ${channelType} conectada com sucesso!`);
            
            // Update channels list
            const updatedChannels = [...channels];
            const channelIndex = updatedChannels.findIndex(c => c.type === channelType);
            
            if (channelIndex !== -1) {
              updatedChannels[channelIndex].connections = [
                ...updatedChannels[channelIndex].connections,
                event.data.connection
              ];
              setChannels(updatedChannels);
            }
          }
        };
        
        window.addEventListener('message', handleMessage);
      } catch (error) {
        console.error(`Error connecting ${channelType}:`, error);
        toast.error(`Erro ao conectar ${channelType}`);
      }
    } else {
      // Default handler for other channel types
      onConnectChannel(channelType);
    }
  };
  
  const handleDisconnect = async (channelId: string, channelType: string) => {
    try {
      const { error } = await supabase
        .from('canais_conectados')
        .update({ status: false })
        .eq('id', channelId);
      
      if (error) throw error;
      
      toast.success('Canal desconectado com sucesso');
      
      // Update channels list
      const updatedChannels = [...channels];
      const channelIndex = updatedChannels.findIndex(c => c.type === channelType);
      
      if (channelIndex !== -1) {
        updatedChannels[channelIndex].connections = updatedChannels[channelIndex].connections.filter(
          conn => conn.id !== channelId
        );
        setChannels(updatedChannels);
      }
    } catch (error) {
      console.error('Error disconnecting channel:', error);
      toast.error('Erro ao desconectar canal');
    }
  };
  
  const setupWebhook = async (channelId: string, channelType: string, pageId?: string, pageToken?: string) => {
    try {
      const response = await fetch(`${window.location.origin}/api/functions/v1/meta-oauth/setup-webhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform: channelType,
          connection_id: channelId,
          page_id: pageId,
          page_token: pageToken
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      toast.success('Webhook configurado com sucesso');
      return data;
    } catch (error) {
      console.error('Error setting up webhook:', error);
      toast.error('Erro ao configurar webhook');
      throw error;
    }
  };
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-6">
      {channels.map((channel) => (
        <Card key={channel.id} className={`border-l-4 ${channel.color} shadow-sm`}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div className="flex gap-3 items-center">
                <div className={`p-2 rounded-lg ${channel.bgColor} ${channel.color}`}>
                  {channel.icon}
                </div>
                <div>
                  <CardTitle className="text-xl">{channel.title}</CardTitle>
                  <CardDescription className="mt-1">{channel.description}</CardDescription>
                </div>
              </div>
              <Badge variant={channel.connections.length > 0 ? "success" : "outline"} className="h-6">
                {channel.connections.length > 0 ? 'Conectado' : 'Não Conectado'}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            {channel.loading ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                <span className="ml-2 text-sm text-muted-foreground">Carregando conexões...</span>
              </div>
            ) : channel.connections.length > 0 ? (
              <div className="space-y-4">
                {channel.connections.map((connection) => (
                  <div key={connection.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={getChannelBgColor(channel.title as any)}>
                            {connection.nome?.substring(0, 2) || 'CN'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-medium">{connection.nome}</h4>
                          <p className="text-sm text-muted-foreground">
                            Conectado em {new Date(connection.criado_em).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge variant={connection.status ? "success" : "destructive"} className="h-6">
                        {connection.status ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </div>
                    
                    {(channel.type === 'facebook' || channel.type === 'instagram') && 
                     connection.configuracao && (
                      <div className="mt-4">
                        {channel.type === 'facebook' && connection.configuracao.pages && (
                          <div className="space-y-3">
                            <h5 className="text-sm font-medium">Páginas conectadas:</h5>
                            {connection.configuracao.pages.map((page: any) => (
                              <div key={page.id} className="flex justify-between items-center p-2 border rounded bg-muted/30">
                                <span>{page.name}</span>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setupWebhook(connection.id, channel.type, page.id, page.access_token)}
                                >
                                  Configurar Webhook
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {channel.type === 'instagram' && connection.configuracao.instagram_accounts && (
                          <div className="space-y-3">
                            <h5 className="text-sm font-medium">Contas do Instagram conectadas:</h5>
                            {connection.configuracao.instagram_accounts.map((account: any) => (
                              <div key={account.id} className="flex justify-between items-center p-2 border rounded bg-muted/30">
                                <div className="flex items-center gap-2">
                                  {account.profile_picture_url && (
                                    <img 
                                      src={account.profile_picture_url} 
                                      alt={account.username} 
                                      className="h-6 w-6 rounded-full"
                                    />
                                  )}
                                  <span>@{account.username}</span>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => setupWebhook(connection.id, channel.type, account.page_id, account.page_token)}
                                >
                                  Configurar Webhook
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDisconnect(connection.id, channel.type)}
                      >
                        Desconectar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-6 text-muted-foreground">
                <AlertTriangle className="h-10 w-10 mb-2" />
                <p>Nenhuma conta {channel.title} conectada</p>
                <p className="text-sm mt-1">Conecte para começar a receber mensagens</p>
              </div>
            )}
          </CardContent>
          
          <CardFooter className="flex justify-end border-t pt-4">
            <Button 
              variant={channel.connections.length > 0 ? "outline" : "default"}
              onClick={() => handleConnect(channel.type)}
            >
              {channel.connections.length > 0 ? 'Conectar outra conta' : `Conectar ${channel.title}`}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ChannelConnection;
