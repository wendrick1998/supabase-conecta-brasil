
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAutomationEditor } from '@/hooks/useAutomationEditor';
import { AutomationHeader } from '@/components/automations/AutomationHeader';
import { AutomationWorkspace } from '@/components/automations/AutomationWorkspace';
import { AutomationDialogs } from '@/components/automations/AutomationDialogs';
import AutomationGuide from '@/components/automations/AutomationGuide';

const AutomacaoEditorPage = () => {
  const {
    automationName,
    setAutomationName,
    blocks,
    canvasRef,
    showTemplates,
    setShowTemplates,
    showPreview,
    setShowPreview,
    isMobile,
    setIsMobile,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleAddBlockByClick,
    handleSaveAutomation,
    handleTestAutomation,
    handleCancelAutomation,
    handleConfigureBlock,
    handleDeleteBlock,
    handleCreateConnection,
    handleApplyTemplate
  } = useAutomationEditor();

  // State for first visit detection
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  // Check if this is user's first visit to automation editor
  useEffect(() => {
    const hasVisitedAutomations = localStorage.getItem('hasVisitedAutomationEditor');
    
    if (!hasVisitedAutomations) {
      setIsFirstVisit(true);
      localStorage.setItem('hasVisitedAutomationEditor', 'true');
    } else {
      setIsFirstVisit(false);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>{automationName} | Vendah+</title>
      </Helmet>
      
      <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] bg-[#121212]">
        {/* Header */}
        <AutomationHeader
          automationName={automationName}
          setAutomationName={setAutomationName}
          onSave={handleSaveAutomation}
          onTest={handleTestAutomation}
          onCancel={handleCancelAutomation}
        />

        {/* Main workspace with sidebar and canvas */}
        <div className="relative flex-grow">
          <AutomationGuide isFirstVisit={isFirstVisit} />
          
          <AutomationWorkspace 
            blocks={blocks}
            canvasRef={canvasRef}
            isMobile={isMobile}
            setShowTemplates={setShowTemplates}
            setShowPreview={setShowPreview}
            handleDragStart={handleDragStart}
            handleDragEnd={handleDragEnd}
            handleDragOver={handleDragOver}
            handleConfigureBlock={handleConfigureBlock}
            handleDeleteBlock={handleDeleteBlock}
            handleCreateConnection={handleCreateConnection}
            onAddBlockByClick={handleAddBlockByClick}
          />
        </div>
      </div>
      
      {/* Dialogs */}
      <AutomationDialogs 
        showTemplates={showTemplates}
        setShowTemplates={setShowTemplates}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        blocks={blocks}
        handleApplyTemplate={handleApplyTemplate}
      />
    </>
  );
};

export default AutomacaoEditorPage;
