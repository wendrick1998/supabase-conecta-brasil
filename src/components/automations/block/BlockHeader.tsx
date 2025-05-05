
import React from 'react';
import { getBlockInfo } from '@/utils/automationUtils';
import { BlockType } from '@/types/automation';

interface BlockHeaderProps {
  blockType: string | BlockType;
  blockIcon: React.ReactNode;
}

export const BlockHeader: React.FC<BlockHeaderProps> = ({
  blockType,
  blockIcon
}) => {
  const blockInfo = getBlockInfo(blockType as BlockType);
  
  return (
    <div className="flex items-center">
      <div className="text-white mr-2">
        {blockIcon}
      </div>
      <h3 className="font-medium text-white">
        {blockInfo ? blockInfo.name : blockType}
      </h3>
    </div>
  );
};
