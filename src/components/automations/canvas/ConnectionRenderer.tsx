
import React, { useRef, useEffect } from 'react';
import { Block } from '@/types/automation';

interface ConnectionRendererProps {
  blocks: Block[];
  activeConnectionSource: string | null;
  tempConnectionPoint: { x: number, y: number } | null;
}

export const ConnectionRenderer: React.FC<ConnectionRendererProps> = ({
  blocks,
  activeConnectionSource,
  tempConnectionPoint
}) => {
  const connectionsRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (connectionsRef.current) {
      renderConnections();
    }
  }, [blocks, activeConnectionSource, tempConnectionPoint]);

  const renderConnections = () => {
    if (!connectionsRef.current) return;
    
    // Clear existing connections
    const svg = connectionsRef.current;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }
    
    // Draw existing connections
    blocks.forEach(block => {
      block.connections.forEach(toId => {
        const toBlock = blocks.find(b => b.id === toId);
        if (toBlock) {
          drawConnection(svg, block, toBlock);
        }
      });
    });
    
    // Draw temporary connection if we're in the process of creating one
    if (activeConnectionSource && tempConnectionPoint) {
      const sourceBlock = blocks.find(b => b.id === activeConnectionSource);
      if (sourceBlock) {
        drawTempConnection(svg, sourceBlock, tempConnectionPoint);
      }
    }
  };

  const drawConnection = (svg: SVGSVGElement, fromBlock: Block, toBlock: Block) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Calculate connection points
    const fromX = fromBlock.position.x + 150; // Assuming block width is 300px
    const fromY = fromBlock.position.y + 50; // Assuming block height is 100px
    const toX = toBlock.position.x;
    const toY = toBlock.position.y + 50;
    
    // Draw a curved line with better bezier curve
    const midX = (fromX + toX) / 2;
    const pathData = `M ${fromX} ${fromY} C ${fromX + 50} ${fromY}, ${toX - 50} ${toY}, ${toX} ${toY}`;
    
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#9b87f5');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('marker-end', 'url(#arrowhead)');
    path.setAttribute('class', 'connection-path');
    
    svg.appendChild(path);
  };
  
  const drawTempConnection = (svg: SVGSVGElement, fromBlock: Block, toPoint: {x: number, y: number}) => {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // Calculate connection points
    const fromX = fromBlock.position.x + 150; // Assuming block width is 300px
    const fromY = fromBlock.position.y + 50; // Assuming block height is 100px
    const toX = toPoint.x;
    const toY = toPoint.y;
    
    // Draw a curved line
    const controlX = fromX + (toX - fromX) / 2;
    const pathData = `M ${fromX} ${fromY} C ${controlX} ${fromY}, ${controlX} ${toY}, ${toX} ${toY}`;
    
    path.setAttribute('d', pathData);
    path.setAttribute('fill', 'none');
    path.setAttribute('stroke', '#9b87f5');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-dasharray', '5,5');
    path.setAttribute('marker-end', 'url(#arrowhead)');
    path.setAttribute('class', 'temp-connection-path');
    
    svg.appendChild(path);
  };

  return (
    <svg 
      ref={connectionsRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-none"
    >
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon
            points="0 0, 10 3.5, 0 7"
            fill="#9b87f5"
          />
        </marker>
      </defs>
    </svg>
  );
};
