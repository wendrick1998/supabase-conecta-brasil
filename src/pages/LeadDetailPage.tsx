
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getLead, deleteLead, advanceLeadStage } from '@/services/leadService';
import { Lead } from '@/types/lead';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/sonner';
import { confirm } from '@/utils/dialog';

// Componentes refatorados
import LeadDetailHeader from '@/components/leads/LeadDetailHeader';
import LeadInformation from '@/components/leads/LeadInformation';
import LeadActions from '@/components/leads/LeadActions';
import LeadDetailSkeleton from '@/components/leads/LeadDetailSkeleton';
import LeadNotFound from '@/components/leads/LeadNotFound';
import LeadTimeline from '@/components/leads/LeadTimeline';

const LeadDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isAdvancing, setIsAdvancing] = useState(false);

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;

      setIsLoading(true);
      const leadData = await getLead(id);
      setLead(leadData);
      setIsLoading(false);
    };

    fetchLead();
  }, [id]);

  // Função para excluir o lead
  const handleDelete = async () => {
    const confirmed = await confirm({
      title: 'Excluir Lead',
      description: 'Tem certeza de que deseja excluir este lead? Esta ação não pode ser desfeita.',
    });

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      if (id) {
        await deleteLead(id);
        toast.success('Lead excluído com sucesso!');
        navigate('/leads');
      }
    } catch (error) {
      toast.error('Erro ao excluir lead.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Função para avançar o estágio do lead
  const handleAdvanceStage = async () => {
    if (lead) {
      setIsAdvancing(true);
      const success = await advanceLeadStage(lead.id);
      if (success) {
        // Recarregar o lead para mostrar o novo estágio
        const updatedLead = await getLead(lead.id);
        setLead(updatedLead);
      }
      setIsAdvancing(false);
    }
  };

  if (isLoading) {
    return <LeadDetailSkeleton />;
  }

  if (!lead) {
    return <LeadNotFound />;
  }

  return (
    <>
      <Helmet>
        <title>{lead.nome} - Detalhes</title>
      </Helmet>
      <div className="container py-6">
        <LeadDetailHeader 
          lead={lead} 
          isDeleting={isDeleting} 
          onDelete={handleDelete} 
        />

        <Separator className="mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações do Lead */}
          <LeadInformation lead={lead} />

          {/* Ações e Próximo Estágio */}
          <LeadActions 
            onAdvanceStage={handleAdvanceStage} 
            isAdvancing={isAdvancing} 
            hasEstagios={!!lead.estagio} 
          />
        </div>
        
        {/* Timeline de notas e interações */}
        <LeadTimeline leadId={lead.id} />
      </div>
    </>
  );
};

export default LeadDetailPage;
