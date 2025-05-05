
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Block } from '@/types/automation';
import { getBlockInfo } from '@/utils/automationUtils';
import { BlockConnectionPoints } from './BlockConnectionPoints';
import { BlockHeader } from './block/BlockHeader';
import { BlockActions } from './block/BlockActions';
import { BlockSummary } from './block/BlockSummary';
import { BlockConfigDialog } from './block/BlockConfigDialog';
import { useBlockStyles } from './block/useBlockStyles';

interface AutomationBlockProps {
  block: Block;
  onConfigure: () => void;
  onDelete: () => void;
  onStartConnection?: (blockId: string) => void;
  onEndConnection?: (blockId: string) => void;
  isConnecting?: boolean;
  isConnectionSource?: boolean;
}

export const AutomationBlock: React.FC<AutomationBlockProps> = ({
  block,
  onConfigure,
  onDelete,
  onStartConnection,
  onEndConnection,
  isConnecting = false,
  isConnectionSource = false
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: block.id,
  });
  
  const [showConfig, setShowConfig] = useState(false);
  const [blockConfig, setBlockConfig] = useState<Record<string, any>>(block.config);
  const blockInfo = getBlockInfo(block.type);
  
  const {
    style,
    blockColor,
    blockStatusClass,
    connectionClass,
    isHovered,
    setIsHovered
  } = useBlockStyles(block, transform, isConnecting, isConnectionSource);

  const handleSaveConfig = () => {
    setShowConfig(false);
    onConfigure();
  };
  
  const handleConnectFrom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onStartConnection) {
      onStartConnection(block.id);
    }
  };
  
  const handleConnectTo = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEndConnection) {
      onEndConnection(block.id);
    }
  };

  const handleUpdateBlockConfig = (newConfig: Record<string, any>) => {
    setBlockConfig(newConfig);
  };

  return (
    <>
      <div
        id={block.id}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          `automation-block rounded-md shadow-md ${blockColor} ${blockStatusClass} ${connectionClass} transition-all px-5 py-4`,
          isHovered && !isConnecting ? 'shadow-lg scale-[1.02]' : '',
          isConnectionSource ? 'rotate-1' : ''
        )}
        aria-labelledby={`block-title-${block.id}`}
        onClick={() => !isConnecting && setShowConfig(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div>
          <div className="flex justify-between items-center mb-3">
            <BlockHeader 
              blockType={block.type} 
              blockIcon={blockInfo.icon} 
            />
            
            <div className="flex space-x-1">
              <BlockActions 
                onOpenConfig={() => setShowConfig(true)}
                onDelete={onDelete}
              />
            </div>
          </div>
          
          <BlockSummary block={block} />
          
          {/* Connection points */}
          <BlockConnectionPoints
            category={block.category}
            onConnectFrom={handleConnectFrom}
            onConnectTo={handleConnectTo}
            isConnecting={isConnecting}
            isConnectionSource={isConnectionSource}
          />
        </div>
      </div>
      
      {/* Configuration Dialog */}
      <BlockConfigDialog
        block={block}
        showConfig={showConfig}
        setShowConfig={setShowConfig}
        blockConfig={blockConfig}
        handleUpdateBlockConfig={handleUpdateBlockConfig}
        handleSaveConfig={handleSaveConfig}
      />
    </>
  );
};
