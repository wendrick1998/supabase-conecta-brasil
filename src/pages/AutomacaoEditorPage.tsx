
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAutomationEditor } from '@/hooks/useAutomationEditor';
import { AutomationHeader } from '@/components/automations/AutomationHeader';
import { AutomationWorkspace } from '@/components/automations/AutomationWorkspace';
import { AutomationDialogs } from '@/components/automations/AutomationDialogs';
import AutomationGuide from '@/components/automations/AutomationGuide';
import { Loader2 } from 'lucide-react';
import { AutomationWizard } from '@/components/automations/AutomationWizard';
import { useResponsiveAutomationEditor } from '@/hooks/useResponsiveAutomationEditor';

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
    showTestResults,
    setShowTestResults,
    isMobile,
    setIsMobile,
    isLoading,
    isTestRunning,
    testResults,
    testSummary,
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

  // Use responsive editor hook for mobile wizard UI
  const {
    wizardStep,
    hasTrigger,
    hasCondition,
    hasAction,
    updateWizardSteps,
    nextStep,
    prevStep
  } = useResponsiveAutomationEditor();

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

  // Update wizard steps when blocks change
  useEffect(() => {
    updateWizardSteps(blocks);
  }, [blocks, updateWizardSteps]);

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

  if (isLoading) {
    return (
      <div className="flex flex-col h-full min-h-[calc(100vh-4rem)] bg-[#121212] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-vendah-purple mb-4" />
        <p className="text-lg">Carregando automação...</p>
      </div>
    );
  }

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
          
          {isMobile ? (
            <div className="p-4">
              <AutomationWizard
                wizardStep={wizardStep}
                blocks={blocks}
                hasTrigger={hasTrigger}
                hasCondition={hasCondition}
                hasAction={hasAction}
                onAddBlock={handleAddBlockByClick}
                onConfigureBlock={handleConfigureBlock}
                onNextStep={nextStep}
                onPrevStep={prevStep}
                onCreateConnection={handleCreateConnection}
              />
            </div>
          ) : (
            <AutomationWorkspace 
              blocks={blocks}
              canvasRef={canvasRef}
              isMobile={isMobile}
              setShowTemplates={setShowTemplates}
              setShowPreview={setShowPreview}
              setShowTestResults={setShowTestResults}
              handleDragStart={handleDragStart}
              handleDragEnd={handleDragEnd}
              handleDragOver={handleDragOver}
              handleConfigureBlock={handleConfigureBlock}
              handleDeleteBlock={handleDeleteBlock}
              handleCreateConnection={handleCreateConnection}
              onAddBlockByClick={handleAddBlockByClick}
              testResults={testResults}
            />
          )}
        </div>
      </div>
      
      {/* Dialogs */}
      <AutomationDialogs 
        showTemplates={showTemplates}
        setShowTemplates={setShowTemplates}
        showPreview={showPreview}
        setShowPreview={setShowPreview}
        showTestResults={showTestResults}
        setShowTestResults={setShowTestResults}
        blocks={blocks}
        testResults={testResults}
        testSummary={testSummary}
        isTestRunning={isTestRunning}
        handleApplyTemplate={handleApplyTemplate}
        handleRunTest={handleTestAutomation}
      />
    </>
  );
};

export default AutomacaoEditorPage;
