
import React, { useRef, useEffect, useState } from 'react';
import { AutomationBlock } from './AutomationBlock';
import { Block } from '@/types/automation';
import { useDroppable } from '@dnd-kit/core';
import { toast } from 'sonner';

interface AutomationCanvasProps {
  blocks: Block[];
  canvasRef: React.RefObject<HTMLDivElement>;
  onConfigureBlock: (blockId: string) => void;
  onDeleteBlock: (blockId: string) => void;
  onCreateConnection: (fromBlockId: string, toBlockId: string) => void;
}

export const AutomationCanvas: React.FC<AutomationCanvasProps> = ({
  blocks,
  canvasRef,
  onConfigureBlock,
  onDeleteBlock,
  onCreateConnection
}) => {
  const { setNodeRef } = useDroppable({
    id: 'automation-canvas',
  });
  
  const connectionsRef = useRef<SVGSVGElement>(null);
  const [activeConnectionSource, setActiveConnectionSource] = useState<string | null>(null);

  useEffect(() => {
    if (connectionsRef.current) {
      renderConnections();
    }
  }, [blocks]);

  const renderConnections = () => {
    if (!connectionsRef.current) return;
    
    // Clear existing connections
    const svg = connectionsRef.current;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // Draw new connections
    blocks.forEach(block => {
      block.connections.forEach(toId => {
        const toBlock = blocks.find(b => b.id === toId);
        if (toBlock) {
          drawConnection(svg, block, toBlock);
        }
      });
    });
  };

  const drawConnection = (svg: SVGSVGElement, fromBlock: Block, toBlock: Block) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Calculate connection points
    const fromX = fromBlock.position.x + 150; // Assuming block width is 300px
    const fromY = fromBlock.position.y + 50; // Assuming block height is 100px
    const toX = toBlock.position.x;
    const toY = toBlock.position.y + 50;
    
    // Draw a curved line with better bezier curve
    const midX = (fromX + toX) / 2;
    const pathData = `M ${fromX} ${fromY} C ${fromX + 50} ${fromY}, ${toX - 50} ${toY}, ${toX} ${toY}`;
    
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#9b87f5');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('marker-end', 'url(#arrowhead)');
    path.setAttribute('class', 'connection-path');
    
    svg.appendChild(path);
  };

  const handleBlockConnectionStart = (blockId: string) => {
    setActiveConnectionSource(blockId);
  };

  const handleBlockConnectionEnd = (blockId: string) => {
    if (activeConnectionSource && blockId !== activeConnectionSource) {
      // Check if the connection is valid
      const sourceBlock = blocks.find(b => b.id === activeConnectionSource);
      const targetBlock = blocks.find(b => b.id === blockId);

      if (sourceBlock && targetBlock) {
        // Check if connection already exists
        if (sourceBlock.connections.includes(blockId)) {
          toast.info("Esta conexão já existe");
          setActiveConnectionSource(null);
          return;
        }

        // Validate connection based on block categories
        if (isConnectionValid(sourceBlock.category, targetBlock.category)) {
          onCreateConnection(activeConnectionSource, blockId);
        } else {
          toast.error("Conexão inválida entre estes tipos de blocos");
        }
      }
    }
    setActiveConnectionSource(null);
  };

  const isConnectionValid = (sourceCat: string, targetCat: string): boolean => {
    // Trigger -> Condition or Action
    if (sourceCat === 'trigger') {
      return targetCat === 'condition' || targetCat === 'action';
    }
    // Condition -> Condition or Action
    else if (sourceCat === 'condition') {
      return targetCat === 'condition' || targetCat === 'action';
    }
    // Action -> Action
    else if (sourceCat === 'action') {
      return targetCat === 'action';
    }
    return false;
  };

  // Fix for read-only property error by using a callback ref approach
  const setCanvasRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    if (node && canvasRef) {
      // Using a function to update the ref value is safer than direct assignment
      (canvasRef as any).current = node;
    }
  };

  // Calculate grid position - snap to grid of 20px
  const snapToGrid = (x: number, y: number) => {
    const gridSize = 20;
    return {
      x: Math.round(x / gridSize) * gridSize,
      y: Math.round(y / gridSize) * gridSize
    };
  };

  return (
    <div
      ref={setCanvasRef}
      className="w-full h-full relative overflow-auto bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4xKSIvPjwvc3ZnPg==')]"
      tabIndex={0}
      aria-label="Área de construção da automação"
    >
      {/* Connection lines */}
      <svg 
        ref={connectionsRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon
              points="0 0, 10 3.5, 0 7"
              fill="#9b87f5"
            />
          </marker>
        </defs>
      </svg>
      
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
        />
      ))}
    </div>
  );
};
