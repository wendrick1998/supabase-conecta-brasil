
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import AutomacoesFilters from './AutomacoesFilters';
import AutomacoesTable from './AutomacoesTable';
import AutomacoesMobileList from './AutomacoesMobileList';
import { useAutomacoesMock } from '@/hooks/automacoes/useAutomacoesMock';

interface AutomacoesListProps {
  onEditAutomation: (id: string) => void;
}

const AutomacoesList: React.FC<AutomacoesListProps> = ({ onEditAutomation }) => {
  const { automacoes, handleToggleStatus } = useAutomacoesMock();
  const [gatilhoFiltro, setGatilhoFiltro] = useState<string | null>(null);
  const [acaoFiltro, setAcaoFiltro] = useState<string | null>(null);

  const gatilhos = [...new Set(automacoes.map(a => a.gatilho))];
  const acoes = [...new Set(automacoes.map(a => a.acao))];

  const limparFiltros = () => {
    setGatilhoFiltro(null);
    setAcaoFiltro(null);
  };

  const automacoesFiltradas = automacoes.filter(automacao => {
    const matchGatilho = !gatilhoFiltro || automacao.gatilho === gatilhoFiltro;
    const matchAcao = !acaoFiltro || automacao.acao === acaoFiltro;
    return matchGatilho && matchAcao;
  });

  return (
    <Card className="overflow-hidden">
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
      <div className="overflow-x-auto">
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
