
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
  return (
    <div className="flex items-center">
      {blockIcon}
      <h3 className="font-medium ml-2">
        {blockType}
      </h3>
    </div>
  );
};
