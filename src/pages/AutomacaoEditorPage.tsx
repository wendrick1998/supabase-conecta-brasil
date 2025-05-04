
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAutomationEditor } from '@/hooks/useAutomationEditor';
import { AutomationHeader } from '@/components/automations/AutomationHeader';
import { AutomationWorkspace } from '@/components/automations/AutomationWorkspace';
import { AutomationDialogs } from '@/components/automations/AutomationDialogs';

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
    handleDragEnd,
    handleSaveAutomation,
    handleTestAutomation,
    handleCancelAutomation,
    handleConfigureBlock,
    handleDeleteBlock,
    handleCreateConnection,
    handleApplyTemplate
  } = useAutomationEditor();

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [setIsMobile]);

  return (
    <>
      <Helmet>
        <title>{automationName} | ResolveClick</title>
      </Helmet>
      
      <div className="flex flex-col h-full min-h-[calc(100vh-4rem)]">
        {/* Header */}
        <AutomationHeader
          automationName={automationName}
          setAutomationName={setAutomationName}
          onSave={handleSaveAutomation}
          onTest={handleTestAutomation}
          onCancel={handleCancelAutomation}
        />

        {/* Main workspace with sidebar and canvas */}
        <AutomationWorkspace 
          blocks={blocks}
          canvasRef={canvasRef}
          isMobile={isMobile}
          setShowTemplates={setShowTemplates}
          setShowPreview={setShowPreview}
          handleDragStart={handleDragStart}
          handleDragEnd={handleDragEnd}
          handleConfigureBlock={handleConfigureBlock}
          handleDeleteBlock={handleDeleteBlock}
          handleCreateConnection={handleCreateConnection}
        />
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
