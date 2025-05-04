
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import PipelineSkeleton from '@/components/pipeline/PipelineSkeleton';
import PipelineHeader from '@/components/pipeline/PipelineHeader';
import PipelineContent from '@/components/pipeline/PipelineContent';
import { PipelineDndContext } from '@/components/pipeline/PipelineDndContext';
import { usePipelineData } from '@/hooks/usePipelineData';

const PipelinePage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    estagios, 
    isLoading,
    isMovingLead,
    conversations,
    handleMoveCard,
    getLeadsByStage
  } = usePipelineData();

  const handleConfigurePipeline = () => {
    navigate('/pipeline/configuracao');
  };

  const handleAddNewLead = () => {
    navigate('/leads/novo');
  };

  if (isLoading) {
    return <PipelineSkeleton />;
  }

  return (
    <>
      <Helmet>
        <title>Pipeline de Vendas</title>
      </Helmet>
      
      <div className="container py-6">
        <PipelineHeader 
          onAddNewLead={handleAddNewLead}
          onConfigurePipeline={handleConfigurePipeline}
        />

        <div className="mt-6">
          <PipelineDndContext onMoveCard={handleMoveCard}>
            <PipelineContent
              estagios={estagios}
              getLeadsByStage={getLeadsByStage}
              onMoveCard={handleMoveCard}
              onConfigurePipeline={handleConfigurePipeline}
              isMovingLead={isMovingLead}
              conversations={conversations}
            />
          </PipelineDndContext>
        </div>
      </div>
    </>
  );
};

export default PipelinePage;
