
import React from 'react';
import { Lock, X } from 'lucide-react';
import { DragDirection } from './useDragHandler';

interface DragIndicatorsProps {
  isRecording: boolean;
  isDragging: boolean;
  dragDirection: DragDirection;
}

const DragIndicators: React.FC<DragIndicatorsProps> = ({
  isRecording,
  isDragging,
  dragDirection
}) => {
  if (!isRecording || !isDragging) return null;

  return (
    <div className="absolute top-0 left-0 w-full pointer-events-none">
      <div className="relative w-full flex justify-center">
        <div className={`absolute -top-14 transform transition-opacity duration-150 ${dragDirection === 'up' ? 'opacity-100' : 'opacity-50'}`}>
          <div className="bg-green-100 border border-green-200 rounded-md p-1 flex flex-col items-center">
            <Lock className="h-4 w-4 text-green-500" />
            <span className="text-xs text-green-600">Travar</span>
          </div>
          <div className="h-4 w-0.5 bg-green-200 mx-auto"></div>
        </div>
        <div className={`absolute -left-16 transform transition-opacity duration-150 ${dragDirection === 'left' ? 'opacity-100' : 'opacity-50'}`}>
          <div className="h-0.5 w-4 bg-red-200 my-auto"></div>
          <div className="bg-red-100 border border-red-200 rounded-md p-1 flex items-center">
            <X className="h-4 w-4 text-red-500" />
            <span className="text-xs text-red-600">Cancelar</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DragIndicators;
