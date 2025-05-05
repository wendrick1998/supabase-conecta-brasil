
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
      {blockIcon}
      <h3 className="font-medium ml-2 text-white">
        {blockInfo ? blockInfo.name : blockType}
      </h3>
    </div>
  );
};
