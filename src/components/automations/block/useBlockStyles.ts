
import React, { useState, CSSProperties } from 'react';
import { Block, BlockCategory } from '@/types/automation';

export const useBlockStyles = (
  block: Block,
  transform: { x: number; y: number } | null,
  isConnecting: boolean,
  isConnectionSource: boolean
) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Style for the block position with correct type annotations
  const style: CSSProperties = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    position: 'absolute' as const,
    left: block.position.x,
    top: block.position.y,
    zIndex: isHovered || isConnectionSource ? 10 : 5,
    width: 'auto',
    minWidth: '260px',
    maxWidth: '300px',
    opacity: isConnecting && !isConnectionSource ? 0.7 : 1,
  } : {
    position: 'absolute' as const,
    left: block.position.x,
    top: block.position.y,
    zIndex: isHovered || isConnectionSource ? 10 : 5,
    width: 'auto',
    minWidth: '260px',
    maxWidth: '300px',
    opacity: isConnecting && !isConnectionSource ? 0.7 : 1,
  };
  
  // Get block color based on its category
  const getBlockColor = (category: BlockCategory) => {
    switch (category) {
      case 'trigger':
        return 'border-blue-500';
      case 'condition':
        return 'border-amber-500';
      case 'action':
        return 'border-green-500';
      default:
        return 'border-gray-500';
    }
  };
  
  // Get block status class
  const getBlockStatusClass = () => {
    if (!block.configured) {
      return 'border-dashed border-2 bg-opacity-50';
    }
    
    return `border ${isHovered ? 'border-2' : 'border'} ${isConnectionSource ? 'border-vendah-purple' : getBlockColor(block.category)}`;
  };
  
  // Get connection class
  const getConnectionClass = () => {
    if (isConnecting) {
      if (isConnectionSource) {
        return 'ring-2 ring-vendah-purple pulse-outline cursor-pointer';
      }
      
      const canConnect = true; // In the future, add logic to determine if connection is valid
      
      if (canConnect) {
        return 'cursor-pointer hover:ring-2 hover:ring-vendah-purple/60 hover:shadow-lg';
      } else {
        return 'opacity-50 cursor-not-allowed';
      }
    }
    
    return '';
  };
  
  const blockColor = getBlockColor(block.category);
  const blockStatusClass = getBlockStatusClass();
  const connectionClass = getConnectionClass();
  
  return {
    style,
    blockColor,
    blockStatusClass,
    connectionClass,
    isHovered,
    setIsHovered
  };
};
