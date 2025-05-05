
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { ChannelConnection } from '@/components/channels/ChannelConnection';
import { QRCodeModal } from '@/components/channels/QRCodeModal';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getChannelConnections } from '@/services/channelService';

const ChannelManagementPage: React.FC = () => {
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string>('');
  const [connections, setConnections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConnections = async () => {
      setIsLoading(true);
      const data = await getChannelConnections();
      setConnections(data);
      setIsLoading(false);
    };

    fetchConnections();
  }, []);

  const handleConnectChannel = (channelType: string) => {
    setSelectedChannel(channelType);
    
    if (channelType === 'whatsapp') {
      setIsQRModalOpen(true);
    } else {
      // For other channels, we would redirect to OAuth or other authentication methods
      window.open(`/auth/${channelType}`, '_blank');
    }
  };

  return (
    <>
      <Helmet>
        <title>Gerenciamento de Canais | Vendah+ CRM</title>
      </Helmet>
      
      <div className="container py-8">
        <div className="flex items-center mb-8">
          <Link to="/dashboard">
            <Button variant="outline" size="icon" className="mr-4">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">Gerenciamento de Canais</h1>
            <p className="text-muted-foreground">
              Conecte e gerencie seus canais de comunicação para interagir com leads
            </p>
          </div>
        </div>
        
        <ChannelConnection 
          onConnectChannel={handleConnectChannel}
        />
        
        <QRCodeModal 
          isOpen={isQRModalOpen && selectedChannel === 'whatsapp'} 
          onClose={() => setIsQRModalOpen(false)}
          channelType="whatsapp"
        />
      </div>
    </>
  );
};

export default ChannelManagementPage;
