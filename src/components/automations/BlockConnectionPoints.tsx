
import React from 'react';
import { BlockCategory } from '@/types/automation';

interface BlockConnectionPointsProps {
  category: BlockCategory;
  onConnectFrom?: (e: React.MouseEvent) => void;
  onConnectTo?: (e: React.MouseEvent) => void;
  isConnecting?: boolean;
  isConnectionSource?: boolean;
}

export const BlockConnectionPoints: React.FC<BlockConnectionPointsProps> = ({
  category,
  onConnectFrom,
  onConnectTo,
  isConnecting = false,
  isConnectionSource = false
}) => {
  // Generate appropriate classes for connection points based on state
  const getOutputPointClasses = () => {
    const baseClasses = "absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full cursor-pointer transition-all duration-150";
    
    if (isConnecting && isConnectionSource) {
      return `${baseClasses} bg-pink-600 scale-125 shadow-md`;
    }
    
    return `${baseClasses} bg-pink-500 hover:bg-pink-700 hover:scale-110`;
  };
  
  const getInputPointClasses = () => {
    const baseClasses = "absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full cursor-pointer transition-all duration-150";
    
    if (isConnecting && !isConnectionSource) {
      return `${baseClasses} bg-blue-600 scale-125 shadow-md`;
    }
    
    return `${baseClasses} bg-blue-500 hover:bg-blue-700 hover:scale-110`;
  };
  
  return (
    <>
      {/* Output connection point (not for action blocks) */}
      {category !== 'action' && (
        <div 
          className={getOutputPointClasses()}
          aria-label="Ponto de conexão de saída"
          onClick={onConnectFrom}
        />
      )}
      
      {/* Input connection point (not for trigger blocks) */}
      {category !== 'trigger' && (
        <div 
          className={getInputPointClasses()}
          aria-label="Ponto de conexão de entrada"
          onClick={onConnectTo}
        />
      )}
    </>
  );
};
