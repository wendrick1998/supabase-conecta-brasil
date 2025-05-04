
import React from 'react';
import { Button } from '@/components/ui/button';
import { Lock, X } from 'lucide-react';

interface LockedRecordingProps {
  onStopRecording: () => void;
  onCancelRecording: () => void;
}

const LockedRecording: React.FC<LockedRecordingProps> = ({
  onStopRecording,
  onCancelRecording
}) => {
  return (
    <div className="flex items-center gap-2 py-1 px-2 bg-red-50 border border-red-200 rounded-md">
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse delay-75"></div>
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse delay-150"></div>
      </div>
      <span className="text-xs text-red-600 font-medium">Gravando...</span>
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={onStopRecording}
        title="Finalizar gravação"
      >
        <Lock className="h-3 w-3" />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
        onClick={onCancelRecording}
        title="Cancelar gravação"
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  );
};

export default LockedRecording;
