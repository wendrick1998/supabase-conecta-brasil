
import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Lead } from '@/types/lead';
import {
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import LeadTag from '@/components/LeadTag';

interface LeadsTableRowProps {
  lead: Lead;
  isSelected: boolean;
  onSelectChange: (leadId: string) => void;
  onDeleteClick: (leadId: string) => void;
}

const LeadsTableRow: React.FC<LeadsTableRowProps> = ({
  lead,
  isSelected,
  onSelectChange,
  onDeleteClick
}) => {
  const navigate = useNavigate();

  const handleRowClick = () => {
    navigate(`/leads/${lead.id}`);
  };

  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), "d 'de' MMM 'de' yyyy", { locale: ptBR });
  };

  return (
    <TableRow className="cursor-pointer hover:bg-muted/50">
      <TableCell className="px-4" onClick={(e) => e.stopPropagation()}>
        <Checkbox 
          checked={isSelected}
          onCheckedChange={() => onSelectChange(lead.id)}
          aria-label={`Selecionar ${lead.nome}`}
        />
      </TableCell>
      <TableCell onClick={handleRowClick}>{lead.nome}</TableCell>
      <TableCell onClick={handleRowClick}>
        <div className="flex flex-col">
          {lead.email && <span>{lead.email}</span>}
          {lead.telefone && <span className="text-muted-foreground">{lead.telefone}</span>}
        </div>
      </TableCell>
      <TableCell onClick={handleRowClick}>{lead.canal?.nome || '-'}</TableCell>
      <TableCell onClick={handleRowClick}>{lead.estagio?.nome || '-'}</TableCell>
      <TableCell onClick={handleRowClick}>
        <div className="flex flex-wrap gap-1">
          {lead.tags?.map(tag => (
            <LeadTag key={tag.id} tag={tag} />
          ))}
        </div>
      </TableCell>
      <TableCell onClick={handleRowClick}>{formatDate(lead.criado_em)}</TableCell>
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
              onClick={() => onDeleteClick(lead.id)}
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};

export default LeadsTableRow;
