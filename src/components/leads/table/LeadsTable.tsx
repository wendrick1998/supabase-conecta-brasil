
import React from 'react';
import {
  Table,
  TableBody,
} from "@/components/ui/table";
import { Lead, Canal, EstagioPipeline } from '@/types/lead';
import { useLeadsTable } from './useLeadsTable';
import LeadsTableHeader from './LeadsTableHeader';
import LeadsTableActions from './LeadsTableActions';
import LeadsTableFilters from './LeadsTableFilters';
import LeadsTableHead from './LeadsTableHead';
import LeadsTableRow from './LeadsTableRow';
import EmptyLeadsState from './EmptyLeadsState';
import DeleteLeadsDialog from './DeleteLeadsDialog';
import MoveLeadsDialog from './MoveLeadsDialog';

interface LeadsTableProps {
  leads: Lead[];
  canais: Canal[];
  estagios: EstagioPipeline[];
  onLeadsChange: () => void;
}

const LeadsTable: React.FC<LeadsTableProps> = ({ leads, canais, estagios, onLeadsChange }) => {
  const {
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
  } = useLeadsTable({ leads, canais, estagios, onLeadsChange });

  return (
    <div className="space-y-4">
      {/* Barra de ferramentas */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <LeadsTableHeader 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
        
        <LeadsTableActions 
          selectedLeads={selectedLeads}
          onMoveClick={() => setIsMovingDialogOpen(true)}
          onDeleteClick={() => setIsDeleteDialogOpen(true)}
        />
      </div>
      
      {/* Filtros */}
      <LeadsTableFilters 
        canais={canais}
        estagios={estagios}
        filtroCanal={filtroCanal}
        filtroEstagio={filtroEstagio}
        onCanalChange={handleCanalFilterChange}
        onEstagioChange={handleEstagioFilterChange}
      />

      {/* Tabela de leads */}
      <div className="border rounded-md">
        <Table>
          <LeadsTableHead 
            sortField={sortField}
            sortDirection={sortDirection}
            onSortChange={toggleSort}
            onSelectAllChange={toggleSelectAll}
            allSelected={selectedLeads.length === filteredLeads.length}
            hasLeads={filteredLeads.length > 0}
          />
          <TableBody>
            {filteredLeads.length === 0 ? (
              <EmptyLeadsState />
            ) : (
              filteredLeads.map((lead) => (
                <LeadsTableRow
                  key={lead.id}
                  lead={lead}
                  isSelected={selectedLeads.includes(lead.id)}
                  onSelectChange={toggleSelectLead}
                  onDeleteClick={handleDeleteSingle}
                />
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogos */}
      <DeleteLeadsDialog 
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteSelected}
        count={selectedLeads.length}
      />

      <MoveLeadsDialog 
        isOpen={isMovingDialogOpen}
        onOpenChange={setIsMovingDialogOpen}
        onConfirm={handleMoveSelected}
        count={selectedLeads.length}
        estagios={estagios}
        targetEstagio={targetEstagio}
        onEstagioChange={setTargetEstagio}
      />
    </div>
  );
};

export default LeadsTable;
