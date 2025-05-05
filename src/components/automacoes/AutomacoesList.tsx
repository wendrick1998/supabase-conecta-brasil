
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import AutomacoesFilters from './AutomacoesFilters';
import AutomacoesTable from './AutomacoesTable';
import AutomacoesMobileList from './AutomacoesMobileList';
import { supabase } from '@/integrations/supabase/client';
import { Loader2 } from 'lucide-react';

interface Automacao {
  id: string;
  nome: string;
  status: string;
  gatilho?: string;
  acao?: string;
  criado_em: string;
  atualizado_em: string;
}

interface AutomacoesListProps {
  onEditAutomation: (id: string) => void;
}

const AutomacoesList: React.FC<AutomacoesListProps> = ({ onEditAutomation }) => {
  const [automacoes, setAutomacoes] = useState<Automacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [gatilhoFiltro, setGatilhoFiltro] = useState<string | null>(null);
  const [acaoFiltro, setAcaoFiltro] = useState<string | null>(null);

  // Carregar dados do Supabase
  useEffect(() => {
    const fetchAutomacoes = async () => {
      try {
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('automacoes')
          .select('*, blocos_automacao(*)');
          
        if (error) {
          throw error;
        }
        
        // Mapear os dados para o formato esperado pelo componente
        const formattedData = data.map(automacao => {
          const blocos = automacao.blocos_automacao || [];
          
          // Encontrar o bloco de gatilho e o bloco de ação
          const gatilhoBloco = blocos.find(bloco => bloco.tipo === 'gatilho');
          const acaoBloco = blocos.find(bloco => bloco.tipo === 'acao');
          
          let gatilhoNome = 'Sem gatilho';
          let acaoNome = 'Sem ação';
          
          if (gatilhoBloco?.conteudo_config?.nome) {
            gatilhoNome = gatilhoBloco.conteudo_config.nome;
          } else if (gatilhoBloco?.tipo) {
            gatilhoNome = mapearTipoParaNome(gatilhoBloco.tipo);
          }
          
          if (acaoBloco?.conteudo_config?.nome) {
            acaoNome = acaoBloco.conteudo_config.nome;
          } else if (acaoBloco?.tipo) {
            acaoNome = mapearTipoParaNome(acaoBloco.tipo);
          }
          
          return {
            id: automacao.id,
            nome: automacao.nome,
            status: automacao.status,
            gatilho: gatilhoNome,
            acao: acaoNome,
            criado_em: automacao.criado_em,
            atualizado_em: automacao.atualizado_em
          };
        });
        
        setAutomacoes(formattedData);
      } catch (error) {
        console.error('Erro ao carregar automações:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchAutomacoes();
  }, []);

  // Função para mapear tipo interno para nome amigável
  const mapearTipoParaNome = (tipo: string): string => {
    const mapeamento = {
      'gatilho': 'Gatilho',
      'condicao': 'Condição',
      'acao': 'Ação',
      'new_lead': 'Novo Lead',
      'lead_moved': 'Lead Movido',
      'message_received': 'Mensagem Recebida',
      'lead_status': 'Status do Lead',
      'lead_source': 'Canal de Origem',
      'value_greater': 'Valor Maior Que',
      'send_message': 'Enviar Mensagem',
      'create_task': 'Criar Tarefa',
      'move_pipeline': 'Mover no Pipeline'
    };
    
    return mapeamento[tipo as keyof typeof mapeamento] || tipo;
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'ativa' ? 'inativa' : 'ativa';
      
      const { error } = await supabase
        .from('automacoes')
        .update({ status: newStatus })
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      // Atualizar o estado local
      setAutomacoes(current => 
        current.map(automacao => 
          automacao.id === id 
            ? { ...automacao, status: newStatus } 
            : automacao
        )
      );
    } catch (error) {
      console.error('Erro ao alterar status da automação:', error);
    }
  };

  const gatilhos = [...new Set(automacoes.map(a => a.gatilho).filter(Boolean))];
  const acoes = [...new Set(automacoes.map(a => a.acao).filter(Boolean))];

  const limparFiltros = () => {
    setGatilhoFiltro(null);
    setAcaoFiltro(null);
  };

  const automacoesFiltradas = automacoes.filter(automacao => {
    const matchGatilho = !gatilhoFiltro || automacao.gatilho === gatilhoFiltro;
    const matchAcao = !acaoFiltro || automacao.acao === acaoFiltro;
    return matchGatilho && matchAcao;
  });

  if (isLoading) {
    return (
      <Card className="overflow-hidden bg-surface/30 border border-vendah-purple/20 backdrop-blur-md shadow-md p-10 flex justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-vendah-purple" />
          <p>Carregando automações...</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden bg-surface/30 border border-vendah-purple/20 backdrop-blur-md shadow-md">
      <AutomacoesFilters 
        gatilhos={gatilhos}
        acoes={acoes}
        gatilhoFiltro={gatilhoFiltro}
        acaoFiltro={acaoFiltro}
        setGatilhoFiltro={setGatilhoFiltro}
        setAcaoFiltro={setAcaoFiltro}
        limparFiltros={limparFiltros}
      />

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <AutomacoesTable 
          automacoesFiltradas={automacoesFiltradas}
          handleToggleStatus={handleToggleStatus}
          handleRowClick={(automacao) => onEditAutomation(automacao.id)}
        />
      </div>

      {/* Mobile view */}
      <div className="md:hidden">
        <AutomacoesMobileList 
          automacoesFiltradas={automacoesFiltradas}
          handleToggleStatus={handleToggleStatus}
          handleRowClick={(automacao) => onEditAutomation(automacao.id)}
        />
      </div>
    </Card>
  );
};

export default AutomacoesList;
