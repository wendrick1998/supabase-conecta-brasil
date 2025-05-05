import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { 
  MessageSquare, 
  Instagram, 
  Facebook, 
  Mail, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Trash2 
} from 'lucide-react';
import { getChannelConnections, disconnectChannel } from '@/services/channelService';

interface ChannelConnectionProps {
  onConnectChannel?: (channelType: string) => void;
  onRefreshToken?: (channelId: string) => void;
  onDisconnectChannel?: (channelId: string) => void;
}

export interface ConnectedChannel {
  id: string;
  nome: string;
  canal: 'whatsapp' | 'instagram' | 'facebook' | 'email';
  status: boolean;
  criado_em: string;
  atualizado_em: string;
}

export const ChannelConnection: React.FC<ChannelConnectionProps> = ({
  onConnectChannel,
  onRefreshToken,
  onDisconnectChannel
}) => {
  const [channels, setChannels] = useState<ConnectedChannel[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchConnectedChannels = async () => {
    setIsLoading(true);
    try {
      const data = await getChannelConnections();
      
      // Transform the data to match ConnectedChannel type
      const typedData: ConnectedChannel[] = data.map(channel => ({
        id: channel.id,
        nome: channel.nome,
        canal: channel.canal,
        status: channel.status,
        criado_em: channel.criado_em,
        atualizado_em: channel.atualizado_em
      }));
      
      setChannels(typedData);
    } catch (error: any) {
      toast.error(`Erro ao buscar canais conectados: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchConnectedChannels();
  }, []);

  const handleConnect = (channelType: string) => {
    if (onConnectChannel) {
      onConnectChannel(channelType);
    } else {
      // Default implementation
      toast.info(`Iniciando conexão com ${channelType}...`);
      
      // In a real implementation, this would trigger the appropriate authentication flow
      // For now, we'll just show a notification
      setTimeout(() => {
        toast.success(`Canal de ${channelType} conectado com sucesso!`);
        fetchConnectedChannels();
      }, 1500);
    }
  };

  const handleRefresh = (channelId: string) => {
    if (onRefreshToken) {
      onRefreshToken(channelId);
    } else {
      toast.info("Atualizando token de acesso...");
      setTimeout(() => {
        toast.success("Token atualizado com sucesso!");
      }, 1000);
    }
  };

  const handleDisconnect = async (channelId: string) => {
    if (onDisconnectChannel) {
      onDisconnectChannel(channelId);
    } else {
      try {
        // Mark the channel as inactive in the database
        const success = await disconnectChannel(channelId);
        
        if (success) {
          fetchConnectedChannels();
        }
      } catch (error: any) {
        toast.error(`Erro ao desconectar canal: ${error.message}`);
      }
    }
  };

  const getChannelIcon = (channelType: string) => {
    switch (channelType) {
      case 'whatsapp':
        return <MessageSquare className="h-5 w-5 text-[#25D366]" />;
      case 'instagram':
        return <Instagram className="h-5 w-5 text-[#C13584]" />;
      case 'facebook':
        return <Facebook className="h-5 w-5 text-[#1877F2]" />;
      case 'email':
        return <Mail className="h-5 w-5 text-black" />;
      default:
        return <MessageSquare className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <MessageSquare className="h-5 w-5 text-[#25D366] mr-2" /> WhatsApp
            </CardTitle>
            <CardDescription>Conecte o WhatsApp via QR code</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => handleConnect('whatsapp')}
              className="w-full bg-[#25D366] hover:bg-[#20bd59] text-white"
              aria-label="Conectar WhatsApp"
            >
              Conectar WhatsApp
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Instagram className="h-5 w-5 text-[#C13584] mr-2" /> Instagram
            </CardTitle>
            <CardDescription>Conecte o Instagram via Meta Business</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => handleConnect('instagram')}
              className="w-full bg-[#C13584] hover:bg-[#a82e71] text-white"
              aria-label="Conectar Instagram"
            >
              Conectar Instagram
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Facebook className="h-5 w-5 text-[#1877F2] mr-2" /> Facebook
            </CardTitle>
            <CardDescription>Conecte o Facebook Messenger</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => handleConnect('facebook')}
              className="w-full bg-[#1877F2] hover:bg-[#1569da] text-white"
              aria-label="Conectar Facebook"
            >
              Conectar Facebook
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center">
              <Mail className="h-5 w-5 text-black mr-2" /> Email
            </CardTitle>
            <CardDescription>Conecte sua conta de email</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button 
              onClick={() => handleConnect('email')}
              className="w-full bg-black hover:bg-gray-800 text-white"
              aria-label="Conectar Email"
            >
              Conectar Email
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-medium mb-4">Canais Conectados</h3>
        
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : channels.length === 0 ? (
          <div className="text-center p-8 border rounded-md bg-muted/30">
            <p className="text-muted-foreground">Nenhum canal conectado ainda.</p>
            <p className="text-sm text-muted-foreground">Conecte um canal para começar a interagir com seus leads.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {channels.map((channel) => (
              <Card key={channel.id} className="overflow-hidden">
                <div className={`h-1 w-full ${
                  channel.canal === 'whatsapp' ? 'bg-[#25D366]' :
                  channel.canal === 'instagram' ? 'bg-[#C13584]' :
                  channel.canal === 'facebook' ? 'bg-[#1877F2]' : 'bg-black'
                }`} />
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getChannelIcon(channel.canal)}
                      <div>
                        <p className="font-medium">{channel.nome}</p>
                        <div className="flex items-center mt-1">
                          <Badge variant={channel.status ? "default" : "outline"} className="text-xs">
                            {channel.status ? (
                              <span className="flex items-center">
                                <Wifi className="h-3 w-3 mr-1" /> Ativo
                              </span>
                            ) : (
                              <span className="flex items-center text-muted-foreground">
                                <WifiOff className="h-3 w-3 mr-1" /> Inativo
                              </span>
                            )}
                          </Badge>
                          <span className="text-xs text-muted-foreground ml-2">
                            Atualizado: {new Date(channel.atualizado_em).toLocaleString('pt-BR')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleRefresh(channel.id)}
                              aria-label="Atualizar token"
                            >
                              <RefreshCw className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Atualizar token</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                      
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="text-destructive"
                              onClick={() => handleDisconnect(channel.id)}
                              aria-label="Desconectar canal"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Desconectar canal</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
