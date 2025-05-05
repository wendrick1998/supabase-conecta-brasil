
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { AlertTriangle } from 'lucide-react';
import { Automacao } from '@/hooks/automacoes/useAutomacoesMock';
import { useAutomacoesMock } from '@/hooks/automacoes/useAutomacoesMock';

interface AutomacoesTableProps {
  automacoesFiltradas: Automacao[];
  handleToggleStatus: (id: string) => void;
  handleRowClick: (automacao: Automacao) => void;
}

const AutomacoesTable: React.FC<AutomacoesTableProps> = ({
  automacoesFiltradas,
  handleToggleStatus,
  handleRowClick
}) => {
  const { formatarData } = useAutomacoesMock();

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-gray-100">
          <TableHead className="text-blue-700 w-[300px]">Nome</TableHead>
          <TableHead className="text-blue-700 w-[100px]">Status</TableHead>
          <TableHead className="text-blue-700 hidden md:table-cell">Gatilho</TableHead>
          <TableHead className="text-blue-700 hidden md:table-cell">Ação</TableHead>
          <TableHead className="text-blue-700 hidden md:table-cell">Última execução</TableHead>
          <TableHead className="text-blue-700 w-[80px]">Erros</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {automacoesFiltradas.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
              Nenhuma automação encontrada
            </TableCell>
          </TableRow>
        ) : (
          automacoesFiltradas.map((automacao) => (
            <TableRow 
              key={automacao.id} 
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => handleRowClick(automacao)}
            >
              <TableCell className="font-medium">{automacao.nome}</TableCell>
              <TableCell>
                <div 
                  className="flex items-center" 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleStatus(automacao.id);
                  }}
                >
                  <Switch 
                    checked={automacao.ativa}
                    aria-label={automacao.ativa ? "Automação ativa" : "Automação inativa"}
                  />
                  <span className="sr-only">{automacao.ativa ? "Ativa" : "Inativa"}</span>
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {automacao.gatilho}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {automacao.acao}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatarData(automacao.ultimaExecucao)}
              </TableCell>
              <TableCell>
                {automacao.erros > 0 ? (
                  <div className="flex items-center gap-1 text-red-500" aria-label={`${automacao.erros} erros na última execução`}>
                    <AlertTriangle className="h-4 w-4" />
                    <span>{automacao.erros}</span>
                  </div>
                ) : (
                  <span aria-label="Sem erros">-</span>
                )}
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default AutomacoesTable;
