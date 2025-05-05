
import React from 'react';
import { AutomationSidebar } from '@/components/automations/AutomationSidebar';
import { AutomationCanvas } from '@/components/automations/AutomationCanvas';
import { AutomationCanvasControls } from '@/components/automations/AutomationCanvasControls';
import { AutomationDndContext } from '@/components/automations/AutomationDndContext';
import { Block } from '@/types/automation';
import { DragOverEvent } from '@dnd-kit/core';

interface AutomationWorkspaceProps {
  blocks: Block[];
  canvasRef: React.RefObject<HTMLDivElement>;
  isMobile: boolean;
  setShowTemplates: (show: boolean) => void;
  setShowPreview: (show: boolean) => void;
  handleDragStart: any;
  handleDragEnd: any;
  handleDragOver?: (event: DragOverEvent) => void;
  handleConfigureBlock: (blockId: string) => void;
  handleDeleteBlock: (blockId: string) => void;
  handleCreateConnection: (fromBlockId: string, toBlockId: string) => void;
  onAddBlockByClick: (blockType: string) => void;
}

export const AutomationWorkspace: React.FC<AutomationWorkspaceProps> = ({
  blocks,
  canvasRef,
  isMobile,
  setShowTemplates,
  setShowPreview,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleConfigureBlock,
  handleDeleteBlock,
  handleCreateConnection,
  onAddBlockByClick
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
  );
};
