
import { useState, CSSProperties } from 'react';
import { Block } from '@/types/automation';
import { getBlockColor } from '@/utils/automationUtils';

export const useBlockStyles = (
  block: Block, 
  transform: any,
  isConnecting: boolean = false,
  isConnectionSource: boolean = false
) => {
  const [isHovered, setIsHovered] = useState(false);
  const blockColor = getBlockColor(block.category);

  // Fixed TypeScript type issue with position by properly typing it as CSSProperties
  const style: CSSProperties = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    position: 'absolute',
    top: block.position.y,
    left: block.position.x,
    width: '300px',
    zIndex: isConnecting ? (isConnectionSource ? 30 : 20) : 10,
  } : {
    position: 'absolute',
    top: block.position.y,
    left: block.position.x,
    width: '300px',
    zIndex: isConnecting ? (isConnectionSource ? 30 : 20) : 10,
  };

  // Determine status class for visual feedback
  const blockStatusClass = !block.configured 
    ? 'border-2 border-dashed border-red-500' 
    : 'border';

  // Add visual feedback for connecting state and hover
  const connectionClass = isConnecting
    ? (isConnectionSource ? 'ring-2 ring-pink-500 shadow-lg' : 'ring-1 ring-blue-300')
    : '';

  return {
    style,
    blockColor,
    blockStatusClass,
    connectionClass,
    isHovered,
    setIsHovered
  };
};
