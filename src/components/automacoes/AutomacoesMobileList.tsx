
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
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
      {automacoesFiltradas.map(automacao => (
        <div 
          key={automacao.id}
          className="p-4 border-t cursor-pointer"
          onClick={() => handleRowClick(automacao)}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">{automacao.nome}</h3>
            <div 
              onClick={(e) => {
                e.stopPropagation();
                handleToggleStatus(automacao.id);
              }}
            >
              <Switch 
                checked={automacao.ativa}
                aria-label={automacao.ativa ? "Automação ativa" : "Automação inativa"}
              />
            </div>
          </div>
          <div className="text-sm text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Gatilho:</span>
              <span>{automacao.gatilho}</span>
            </div>
            <div className="flex justify-between">
              <span>Ação:</span>
              <span>{automacao.acao}</span>
            </div>
            <div className="flex justify-between">
              <span>Última execução:</span>
              <span>{formatarData(automacao.ultimaExecucao)}</span>
            </div>
            <div className="flex justify-between">
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
      ))}
    </>
  );
};

export default AutomacoesMobileList;
