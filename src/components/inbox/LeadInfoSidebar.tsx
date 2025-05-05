
import React, { useState, useEffect } from 'react';
import { Conversation } from '@/types/conversation';
import { Lead } from '@/types/lead';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Phone, Mail, Building, Tag, Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { getInitials } from '@/utils/conversationUtils';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Link } from 'react-router-dom';

interface LeadInfoSidebarProps {
  conversation: Conversation;
}

const LeadInfoSidebar: React.FC<LeadInfoSidebarProps> = ({ conversation }) => {
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchLeadInfo = async () => {
      if (!conversation.lead_id) return;
      
      setIsLoading(true);
      try {
        // Fetch lead details
        const { data: leadData, error: leadError } = await supabase
          .from('leads')
          .select(`
            *,
            canal:canais(*),
            estagio:estagios_pipeline(*)
          `)
          .eq('id', conversation.lead_id)
          .single();
          
        if (leadError) throw leadError;
        
        // Fetch tags for this lead
        const { data: tagsData } = await supabase
          .from('leads_tags')
          .select(`
            tag_id,
            tags:tags(*)
          `)
          .eq('lead_id', conversation.lead_id);
          
        // Fetch recent activities (e.g., notes, tasks, etc.)
        const { data: recentActivity } = await supabase
          .from('interacoes')
          .select('*')
          .eq('lead_id', conversation.lead_id)
          .order('criado_em', { ascending: false })
          .limit(5);
          
        // Add tags to the lead object
        const tags = tagsData?.map(t => t.tags) || [];
        setLead({ ...leadData, tags });
        setActivities(recentActivity || []);
      } catch (error) {
        console.error('Error fetching lead info:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeadInfo();
  }, [conversation.lead_id]);
  
  if (isLoading) {
    return (
      <div className="w-full h-full p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }
  
  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-4 text-center">
        <p className="text-text-muted mb-4">Informações do lead não disponíveis</p>
        <Button variant="outline" asChild>
          <Link to="/leads/novo">Criar lead</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full overflow-y-auto p-4 space-y-4">
      <Card className="bg-surface/30 border-vendah-purple/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={conversation.avatar} alt={lead.nome} />
              <AvatarFallback>{getInitials(lead.nome)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>{lead.nome}</CardTitle>
              <CardDescription>
                {lead.estagio?.nome && (
                  <Badge style={{ backgroundColor: lead.estagio.cor }}>
                    {lead.estagio.nome}
                  </Badge>
                )}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {lead.telefone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-text-muted" />
              <span>{lead.telefone}</span>
            </div>
          )}
          
          {lead.email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-text-muted" />
              <span>{lead.email}</span>
            </div>
          )}
          
          {lead.empresa && (
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-text-muted" />
              <span>{lead.empresa}</span>
            </div>
          )}
          
          {lead.canal?.nome && (
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-text-muted" />
              <span>Origem: {lead.canal.nome}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-text-muted" />
            <span>Cliente desde {format(new Date(lead.criado_em), 'PP', { locale: ptBR })}</span>
          </div>
          
          {lead.tags && lead.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {lead.tags.map(tag => (
                <Badge key={tag.id} variant="outline" style={{ backgroundColor: tag.cor || '#3b82f6', color: 'white' }}>
                  {tag.nome}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-surface/30 border-vendah-purple/20">
        <CardHeader>
          <CardTitle className="text-sm">Atividade Recente</CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <p className="text-text-muted text-sm">Nenhuma atividade recente</p>
          ) : (
            <div className="space-y-3">
              {activities.map(activity => (
                <div key={activity.id} className="border-l-2 border-vendah-purple/40 pl-3 py-1">
                  <p className="text-sm">{activity.conteudo}</p>
                  <p className="text-xs text-text-muted">
                    {format(new Date(activity.criado_em), 'Pp', { locale: ptBR })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex gap-2">
        <Button size="sm" variant="outline" className="flex-1" asChild>
          <Link to={`/leads/${lead.id}`}>
            Ver Perfil Completo
          </Link>
        </Button>
        <Button size="sm" variant="outline" className="flex-1">
          Criar Tarefa
        </Button>
      </div>
    </div>
  );
};

export default LeadInfoSidebar;
