
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import AutomacoesList from '@/components/automacoes/AutomacoesList';
import AutomacoesHeader from '@/components/automacoes/AutomacoesHeader';

const AutomacoesPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Automações | Vendah+</title>
      </Helmet>
      <div className="container py-6">
        <div className="flex flex-col gap-6">
          <AutomacoesHeader onAddNew={() => navigate('/automacoes/nova')} />
          <AutomacoesList onEditAutomation={(id) => navigate(`/automacoes/${id}/editar`)} />
        </div>
      </div>
    </>
  );
};

export default AutomacoesPage;
