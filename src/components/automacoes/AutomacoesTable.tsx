
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
import { Badge } from '@/components/ui/badge';

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
    <div className="rounded-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-surface/40 border-b border-vendah-purple/20">
            <TableHead className="text-vendah-neon font-medium py-3">Nome</TableHead>
            <TableHead className="text-vendah-neon font-medium w-[100px]">Status</TableHead>
            <TableHead className="text-vendah-neon font-medium hidden md:table-cell">Gatilho</TableHead>
            <TableHead className="text-vendah-neon font-medium hidden md:table-cell">Ação</TableHead>
            <TableHead className="text-vendah-neon font-medium hidden md:table-cell">Última execução</TableHead>
            <TableHead className="text-vendah-neon font-medium w-[80px]">Erros</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {automacoesFiltradas.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-text-muted">
                Nenhuma automação encontrada
              </TableCell>
            </TableRow>
          ) : (
            automacoesFiltradas.map((automacao) => (
              <TableRow 
                key={automacao.id} 
                className="cursor-pointer border-b border-vendah-purple/10 hover:bg-vendah-purple/10 transition-colors"
                onClick={() => handleRowClick(automacao)}
              >
                <TableCell className="font-medium text-white py-4">{automacao.nome}</TableCell>
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
                      className="data-[state=checked]:bg-vendah-neon data-[state=checked]:border-vendah-neon"
                    />
                    <span className="sr-only">{automacao.ativa ? "Ativa" : "Inativa"}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell text-text-muted">
                  <Badge variant="outline" className="bg-surface/40 border-vendah-purple/20 text-text-muted">
                    {automacao.gatilho}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-text-muted">
                  <Badge variant="outline" className="bg-surface/40 border-vendah-purple/20 text-text-muted">
                    {automacao.acao}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell text-text-muted">
                  {formatarData(automacao.ultimaExecucao)}
                </TableCell>
                <TableCell>
                  {automacao.erros > 0 ? (
                    <div className="flex items-center gap-1 text-red-500" aria-label={`${automacao.erros} erros na última execução`}>
                      <AlertTriangle className="h-4 w-4" />
                      <span>{automacao.erros}</span>
                    </div>
                  ) : (
                    <span className="text-text-muted" aria-label="Sem erros">-</span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AutomacoesTable;
