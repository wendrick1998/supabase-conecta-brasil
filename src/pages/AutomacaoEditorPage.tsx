
import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { useAutomationEditor } from '@/hooks/useAutomationEditor';
import { AutomationHeader } from '@/components/automations/AutomationHeader';
import { AutomationWorkspace } from '@/components/automations/AutomationWorkspace';
import { AutomationDialogs } from '@/components/automations/AutomationDialogs';
import AutomationGuide from '@/components/automations/AutomationGuide';
import { Loader2 } from 'lucide-react';
import { AutomationWizard } from '@/components/automations/AutomationWizard';
import { useResponsiveAutomationEditor } from '@/hooks/useResponsiveAutomationEditor';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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

  // Version control states
  const [currentVersion, setCurrentVersion] = useState<number>(1);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const { id } = useParams();

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

  // Load current version when editing an existing automation
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      loadCurrentVersion();
    } else {
      setIsEditMode(false);
      setCurrentVersion(1);
    }
  }, [id]);

  const loadCurrentVersion = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('automacoes')
        .select('versao')
        .eq('id', id)
        .single();
        
      if (error) {
        console.error("Error loading automation version:", error);
        return;
      }
      
      if (data && data.versao !== undefined) {
        setCurrentVersion(data.versao);
      } else {
        setCurrentVersion(1);
      }
    } catch (error) {
      console.error("Error loading automation version:", error);
    }
  };

  // Handle save with version description
  const handleSaveWithDescription = async (description: string) => {
    setIsSaving(true);
    try {
      // Save the automation first
      const automationId = await handleSaveAutomation();
      
      if (!automationId) {
        toast.error("Erro ao salvar a automação");
        return;
      }
      
      // Update description for the latest version
      if (description.trim()) {
        // First, get the latest version number
        const { data: versionData, error: versionError } = await supabase
          .from('automacoes')
          .select('versao')
          .eq('id', automationId)
          .single();
          
        if (versionError) throw versionError;
        
        const currentVers = versionData?.versao || 1;
        
        // Then find the version entry with this version number
        const { data: versionEntries, error: entriesError } = await supabase
          .from('automacoes_versoes')
          .select('id')
          .eq('automacao_id', automationId)
          .eq('version', currentVers)
          .single();
          
        if (entriesError && entriesError.code !== 'PGRST116') {
          throw entriesError;
        }
        
        // If version entry exists, update its description
        if (versionEntries?.id) {
          const { error: updateError } = await supabase
            .from('automacoes_versoes')
            .update({ description })
            .eq('id', versionEntries.id);
            
          if (updateError) throw updateError;
        }
      }
      
      setShowSaveDialog(false);
      
      // Refresh the current version
      if (id) {
        loadCurrentVersion();
      }
      
    } catch (error) {
      console.error("Error saving automation version:", error);
      toast.error("Erro ao salvar a versão da automação");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle version restore
  const handleRestoreVersion = async (versionId: string) => {
    try {
      // Get version data
      const { data: versionData, error: versionError } = await supabase
        .from('automacoes_versoes')
        .select('automacao_id, version')
        .eq('id', versionId)
        .single();
        
      if (versionError) throw versionError;
      
      if (!versionData || !versionData.automacao_id) {
        throw new Error("Dados da versão não encontrados");
      }
      
      // Get blocks for this version
      const { data: blocksData, error: blocksError } = await supabase
        .from('automacoes_versoes_blocos')
        .select('*')
        .eq('versao_id', versionId);
        
      if (blocksError) throw blocksError;
      
      if (!blocksData || blocksData.length === 0) {
        throw new Error("Nenhum bloco encontrado para esta versão");
      }
      
      // Update the current version in the automation record
      const { error: updateError } = await supabase
        .from('automacoes')
        .update({ 
          versao: versionData.version,
          atualizado_em: new Date().toISOString()
        })
        .eq('id', versionData.automacao_id);
        
      if (updateError) throw updateError;
      
      // Reload the page to show the restored version
      window.location.reload();
      
    } catch (error) {
      console.error("Error restoring version:", error);
      throw error;
    }
  };

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

  // Modified save handler to show the save dialog
  const handleSaveWithDialog = () => {
    if (isEditMode) {
      setShowSaveDialog(true);
    } else {
      handleSaveAutomation();
    }
  };

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
          onSave={handleSaveWithDialog}
          onTest={handleTestAutomation}
          onCancel={handleCancelAutomation}
          onShowVersionHistory={() => setShowVersionHistory(true)}
          currentVersion={currentVersion}
          hasVersionHistory={isEditMode}
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
              isEditMode={isEditMode}
              setShowTemplates={setShowTemplates}
              setShowPreview={setShowPreview}
              setShowTestResults={setShowTestResults}
              setShowVersionHistory={setShowVersionHistory}
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
        showSaveDialog={showSaveDialog}
        setShowSaveDialog={setShowSaveDialog}
        showVersionHistory={showVersionHistory}
        setShowVersionHistory={setShowVersionHistory}
        blocks={blocks}
        testResults={testResults}
        testSummary={testSummary}
        isTestRunning={isTestRunning}
        automationId={id}
        currentVersion={currentVersion}
        isSaving={isSaving}
        handleApplyTemplate={handleApplyTemplate}
        handleRunTest={handleTestAutomation}
        handleSaveWithDescription={handleSaveWithDescription}
        handleRestoreVersion={handleRestoreVersion}
      />
    </>
  );
};

export default AutomacaoEditorPage;
