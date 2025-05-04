
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus, AlertTriangle, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Card } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';

// Mock data for automations
interface Automacao {
  id: string;
  nome: string;
  ativa: boolean;
  ultimaExecucao: string | null;
  erros: number;
  gatilho: string;
  acao: string;
}

const automacoesMock: Automacao[] = [
  { 
    id: '1', 
    nome: 'Enviar boas-vindas ao novo lead', 
    ativa: true, 
    ultimaExecucao: '2025-05-03T14:32:00', 
    erros: 0,
    gatilho: 'Novo lead',
    acao: 'Enviar mensagem'
  },
  { 
    id: '2', 
    nome: 'Notificar equipe sobre lead qualificado', 
    ativa: false, 
    ultimaExecucao: '2025-05-01T09:15:00', 
    erros: 2,
    gatilho: 'Lead movido no pipeline',
    acao: 'Notificar equipe'
  },
  { 
    id: '3', 
    nome: 'Criar tarefa para follow-up', 
    ativa: true, 
    ultimaExecucao: '2025-05-02T16:45:00', 
    erros: 0,
    gatilho: 'Lead sem interação',
    acao: 'Criar tarefa'
  },
  { 
    id: '4', 
    nome: 'Atualizar tag após resposta', 
    ativa: true, 
    ultimaExecucao: null, 
    erros: 0,
    gatilho: 'Resposta recebida',
    acao: 'Atualizar tags'
  }
];

const AutomacoesPage = () => {
  const [automacoes, setAutomacoes] = useState<Automacao[]>(automacoesMock);
  const [gatilhoFiltro, setGatilhoFiltro] = useState<string | null>(null);
  const [acaoFiltro, setAcaoFiltro] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleToggleStatus = (id: string) => {
    setAutomacoes(automacoes.map(automacao => {
      if (automacao.id === id) {
        return { ...automacao, ativa: !automacao.ativa };
      }
      return automacao;
    }));
  };

  const gatilhos = [...new Set(automacoes.map(a => a.gatilho))];
  const acoes = [...new Set(automacoes.map(a => a.acao))];

  const automacoesFiltradas = automacoes.filter(automacao => {
    const matchGatilho = !gatilhoFiltro || automacao.gatilho === gatilhoFiltro;
    const matchAcao = !acaoFiltro || automacao.acao === acaoFiltro;
    return matchGatilho && matchAcao;
  });

  const formatarData = (dataString: string | null) => {
    if (!dataString) return 'Nunca executada';
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const limparFiltros = () => {
    setGatilhoFiltro(null);
    setAcaoFiltro(null);
  };

  const handleRowClick = (automacao: Automacao) => {
    navigate(`/automacoes/${automacao.id}/editar`);
  };

  return (
    <>
      <Helmet>
        <title>Automações | ResolveClick</title>
      </Helmet>
      <div className="container py-6">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Automações</h1>
              <p className="text-muted-foreground mt-1">
                Configure regras automáticas para otimizar seus processos
              </p>
            </div>
            <Button 
              className="bg-pink-600 hover:bg-pink-700 text-white"
              onClick={() => navigate('/automacoes/nova')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Nova Automação
            </Button>
          </div>

          <Card className="overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex flex-col md:flex-row gap-4 items-start md:items-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <div className="p-2">
                    <div className="mb-2">
                      <label className="text-sm font-medium mb-1 block">Gatilho</label>
                      <Select value={gatilhoFiltro || ''} onValueChange={(value) => setGatilhoFiltro(value || null)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Todos os gatilhos" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todos os gatilhos</SelectItem>
                          {gatilhos.map(gatilho => (
                            <SelectItem key={gatilho} value={gatilho}>{gatilho}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="mb-2">
                      <label className="text-sm font-medium mb-1 block">Ação</label>
                      <Select value={acaoFiltro || ''} onValueChange={(value) => setAcaoFiltro(value || null)}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Todas as ações" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Todas as ações</SelectItem>
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
                    <Badge variant="outline" className="flex items-center gap-1">
                      Gatilho: {gatilhoFiltro}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => setGatilhoFiltro(null)}
                      >
                        <span className="sr-only">Remover filtro</span>
                        ×
                      </Button>
                    </Badge>
                  )}
                  {acaoFiltro && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      Ação: {acaoFiltro}
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-4 w-4 ml-1 p-0"
                        onClick={() => setAcaoFiltro(null)}
                      >
                        <span className="sr-only">Remover filtro</span>
                        ×
                      </Button>
                    </Badge>
                  )}
                </div>
              )}
            </div>

            <div className="overflow-x-auto">
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
            </div>

            <div className="md:hidden">
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
            </div>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AutomacoesPage;
