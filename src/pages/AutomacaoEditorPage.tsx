
import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useAutomationEditor } from '@/hooks/useAutomationEditor';
import { AutomationHeader } from '@/components/automations/AutomationHeader';
import { AutomationSidebar } from '@/components/automations/AutomationSidebar';
import { AutomationCanvas } from '@/components/automations/AutomationCanvas';
import { AutomationCanvasControls } from '@/components/automations/AutomationCanvasControls';
import { PreviewDialog } from '@/components/automations/PreviewDialog';
import { TemplatesDialog } from '@/components/automations/TemplatesDialog';
import { AutomationDndContext } from '@/components/automations/AutomationDndContext';
import { Block } from '@/types/automation';

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

        <div className="flex flex-col md:flex-row flex-1 h-full">
          {/* Sidebar with block library */}
          <AutomationSidebar 
            onShowTemplates={() => setShowTemplates(true)}
            isMobile={isMobile}
          />
          
          {/* Main canvas area */}
          <AutomationDndContext
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <main className="flex-1 overflow-hidden bg-gray-50 relative">
              <AutomationCanvas 
                blocks={blocks}
                canvasRef={canvasRef}
                onConfigureBlock={handleConfigureBlock}
                onDeleteBlock={handleDeleteBlock}
                onCreateConnection={handleCreateConnection}
              />
              
              {/* Canvas controls */}
              <AutomationCanvasControls
                onShowPreview={() => setShowPreview(true)}
              />
            </main>
          </AutomationDndContext>
        </div>
      </div>
      
      {/* Template dialog */}
      <TemplatesDialog 
        open={showTemplates} 
        onOpenChange={setShowTemplates} 
        onApplyTemplate={handleApplyTemplate}
      />
      
      {/* Preview dialog */}
      <PreviewDialog 
        open={showPreview} 
        onOpenChange={setShowPreview} 
        blocks={blocks} 
      />
    </>
  );
};

export default AutomacaoEditorPage;
