
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface AutomacoesFiltersProps {
  gatilhos: string[];
  acoes: string[];
  gatilhoFiltro: string | null;
  acaoFiltro: string | null;
  setGatilhoFiltro: (value: string | null) => void;
  setAcaoFiltro: (value: string | null) => void;
  limparFiltros: () => void;
}

const AutomacoesFilters: React.FC<AutomacoesFiltersProps> = ({
  gatilhos,
  acoes,
  gatilhoFiltro,
  acaoFiltro,
  setGatilhoFiltro,
  setAcaoFiltro,
  limparFiltros
}) => {
  return (
    <div className="p-4 border-b border-vendah-purple/20 bg-surface/30 flex flex-col md:flex-row gap-4 items-start md:items-center">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2 border-vendah-purple/20">
            <Filter className="h-4 w-4 text-vendah-neon" />
            Filtros
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-surface border border-vendah-purple/20">
          <div className="p-2">
            <div className="mb-2">
              <label className="text-sm font-medium mb-1 block text-white">Gatilho</label>
              <Select value={gatilhoFiltro || "all"} onValueChange={(value) => setGatilhoFiltro(value === "all" ? null : value)}>
                <SelectTrigger className="w-full bg-surface/60 border-vendah-purple/20">
                  <SelectValue placeholder="Todos os gatilhos" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-vendah-purple/20">
                  <SelectItem value="all">Todos os gatilhos</SelectItem>
                  {gatilhos.map(gatilho => (
                    <SelectItem key={gatilho} value={gatilho}>{gatilho}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="mb-2">
              <label className="text-sm font-medium mb-1 block text-white">Ação</label>
              <Select value={acaoFiltro || "all"} onValueChange={(value) => setAcaoFiltro(value === "all" ? null : value)}>
                <SelectTrigger className="w-full bg-surface/60 border-vendah-purple/20">
                  <SelectValue placeholder="Todas as ações" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-vendah-purple/20">
                  <SelectItem value="all">Todas as ações</SelectItem>
                  {acoes.map(acao => (
                    <SelectItem key={acao} value={acao}>{acao}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button 
              variant="ghost" 
              className="w-full mt-2"
              onClick={limparFiltros}
            >
              Limpar filtros
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      {(gatilhoFiltro || acaoFiltro) && (
        <div className="flex flex-wrap gap-2 items-center">
          {gatilhoFiltro && (
            <Badge variant="outline" className="flex items-center gap-1 bg-surface/40 border-vendah-purple/20">
              Gatilho: {gatilhoFiltro}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0 text-text-muted hover:text-white"
                onClick={() => setGatilhoFiltro(null)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remover filtro</span>
              </Button>
            </Badge>
          )}
          {acaoFiltro && (
            <Badge variant="outline" className="flex items-center gap-1 bg-surface/40 border-vendah-purple/20">
              Ação: {acaoFiltro}
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-4 w-4 ml-1 p-0 text-text-muted hover:text-white"
                onClick={() => setAcaoFiltro(null)}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remover filtro</span>
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default AutomacoesFilters;
