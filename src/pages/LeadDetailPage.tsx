import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { getLead, deleteLead, advanceLeadStage } from '@/services/leadService';
import { Lead } from '@/types/lead';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Pencil, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from '@/components/ui/sonner';
import { confirm } from '@/components/ui/alert-dialog';
import { Skeleton } from '@/components/ui/skeleton';

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

  // Formatar a data de criação
  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'Data desconhecida';
    try {
      const date = new Date(dateString);
      return format(date, 'dd \'de\' MMMM \'de\' yyyy, HH:mm', { locale: ptBR });
    } catch (error) {
      console.error('Erro ao formatar a data:', error);
      return 'Data inválida';
    }
  };

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
    return (
      <div className="container py-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-32 ml-auto" />
        </div>
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="container py-6">
        <Helmet>
          <title>Lead não encontrado</title>
        </Helmet>
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold tracking-tight mb-4">Lead não encontrado</h1>
          <p className="text-muted-foreground">O lead solicitado não existe ou foi removido.</p>
          <Link to="/leads" className="text-primary hover:underline mt-4 inline-block">
            Voltar para a lista de leads
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{lead.nome} - Detalhes</title>
      </Helmet>
      <div className="container py-6">
        <div className="md:flex md:items-center md:justify-between mb-4">
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center text-sm text-muted-foreground mb-2">
              <Link to="/leads" className="hover:text-foreground">Leads</Link>
              <ArrowRight className="h-4 w-4 mx-1" />
              <span>{lead.nome}</span>
            </div>

            <h1 className="text-3xl font-bold tracking-tight">{lead.nome}</h1>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => navigate(`/leads/${lead.id}/editar`)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </div>
        </div>

        <Separator className="mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações do Lead */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Informações do Lead</h2>
            <div className="space-y-2">
              <div>
                <span className="font-semibold">Email:</span> {lead.email || 'Não informado'}
              </div>
              <div>
                <span className="font-semibold">Telefone:</span> {lead.telefone || 'Não informado'}
              </div>
              <div>
                <span className="font-semibold">Empresa:</span> {lead.empresa || 'Não informada'}
              </div>
              <div>
                <span className="font-semibold">Canal de Origem:</span> {lead.canal?.nome || 'Não informado'}
              </div>
              <div>
                <span className="font-semibold">Data de Criação:</span> {formatDate(lead.criado_em)}
              </div>
              <div>
                <span className="font-semibold">Estágio:</span> {lead.estagio?.nome || 'Não informado'}
              </div>
              {lead.tags && lead.tags.length > 0 && (
                <div>
                  <span className="font-semibold">Tags:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {lead.tags.map(tag => (
                      <Badge key={tag.id} className="capitalize" style={{ backgroundColor: tag.cor, color: 'white' }}>
                        {tag.nome}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ações e Próximo Estágio */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Ações</h2>
            <div className="space-y-4">
              <Button
                className="w-full"
                onClick={handleAdvanceStage}
                disabled={!lead.estagio || isAdvancing}
              >
                {isAdvancing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Avançar para Próximo Estágio
              </Button>
              {/* Adicionar componentes de notas, interações e tarefas aqui */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeadDetailPage;
