
import React, { useState, useEffect } from 'react';
import { InboxLayout } from '@/components/inbox/InboxLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, MessageSquare, Instagram, Mail, Facebook, 
  Filter, RefreshCw
} from 'lucide-react';
import { Checkbox } from "@/components/ui/checkbox";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { getConversations, subscribeToConversations, InboxFilters } from '@/services/inboxService';
import { Conversation } from '@/types/conversation';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';

export const UnifiedInbox: React.FC = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [activeFilters, setActiveFilters] = useState<InboxFilters>({
    canais: [],
    status: ['Aberta']
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');
  
  // Load conversations
  useEffect(() => {
    const loadConversations = async () => {
      setIsLoading(true);
      try {
        const data = await getConversations();
        setConversations(data);
        // Initial filtering
        applyFilters(data, activeFilters, searchTerm);
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast.error('Erro ao carregar conversas');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConversations();
    
    // Subscribe to real-time updates
    const unsubscribe = subscribeToConversations(
      // On Insert
      (newConversation) => {
        setConversations(prev => [newConversation, ...prev]);
        // Re-apply filters to include the new conversation if it matches
        applyFilters([newConversation, ...conversations], activeFilters, searchTerm);
      },
      // On Update
      (updatedConversation) => {
        setConversations(prev => 
          prev.map(conv => conv.id === updatedConversation.id ? updatedConversation : conv)
        );
        // Re-apply filters with the updated conversation
        applyFilters(
          conversations.map(conv => conv.id === updatedConversation.id ? updatedConversation : conv),
          activeFilters,
          searchTerm
        );
      },
      // On Delete
      (deletedId) => {
        setConversations(prev => prev.filter(conv => conv.id !== deletedId));
        // Re-apply filters without the deleted conversation
        applyFilters(
          conversations.filter(conv => conv.id !== deletedId),
          activeFilters,
          searchTerm
        );
      }
    );
    
    return () => {
      unsubscribe();
    };
  }, []);
  
  // Apply filters whenever they change
  useEffect(() => {
    applyFilters(conversations, activeFilters, searchTerm);
  }, [activeFilters, searchTerm, selectedTab]);
  
  // Apply filters to the conversations
  const applyFilters = (
    allConversations: Conversation[],
    filters: InboxFilters,
    search: string
  ) => {
    let filtered = [...allConversations];
    
    // Apply tab filters
    if (selectedTab === 'unread') {
      filtered = filtered.filter(conv => conv.nao_lida);
    } else if (selectedTab !== 'all') {
      filtered = filtered.filter(conv => conv.canal.toLowerCase() === selectedTab);
    }
    
    // Apply channel filters
    if (filters.canais && filters.canais.length > 0) {
      filtered = filtered.filter(conv => 
        filters.canais?.includes(conv.canal as 'WhatsApp' | 'Instagram' | 'Facebook' | 'Email')
      );
    }
    
    // Filter by status
    if (filters.status && filters.status.length > 0) {
      filtered = filtered.filter(conv => 
        filters.status?.includes(conv.status as 'Aberta' | 'Fechada')
      );
    }
    
    // Apply search filter
    if (search.trim()) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(conv => 
        conv.lead_nome.toLowerCase().includes(searchLower) || 
        conv.ultima_mensagem.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredConversations(filtered);
  };
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle channel filter change
  const handleChannelFilterChange = (channel: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Email') => {
    setActiveFilters(prev => {
      const channelFilters = prev.canais || [];
      const newChannelFilters = channelFilters.includes(channel)
        ? channelFilters.filter(c => c !== channel)
        : [...channelFilters, channel];
      
      return {
        ...prev,
        canais: newChannelFilters
      };
    });
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (status: 'Aberta' | 'Fechada') => {
    setActiveFilters(prev => {
      const statusFilters = prev.status || [];
      const newStatusFilters = statusFilters.includes(status)
        ? statusFilters.filter(s => s !== status)
        : [...statusFilters, status];
      
      return {
        ...prev,
        status: newStatusFilters
      };
    });
  };
  
  // Refresh conversations
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const data = await getConversations();
      setConversations(data);
      applyFilters(data, activeFilters, searchTerm);
      toast.success('Conversas atualizadas');
    } catch (error) {
      console.error('Error refreshing conversations:', error);
      toast.error('Erro ao atualizar conversas');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-vendah-purple/20 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">Inbox Unificado</h1>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="p-2">
                  <h4 className="font-medium mb-2">Canais</h4>
                  <div className="space-y-2">
                    <DropdownMenuCheckboxItem
                      checked={activeFilters.canais?.includes('WhatsApp')}
                      onCheckedChange={() => handleChannelFilterChange('WhatsApp')}
                    >
                      WhatsApp
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilters.canais?.includes('Instagram')}
                      onCheckedChange={() => handleChannelFilterChange('Instagram')}
                    >
                      Instagram
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilters.canais?.includes('Facebook')}
                      onCheckedChange={() => handleChannelFilterChange('Facebook')}
                    >
                      Facebook
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilters.canais?.includes('Email')}
                      onCheckedChange={() => handleChannelFilterChange('Email')}
                    >
                      Email
                    </DropdownMenuCheckboxItem>
                  </div>
                  
                  <h4 className="font-medium mt-4 mb-2">Status</h4>
                  <div className="space-y-2">
                    <DropdownMenuCheckboxItem
                      checked={activeFilters.status?.includes('Aberta')}
                      onCheckedChange={() => handleStatusFilterChange('Aberta')}
                    >
                      Aberta
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={activeFilters.status?.includes('Fechada')}
                      onCheckedChange={() => handleStatusFilterChange('Fechada')}
                    >
                      Fechada
                    </DropdownMenuCheckboxItem>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar conversas..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>
        
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="all" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2" />
              Todos
              <Badge variant="outline" className="ml-2">{conversations.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex items-center">
              Não lidas
              <Badge variant="outline" className="ml-2">
                {conversations.filter(c => c.nao_lida).length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="whatsapp" className="flex items-center">
              <MessageSquare className="h-4 w-4 mr-2 text-[#25D366]" />
              WhatsApp
              <Badge variant="outline" className="ml-2">
                {conversations.filter(c => c.canal === 'WhatsApp').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="instagram" className="flex items-center">
              <Instagram className="h-4 w-4 mr-2 text-[#C13584]" />
              Instagram
              <Badge variant="outline" className="ml-2">
                {conversations.filter(c => c.canal === 'Instagram').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="facebook" className="flex items-center">
              <Facebook className="h-4 w-4 mr-2 text-[#1877F2]" />
              Facebook
              <Badge variant="outline" className="ml-2">
                {conversations.filter(c => c.canal === 'Facebook').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center">
              <Mail className="h-4 w-4 mr-2" />
              Email
              <Badge variant="outline" className="ml-2">
                {conversations.filter(c => c.canal === 'Email').length}
              </Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <InboxLayout 
        conversations={filteredConversations}
        isLoading={isLoading}
        emptyMessage={
          searchTerm || 
          (activeFilters.canais && activeFilters.canais.length > 0) || 
          (activeFilters.status && activeFilters.status.length > 0)
            ? 'Nenhuma conversa corresponde aos filtros aplicados'
            : 'Nenhuma conversa disponível'
        }
      />
    </div>
  );
};
