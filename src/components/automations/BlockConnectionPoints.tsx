
import React from 'react';
import { BlockCategory } from '@/types/automation';

interface BlockConnectionPointsProps {
  category: BlockCategory;
  onConnectFrom?: (e: React.MouseEvent) => void;
  onConnectTo?: (e: React.MouseEvent) => void;
}

export const BlockConnectionPoints: React.FC<BlockConnectionPointsProps> = ({
  category,
  onConnectFrom,
  onConnectTo
}) => {
  return (
    <>
      {/* Output connection point (not for action blocks) */}
      {category !== 'action' && (
        <div 
          className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-pink-500 rounded-full cursor-pointer hover:bg-pink-700"
          aria-label="Ponto de conexão"
          onClick={onConnectFrom}
        />
      )}
      
      {/* Input connection point (not for trigger blocks) */}
      {category !== 'trigger' && (
        <div 
          className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-700"
          aria-label="Ponto de entrada"
          onClick={onConnectTo}
        />
      )}
    </>
  );
};
