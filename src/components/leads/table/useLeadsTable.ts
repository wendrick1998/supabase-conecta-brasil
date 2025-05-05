
import { useState } from 'react';
import { Lead, Canal, EstagioPipeline } from '@/types/lead';
import { deleteMultipleLeads, moveLeadsToStage } from '@/services/leadService';

type SortField = 'nome' | 'criado_em' | 'canal' | 'estagio';
type SortDirection = 'asc' | 'desc';

interface UseLeadsTableProps {
  leads: Lead[];
  canais: Canal[];
  estagios: EstagioPipeline[];
  onLeadsChange: () => void;
}

export function useLeadsTable({ 
  leads, 
  canais, 
  estagios, 
  onLeadsChange 
}: UseLeadsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('criado_em');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isMovingDialogOpen, setIsMovingDialogOpen] = useState(false);
  const [targetEstagio, setTargetEstagio] = useState<string>('');
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

  const handleDeleteSingle = (leadId: string) => {
    setSelectedLeads([leadId]);
    setIsDeleteDialogOpen(true);
  };

  const handleCanalFilterChange = (value: string) => {
    setFiltroCanal(value === "all-channels" ? null : value);
  };
  
  const handleEstagioFilterChange = (value: string) => {
    setFiltroEstagio(value === "all-stages" ? null : value);
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedLeads,
    sortField,
    sortDirection,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isMovingDialogOpen, 
    setIsMovingDialogOpen,
    targetEstagio,
    setTargetEstagio,
    filtroCanal,
    filtroEstagio,
    filteredLeads,
    toggleSort,
    toggleSelectLead,
    toggleSelectAll,
    handleDeleteSelected,
    handleMoveSelected,
    handleDeleteSingle,
    handleCanalFilterChange,
    handleEstagioFilterChange
  };
}
