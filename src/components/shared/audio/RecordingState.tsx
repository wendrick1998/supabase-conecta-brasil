
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import RecordingTimer from './RecordingTimer';
import DragIndicators from './DragIndicators';
import { DragDirection } from '@/hooks/useAudioRecording';

interface RecordingStateProps {
  recordingTime: number;
  dragDirection: DragDirection;
  buttonRef: React.RefObject<HTMLButtonElement>;
  size: 'sm' | 'md' | 'lg';
  className?: string;
  handlePointerDown: (e: React.PointerEvent<HTMLButtonElement>) => void;
  handlePointerMove: (e: React.PointerEvent<HTMLButtonElement>) => void;
  handlePointerUp: (e: React.PointerEvent<HTMLButtonElement>) => void;
}

const RecordingState: React.FC<RecordingStateProps> = ({
  recordingTime,
  dragDirection,
  buttonRef,
  size,
  className,
  handlePointerDown,
  handlePointerMove,
  handlePointerUp
}) => {
  // Button size classes
  const sizeClasses = {
    'sm': 'h-10 w-10',
    'md': 'h-12 w-12',
    'lg': 'h-16 w-16'
  };
  
  return (
    <div className="relative">
      <DragIndicators direction={dragDirection} size={size} />
      <div className="flex items-center space-x-2">
        <Button
          ref={buttonRef}
          variant="outline"
          size="icon"
          className={cn(
            "border-2 border-red-500 bg-red-100 animate-pulse",
            sizeClasses[size],
            className
          )}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
        >
          <Mic className="h-5 w-5 text-red-600" />
        </Button>
        <RecordingTimer timeMs={recordingTime} className="text-red-500" />
      </div>
      <p className="text-xs text-center mt-1 text-gray-500">
        Arraste para cima para travar
      </p>
    </div>
  );
};

export default RecordingState;
