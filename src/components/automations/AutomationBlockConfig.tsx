
import React from 'react';
import { BlockType, BlockCategory } from '@/types/automation';
import { BlockConfigManager } from './block-config/BlockConfigManager';

interface AutomationBlockConfigProps {
  blockType: BlockType;
  blockCategory: BlockCategory;
  initialConfig?: Record<string, any>;
  onUpdateConfig?: (config: Record<string, any>) => void;
}

export const AutomationBlockConfig: React.FC<AutomationBlockConfigProps> = (props) => {
  return <BlockConfigManager {...props} />;
};
