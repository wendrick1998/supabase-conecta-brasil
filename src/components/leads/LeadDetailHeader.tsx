
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ArrowRight, Loader2 } from 'lucide-react';
import { Lead } from '@/types/lead';

interface LeadDetailHeaderProps {
  lead: Lead;
  isDeleting: boolean;
  onDelete: () => void;
}

const LeadDetailHeader: React.FC<LeadDetailHeaderProps> = ({ lead, isDeleting, onDelete }) => {
  const navigate = useNavigate();

  return (
    <div className="md:flex md:items-center md:justify-between mb-4">
      <div>
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Link to="/leads" className="hover:text-foreground">Leads</Link>
          <ArrowRight className="h-4 w-4 mx-1" />
          <span>{lead.nome}</span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight">{lead.nome}</h1>
      </div>
      <div className="mt-4 md:mt-0 flex items-center space-x-2">
        <Button
          variant="outline"
          onClick={() => navigate(`/leads/${lead.id}/editar`)}
        >
          <Pencil className="mr-2 h-4 w-4" />
          Editar
        </Button>
        <Button
          variant="destructive"
          onClick={onDelete}
          disabled={isDeleting}
        >
          {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </Button>
      </div>
    </div>
  );
};

export default LeadDetailHeader;
