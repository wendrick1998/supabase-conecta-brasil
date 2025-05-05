
import React from 'react';
import { getBlockInfo } from '@/utils/automationUtils';

interface BlockHeaderProps {
  blockType: string;
  blockIcon: React.ReactNode;
}

export const BlockHeader: React.FC<BlockHeaderProps> = ({
  blockType,
  blockIcon
}) => {
  const blockInfo = getBlockInfo(blockType);
  
  return (
    <div className="flex items-center">
      {blockIcon}
      <h3 className="font-medium ml-2 text-white">
        {blockInfo ? blockInfo.name : blockType}
      </h3>
    </div>
  );
};
