
import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { cn } from '@/lib/utils';
import { Block } from '@/types/automation';
import { getBlockInfo, getBlockAccessibility } from '@/utils/automationUtils';
import { BlockConnectionPoints } from './BlockConnectionPoints';
import { BlockHeader } from './block/BlockHeader';
import { BlockActions } from './block/BlockActions';
import { BlockSummary } from './block/BlockSummary';
import { BlockConfigDialog } from './block/BlockConfigDialog';
import { useBlockStyles } from './block/useBlockStyles';
import { CheckCircle, XCircle, Clock, AlertCircle, InfoIcon } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

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
  const accessibility = getBlockAccessibility(block.type);
  
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
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setShowConfig(true);
    } else if (e.key === 'Delete' || e.key === 'Backspace') {
      e.preventDefault();
      onDelete();
    } else if (e.key === 'c' && e.altKey) {
      e.preventDefault();
      handleConnectFrom(e as unknown as React.MouseEvent);
    }
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
  
  // Determina ícone com base no tipo de bloco e status do teste
  const getStatusIcon = () => {
    if (!testResult) return null;
    
    switch (testResult.status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500 animate-pulse" />;
      default:
        return null;
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
        aria-label={accessibility.ariaLabel || `Bloco de ${blockInfo.name}`}
        aria-description={accessibility.description || blockInfo.description}
        role="button"
        tabIndex={0}
        data-block-type={block.type}
        data-block-category={block.category}
        data-configured={block.configured ? 'true' : 'false'}
        data-test-status={testResult?.status || 'none'}
        onClick={() => !isConnecting && setShowConfig(true)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onKeyDown={handleKeyPress}
      >
        <div>
          <div className="flex justify-between items-center mb-3">
            <BlockHeader 
              blockType={block.type} 
              blockIcon={blockInfo.icon} 
            />
            
            <div className="flex space-x-1">
              {testResult && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="mr-2 cursor-help">{getStatusIcon()}</div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-gray-900 text-white border-vendah-purple/30">
                    <p>{testResult.message}</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {!block.configured && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="mr-1">
                      <AlertCircle className="h-5 w-5 text-amber-500" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 text-white border-vendah-purple/30">
                    <p>Este bloco precisa ser configurado</p>
                  </TooltipContent>
                </Tooltip>
              )}
              
              {blockInfo.description && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="mr-2 cursor-help">
                      <InfoIcon className="h-4 w-4 text-gray-400" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs bg-gray-900 text-white border-vendah-purple/30">
                    <p>{blockInfo.description}</p>
                  </TooltipContent>
                </Tooltip>
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
