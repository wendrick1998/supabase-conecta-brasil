
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import LeadForm from '@/components/leads/LeadForm';

const NewLeadPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Criar Novo Lead</title>
      </Helmet>
      <div className="container py-6">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link to="/leads" className="hover:text-foreground">Leads</Link>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>Novo Lead</span>
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-6">Criar Novo Lead</h1>
        
        <div className="max-w-3xl">
          <LeadForm />
        </div>
      </div>
    </>
  );
};

export default NewLeadPage;
