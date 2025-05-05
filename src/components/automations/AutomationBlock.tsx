
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
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface AutomationBlockProps {
  block: Block;
  onConfigure: () => void;
  onDelete: () => void;
  onStartConnection?: (blockId: string) => void;
  onEndConnection?: (blockId: string) => void;
  isConnecting?: boolean;
  isConnectionSource?: boolean;
  testResult?: {
    status: 'success' | 'error' | 'pending';
    message: string;
  } | null;
}

export const AutomationBlock: React.FC<AutomationBlockProps> = ({
  block,
  onConfigure,
  onDelete,
  onStartConnection,
  onEndConnection,
  isConnecting = false,
  isConnectionSource = false,
  testResult = null
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

  // Customizado para acompanhar o esquema de cores do aplicativo
  const getCategoryColor = () => {
    switch (block.category) {
      case 'trigger':
        return 'bg-gradient-to-r from-blue-500/20 to-blue-600/10 border-blue-500/30';
      case 'condition':
        return 'bg-gradient-to-r from-amber-500/20 to-amber-600/10 border-amber-500/30';
      case 'action':
        return 'bg-gradient-to-r from-green-500/20 to-green-600/10 border-green-500/30';
      default:
        return 'bg-gradient-to-r from-vendah-purple/20 to-vendah-blue/10 border-vendah-purple/30';
    }
  };

  // Aplica cor baseada no resultado do teste
  const getTestResultColor = () => {
    if (!testResult) return '';
    
    switch (testResult.status) {
      case 'success':
        return 'ring-2 ring-green-500/70 shadow-lg shadow-green-900/30';
      case 'error':
        return 'ring-2 ring-red-500/70 shadow-lg shadow-red-900/30';
      case 'pending':
        return 'ring-2 ring-amber-500/70 animate-pulse shadow-lg shadow-amber-900/30';
      default:
        return '';
    }
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
          `automation-block rounded-md shadow-md ${getCategoryColor()} ${blockStatusClass} ${connectionClass} transition-all px-5 py-4`,
          isHovered && !isConnecting ? 'shadow-lg scale-[1.02]' : '',
          isConnectionSource ? 'rotate-1' : '',
          !block.configured ? 'border-dashed' : 'border-solid',
          testResult ? getTestResultColor() : ''
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
              {testResult && (
                <div className="mr-2" title={testResult.message}>
                  {testResult.status === 'success' && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {testResult.status === 'error' && <XCircle className="h-5 w-5 text-red-500" />}
                  {testResult.status === 'pending' && <Clock className="h-5 w-5 text-amber-500 animate-pulse" />}
                </div>
              )}
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
