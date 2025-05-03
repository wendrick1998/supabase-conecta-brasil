
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { getLeads, getCanais, getEstagios } from '@/services/leadService';
import { Lead, Canal, EstagioPipeline } from '@/types/lead';
import LeadsTable from '@/components/LeadsTable';
import { Skeleton } from '@/components/ui/skeleton';

const LeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [canais, setCanais] = useState<Canal[]>([]);
  const [estagios, setEstagios] = useState<EstagioPipeline[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const [leadsData, canaisData, estagiosData] = await Promise.all([
      getLeads(),
      getCanais(),
      getEstagios(),
    ]);
    
    setLeads(leadsData);
    setCanais(canaisData);
    setEstagios(estagiosData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Helmet>
        <title>Gerenciamento de Leads</title>
      </Helmet>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
            <p className="text-muted-foreground">Gerencie todos os seus leads em um só lugar.</p>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <Skeleton className="h-10 w-full sm:w-64" />
              <div className="flex space-x-2">
                <Skeleton className="h-10 w-full sm:w-64" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
            <Skeleton className="h-[400px] w-full" />
          </div>
        ) : (
          <LeadsTable 
            leads={leads}
            canais={canais}
            estagios={estagios}
            onLeadsChange={fetchData}
          />
        )}
      </div>
    </>
  );
};

export default LeadsPage;
