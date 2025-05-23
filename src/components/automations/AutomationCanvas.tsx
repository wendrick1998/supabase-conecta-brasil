
import React from 'react';
import { AutomationBlock } from './AutomationBlock';
import { Block } from '@/types/automation';
import { useDroppable } from '@dnd-kit/core';
import { ConnectionRenderer } from './canvas/ConnectionRenderer';
import { ConnectionDrawingIndicator } from './canvas/ConnectionDrawingIndicator';
import { EmptyCanvasMessage } from './canvas/EmptyCanvasMessage';
import { useCanvasConnections } from '@/hooks/automation/useCanvasConnections';

interface TestResult {
  blockId: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}

interface AutomationCanvasProps {
  blocks: Block[];
  canvasRef: React.RefObject<HTMLDivElement>;
  onConfigureBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onCreateConnection: (fromBlockId: string, toBlockId: string) => void;
  testResults?: TestResult[];
}

export const AutomationCanvas: React.FC<AutomationCanvasProps> = ({
  blocks,
  canvasRef,
  onConfigureBlock,
  onDeleteBlock,
  onCreateConnection,
  testResults = []
}) => {
  const { setNodeRef } = useDroppable({
    id: 'automation-canvas',
  });
  
  const {
    activeConnectionSource,
    tempConnectionPoint,
    isDrawingConnection,
    handleBlockConnectionStart,
    handleBlockConnectionEnd,
    handleCanvasClick
  } = useCanvasConnections(blocks, canvasRef, onCreateConnection);

  // Fix for read-only property error by using a callback ref approach
  const setCanvasRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    if (node && canvasRef) {
      // Using a function to update the ref value is safer than direct assignment
      (canvasRef as any).current = node;
    }
  };

  // Find test result for a specific block
  const getTestResultForBlock = (blockId: string) => {
    return testResults.find(result => result.blockId === blockId);
  };

  return (
    <div
      ref={setCanvasRef}
      className="w-full h-full relative overflow-auto bg-[#0c0722] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoOTMsIDQ2LCAxNDAsIDAuMikiLz48L3N2Zz4=')]"
      tabIndex={0}
      aria-label="Área de construção da automação"
      onClick={handleCanvasClick}
    >
      {blocks.length === 0 && <EmptyCanvasMessage />}
      
      {/* Connection lines */}
      <ConnectionRenderer
        blocks={blocks}
        activeConnectionSource={activeConnectionSource}
        tempConnectionPoint={tempConnectionPoint}
      />
      
      {/* Visual indicator when drawing a connection */}
      <ConnectionDrawingIndicator isVisible={isDrawingConnection} />
      
      {/* Blocks */}
      {blocks.map((block) => (
        <AutomationBlock
          key={block.id}
          block={block}
          onConfigure={() => onConfigureBlock(block.id)}
          onDelete={() => onDeleteBlock(block.id)}
          onStartConnection={handleBlockConnectionStart}
          onEndConnection={handleBlockConnectionEnd}
          isConnecting={activeConnectionSource !== null}
          isConnectionSource={activeConnectionSource === block.id}
          testResult={getTestResultForBlock(block.id)}
        />
      ))}
    </div>
  );
};
