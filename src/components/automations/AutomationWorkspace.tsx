
import React from 'react';
import { AutomationSidebar } from '@/components/automations/AutomationSidebar';
import { AutomationCanvas } from '@/components/automations/AutomationCanvas';
import { AutomationCanvasControls } from '@/components/automations/AutomationCanvasControls';
import { AutomationDndContext } from '@/components/automations/AutomationDndContext';
import { Block } from '@/types/automation';
import { DragOverEvent } from '@dnd-kit/core';

interface TestResult {
  blockId: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}

interface AutomationWorkspaceProps {
  blocks: Block[];
  canvasRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
  isEditMode: boolean;
  setShowTemplates: (show: boolean) => void;
  setShowPreview: (show: boolean) => void;
  setShowTestResults: (show: boolean) => void;
  setShowVersionHistory: (show: boolean) => void;
  handleDragStart: any;
  handleDragEnd: any;
  handleDragOver?: (event: DragOverEvent) => void;
  handleConfigureBlock: (blockId: string) => void;
  handleDeleteBlock: (blockId: string) => void;
  handleCreateConnection: (fromBlockId: string, toBlockId: string) => void;
  onAddBlockByClick: (blockType: string) => void;
  testResults: TestResult[];
}

export const AutomationWorkspace: React.FC<AutomationWorkspaceProps> = ({
  blocks,
  canvasRef,
  isMobile,
  isEditMode,
  setShowTemplates,
  setShowPreview,
  setShowTestResults,
  setShowVersionHistory,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleConfigureBlock,
  handleDeleteBlock,
  handleCreateConnection,
  onAddBlockByClick,
  testResults
}) => {
  return (
    <div className="flex flex-col md:flex-row flex-1 h-full">
      {/* Sidebar with block library */}
      <AutomationSidebar 
        onShowTemplates={() => setShowTemplates(true)}
        isMobile={isMobile}
        onBlockClick={onAddBlockByClick}
      />
      
      {/* Main canvas area */}
      <AutomationDndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <main className="flex-1 overflow-hidden bg-[#121212] relative border-l border-vendah-purple/20">
          <AutomationCanvas 
            blocks={blocks}
            canvasRef={canvasRef}
            onConfigureBlock={handleConfigureBlock}
            onDeleteBlock={handleDeleteBlock}
            onCreateConnection={handleCreateConnection}
            testResults={testResults}
          />
          
          {/* Canvas controls */}
          <AutomationCanvasControls
            onShowPreview={() => setShowPreview(true)}
            onShowTestResults={() => setShowTestResults(true)}
            onShowVersionHistory={() => setShowVersionHistory(true)}
            hasVersionHistory={isEditMode}
          />
        </main>
      </AutomationDndContext>
    </div>
  );
};
