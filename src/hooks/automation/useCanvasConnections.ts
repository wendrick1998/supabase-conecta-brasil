
import { useState, useRef, useEffect } from 'react';
import { Block } from '@/types/automation';
import { toast } from 'sonner';

export const useCanvasConnections = (
  blocks: Block[],
  canvasRef: React.RefObject<HTMLDivElement>,
  onCreateConnection: (fromBlockId: string, toBlockId: string) => void
) => {
  const [activeConnectionSource, setActiveConnectionSource] = useState<string | null>(null);
  const [tempConnectionPoint, setTempConnectionPoint] = useState<{ x: number, y: number } | null>(null);
  const [isDrawingConnection, setIsDrawingConnection] = useState(false);

  // Add mouse move event for live connection drawing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (activeConnectionSource && canvasRef.current) {
        const canvasRect = canvasRef.current.getBoundingClientRect();
        setTempConnectionPoint({
          x: e.clientX - canvasRect.left + canvasRef.current.scrollLeft,
          y: e.clientY - canvasRect.top + canvasRef.current.scrollTop
        });
        setIsDrawingConnection(true);
      }
    };

    if (activeConnectionSource) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [activeConnectionSource, canvasRef]);

  const handleBlockConnectionStart = (blockId: string) => {
    setActiveConnectionSource(blockId);
    setIsDrawingConnection(true);
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
          setTempConnectionPoint(null);
          setIsDrawingConnection(false);
          return;
        }

        // Validate connection based on block categories
        if (isConnectionValid(sourceBlock.category, targetBlock.category)) {
          onCreateConnection(activeConnectionSource, blockId);
          toast.success("Blocos conectados com sucesso!");
        } else {
          toast.error("Conexão inválida entre estes tipos de blocos");
        }
      }
    }
    
    setActiveConnectionSource(null);
    setTempConnectionPoint(null);
    setIsDrawingConnection(false);
  };

  const handleCanvasClick = () => {
    if (activeConnectionSource) {
      // Cancel connection if clicking on canvas
      setActiveConnectionSource(null);
      setTempConnectionPoint(null);
      setIsDrawingConnection(false);
    }
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

  return {
    activeConnectionSource,
    tempConnectionPoint,
    isDrawingConnection,
    handleBlockConnectionStart,
    handleBlockConnectionEnd,
    handleCanvasClick
  };
};
