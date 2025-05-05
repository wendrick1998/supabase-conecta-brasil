
import React from 'react';
import { ArrowUp, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DragDirection } from '@/hooks/useAudioRecording';

interface DragIndicatorsProps {
  direction: DragDirection;
  size: 'sm' | 'md' | 'lg';
}

const DragIndicators: React.FC<DragIndicatorsProps> = ({ direction, size }) => {
  const sizeClasses = {
    'sm': 'p-2',
    'md': 'p-3',
    'lg': 'p-4'
  };
  
  if (direction === 'none') return null;
  
  return (
    <div className={cn(
      "absolute left-1/2 -translate-x-1/2 flex flex-col items-center",
      sizeClasses[size],
      "-top-16"
    )}>
      {direction === 'up' && (
        <div className="text-blue-500">
          <ArrowUp className="animate-bounce" />
          <span className="text-xs mt-1">Travar</span>
        </div>
      )}
      
      {direction === 'left' && (
        <div className="absolute -left-10 flex items-center text-red-500">
          <X className="animate-pulse" />
          <span className="text-xs ml-1">Cancelar</span>
        </div>
      )}
    </div>
  );
};

export default DragIndicators;
