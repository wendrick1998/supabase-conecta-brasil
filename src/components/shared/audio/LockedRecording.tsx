
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import RecordingTimer from './RecordingTimer';

interface LockedRecordingProps {
  recordingTime: number;
  onStopRecording: () => void;
  onCancelRecording: () => void;
  size: 'sm' | 'md' | 'lg';
  className?: string;
}

const LockedRecording: React.FC<LockedRecordingProps> = ({ 
  recordingTime, 
  onStopRecording, 
  onCancelRecording,
  size = 'md',
  className
}) => {
  // Button size classes
  const sizeClasses = {
    'sm': 'h-10 w-10',
    'md': 'h-12 w-12',
    'lg': 'h-16 w-16'
  };
  
  return (
    <div className="flex flex-col items-center">
      <div className={cn("flex items-center space-x-2 mb-2")}>
        <div className="relative">
          <div className="absolute -top-1 -right-1">
            <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
          </div>
          <Button
            variant="outline"
            size="icon"
            className={cn("border-red-500 bg-red-50", sizeClasses[size], className)}
            onClick={onStopRecording}
          >
            <Mic className="h-5 w-5 text-red-500" />
          </Button>
        </div>
        <RecordingTimer timeMs={recordingTime} className="text-red-500" />
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-red-500"
          onClick={onCancelRecording}
        >
          <X className="h-4 w-4 mr-1" />
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default LockedRecording;
