
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const LeadNotFound: React.FC = () => {
  return (
    <div className="container py-6">
      <Helmet>
        <title>Lead não encontrado</title>
      </Helmet>
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold tracking-tight mb-4">Lead não encontrado</h1>
        <p className="text-muted-foreground">O lead solicitado não existe ou foi removido.</p>
        <Link to="/leads" className="text-primary hover:underline mt-4 inline-block">
          Voltar para a lista de leads
        </Link>
      </div>
    </div>
  );
};

export default LeadNotFound;
