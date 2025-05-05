
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Automacao } from '@/hooks/automacoes/useAutomacoesMock';
import { useAutomacoesMock } from '@/hooks/automacoes/useAutomacoesMock';

interface AutomacoesMobileListProps {
  automacoesFiltradas: Automacao[];
  handleToggleStatus: (id: string) => void;
  handleRowClick: (automacao: Automacao) => void;
}

const AutomacoesMobileList: React.FC<AutomacoesMobileListProps> = ({
  automacoesFiltradas,
  handleToggleStatus,
  handleRowClick
}) => {
  const { formatarData } = useAutomacoesMock();

  return (
    <>
      {automacoesFiltradas.length === 0 ? (
        <div className="p-6 text-center text-text-muted">
          Nenhuma automação encontrada
        </div>
      ) : (
        automacoesFiltradas.map(automacao => (
          <div 
            key={automacao.id}
            className="p-4 border-b border-vendah-purple/10 cursor-pointer hover:bg-vendah-purple/5"
            onClick={() => handleRowClick(automacao)}
          >
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-medium text-white">{automacao.nome}</h3>
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  handleToggleStatus(automacao.id);
                }}
              >
                <Switch 
                  checked={automacao.ativa}
                  aria-label={automacao.ativa ? "Automação ativa" : "Automação inativa"}
                  className="data-[state=checked]:bg-vendah-neon data-[state=checked]:border-vendah-neon"
                />
              </div>
            </div>
            <div className="text-sm text-text-muted space-y-2">
              <div className="flex justify-between items-center">
                <span>Gatilho:</span>
                <Badge variant="outline" className="bg-surface/40 border-vendah-purple/20 text-text-muted">
                  {automacao.gatilho}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span>Ação:</span>
                <Badge variant="outline" className="bg-surface/40 border-vendah-purple/20 text-text-muted">
                  {automacao.acao}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span>Última execução:</span>
                <span>{formatarData(automacao.ultimaExecucao)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Erros:</span>
                {automacao.erros > 0 ? (
                  <div className="flex items-center gap-1 text-red-500">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{automacao.erros}</span>
                  </div>
                ) : (
                  <span>-</span>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </>
  );
};

export default AutomacoesMobileList;
