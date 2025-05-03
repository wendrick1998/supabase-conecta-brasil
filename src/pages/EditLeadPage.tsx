
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { getLead } from '@/services/leadService';
import { Lead } from '@/types/lead';
import LeadForm from '@/components/LeadForm';
import { Skeleton } from '@/components/ui/skeleton';

const EditLeadPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLead = async () => {
      if (!id) return;
      
      setIsLoading(true);
      const leadData = await getLead(id);
      setLead(leadData);
      setIsLoading(false);
    };

    fetchLead();
  }, [id]);

  return (
    <>
      <Helmet>
        <title>{lead ? `Editar ${lead.nome}` : 'Editar Lead'}</title>
      </Helmet>
      <div className="container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link to="/leads" className="hover:text-foreground">Leads</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          {lead ? (
            <>
              <Link to={`/leads/${id}`} className="hover:text-foreground">{lead.nome}</Link>
              <ChevronRight className="h-4 w-4 mx-1" />
              <span>Editar</span>
            </>
          ) : (
            <span>Editar Lead</span>
          )}
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-6">
          {isLoading ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            lead ? `Editar ${lead.nome}` : 'Lead não encontrado'
          )}
        </h1>
        
        <div className="max-w-3xl">
          {isLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-2/3" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-32 ml-auto" />
            </div>
          ) : (
            lead ? <LeadForm lead={lead} isEditing /> : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">O lead solicitado não existe ou foi removido.</p>
                <Link to="/leads" className="text-primary hover:underline mt-4 inline-block">
                  Voltar para a lista de leads
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default EditLeadPage;
