
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Lead } from '@/types/lead';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface LeadInformationProps {
  lead: Lead;
}

const LeadInformation: React.FC<LeadInformationProps> = ({ lead }) => {
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

  return (
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
  );
};

export default LeadInformation;
