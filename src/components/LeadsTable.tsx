import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Plus, 
  MoreHorizontal, 
  Trash2, 
  ArrowRight,
  Copy
} from 'lucide-react';
import { Lead, Canal, EstagioPipeline } from '@/types/lead';
import { deleteMultipleLeads, moveLeadsToStage } from '@/services/leadService';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import LeadTag from './LeadTag';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';

interface LeadsTableProps {
  leads: Lead[];
  canais: Canal[];
  estagios: EstagioPipeline[];
  onLeadsChange: () => void;
}

type SortField = 'nome' | 'criado_em' | 'canal' | 'estagio';
type SortDirection = 'asc' | 'desc';

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, canais, estagios, onLeadsChange }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('criado_em');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMovingDialogOpen, setIsMovingDialogOpen] = useState(false);
  const [targetEstagio, setTargetEstagio] = useState<string>('');
  
  // Filtros
  const [filtroCanal, setFiltroCanal] = useState<string | null>(null);
  const [filtroEstagio, setFiltroEstagio] = useState<string | null>(null);

  // Ordenar leads
  const sortedLeads = [...leads].sort((a, b) => {
    if (sortField === 'nome') {
      return sortDirection === 'asc'
        ? a.nome.localeCompare(b.nome)
        : b.nome.localeCompare(a.nome);
    } 
    else if (sortField === 'criado_em') {
      return sortDirection === 'asc'
        ? new Date(a.criado_em).getTime() - new Date(b.criado_em).getTime()
        : new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime();
    }
    else if (sortField === 'canal') {
      const canalA = a.canal?.nome || '';
      const canalB = b.canal?.nome || '';
      return sortDirection === 'asc'
        ? canalA.localeCompare(canalB)
        : canalB.localeCompare(canalA);
    }
    else if (sortField === 'estagio') {
      const estagioA = a.estagio?.ordem || 0;
      const estagioB = b.estagio?.ordem || 0;
      return sortDirection === 'asc'
        ? estagioA - estagioB
        : estagioB - estagioA;
    }
    return 0;
  });

  // Filtrar leads
  const filteredLeads = sortedLeads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      lead.nome.toLowerCase().includes(searchTerm.toLowerCase()) || 
      (lead.email && lead.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (lead.telefone && lead.telefone.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCanal = filtroCanal === null || lead.canal_id === filtroCanal;
    const matchesEstagio = filtroEstagio === null || lead.estagio_id === filtroEstagio;
    
    return matchesSearch && matchesCanal && matchesEstagio;
  });

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleSelectLead = (leadId: string) => {
    setSelectedLeads(prev => 
      prev.includes(leadId)
        ? prev.filter(id => id !== leadId)
        : [...prev, leadId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  const handleDeleteSelected = async () => {
    if (await deleteMultipleLeads(selectedLeads)) {
      setSelectedLeads([]);
      onLeadsChange();
    }
    setIsDeleteDialogOpen(false);
  };

  const handleMoveSelected = async () => {
    if (targetEstagio && await moveLeadsToStage(selectedLeads, targetEstagio)) {
      setSelectedLeads([]);
      onLeadsChange();
    }
    setIsMovingDialogOpen(false);
  };

  const handleRowClick = (leadId: string) => {
    navigate(`/leads/${leadId}`);
  };

  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), "d 'de' MMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <div className="space-y-4">
      {/* Barra de ferramentas */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="w-full sm:w-auto flex items-center space-x-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar leads..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => navigate('/leads/novo')}>
            <Plus className="h-4 w-4 mr-2" />
            Novo Lead
          </Button>
        </div>

        {/* Ações para itens selecionados */}
        {selectedLeads.length > 0 && (
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="mr-2">
              {selectedLeads.length} selecionado(s)
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMovingDialogOpen(true)}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Mover
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setIsDeleteDialogOpen(true)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Excluir
            </Button>
          </div>
        )}
      </div>
      
      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="w-full sm:w-64">
          <Select
            value={filtroCanal || "all-channels"}
            onValueChange={(value) => setFiltroCanal(value === "all-channels" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-channels">Todos os canais</SelectItem>
              {canais.map((canal) => (
                <SelectItem key={canal.id} value={canal.id}>
                  {canal.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-64">
          <Select
            value={filtroEstagio || "all-stages"}
            onValueChange={(value) => setFiltroEstagio(value === "all-stages" ? null : value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estágio" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-stages">Todos os estágios</SelectItem>
              {estagios.map((estagio) => (
                <SelectItem key={estagio.id} value={estagio.id}>
                  {estagio.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Tabela de leads */}
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Selecionar todos"
                />
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('nome')}>
                <div className="flex items-center">
                  Nome
                  {sortField === 'nome' && (
                    sortDirection === 'asc' ? 
                      <ChevronUp className="ml-1 h-4 w-4" /> : 
                      <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Contato</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('canal')}>
                <div className="flex items-center">
                  Canal
                  {sortField === 'canal' && (
                    sortDirection === 'asc' ? 
                      <ChevronUp className="ml-1 h-4 w-4" /> : 
                      <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('estagio')}>
                <div className="flex items-center">
                  Estágio
                  {sortField === 'estagio' && (
                    sortDirection === 'asc' ? 
                      <ChevronUp className="ml-1 h-4 w-4" /> : 
                      <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead>Tags</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort('criado_em')}>
                <div className="flex items-center">
                  Data
                  {sortField === 'criado_em' && (
                    sortDirection === 'asc' ? 
                      <ChevronUp className="ml-1 h-4 w-4" /> : 
                      <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLeads.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Nenhum lead encontrado.
                </TableCell>
              </TableRow>
            ) : (
              filteredLeads.map((lead) => (
                <TableRow key={lead.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedLeads.includes(lead.id)}
                      onCheckedChange={() => toggleSelectLead(lead.id)}
                      aria-label={`Selecionar ${lead.nome}`}
                    />
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(lead.id)}>{lead.nome}</TableCell>
                  <TableCell onClick={() => handleRowClick(lead.id)}>
                    <div className="flex flex-col">
                      {lead.email && <span>{lead.email}</span>}
                      {lead.telefone && <span className="text-muted-foreground">{lead.telefone}</span>}
                    </div>
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(lead.id)}>{lead.canal?.nome || '-'}</TableCell>
                  <TableCell onClick={() => handleRowClick(lead.id)}>{lead.estagio?.nome || '-'}</TableCell>
                  <TableCell onClick={() => handleRowClick(lead.id)}>
                    <div className="flex flex-wrap gap-1">
                      {lead.tags?.map(tag => (
                        <LeadTag key={tag.id} tag={tag} />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(lead.id)}>{formatDate(lead.criado_em)}</TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigate(`/leads/${lead.id}`)}>
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/leads/${lead.id}/editar`)}>
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setSelectedLeads([lead.id]);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo de confirmação para exclusão */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir {selectedLeads.length} 
              {selectedLeads.length === 1 ? ' lead' : ' leads'}?
              Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteSelected}
              className="bg-destructive hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Diálogo para mover leads */}
      <AlertDialog open={isMovingDialogOpen} onOpenChange={setIsMovingDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Mover leads</AlertDialogTitle>
            <AlertDialogDescription>
              Selecione o estágio para onde deseja mover {selectedLeads.length} 
              {selectedLeads.length === 1 ? ' lead' : ' leads'}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <Select
            value={targetEstagio}
            onValueChange={setTargetEstagio}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione um estágio" />
            </SelectTrigger>
            <SelectContent>
              {estagios.map((estagio) => (
                <SelectItem key={estagio.id} value={estagio.id}>
                  {estagio.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleMoveSelected}
              disabled={!targetEstagio}
            >
              Mover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LeadsTable;
