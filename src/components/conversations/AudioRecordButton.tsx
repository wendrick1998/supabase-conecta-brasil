
import React, { useState, useEffect } from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useDragHandler } from './audio/useDragHandler';
import DragIndicators from './audio/DragIndicators';
import LockedRecording from './audio/LockedRecording';

interface AudioRecordButtonProps {
  onStartRecording: () => void;
  onStopRecording: () => void;
  onCancelRecording: () => void;
  isRecording: boolean;
}

const AudioRecordButton: React.FC<AudioRecordButtonProps> = ({
  onStartRecording,
  onStopRecording,
  onCancelRecording,
  isRecording
}) => {
  const [isLocked, setIsLocked] = useState(false);
  
  const {
    isDragging,
    dragDirection,
    buttonRef,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useDragHandler({
    isRecording,
    isLocked,
    onStartRecording,
    onStopRecording,
    onCancelRecording,
    setIsLocked
  });
  
  const handleStopLockedRecording = () => {
    onStopRecording();
    setIsLocked(false);
  };
  
  const handleCancelLockedRecording = () => {
    onCancelRecording();
    setIsLocked(false);
  };
  
  // Prevent accidental touch scrolling when recording
  useEffect(() => {
    const preventDefault = (e: TouchEvent) => {
      if (isRecording) {
        e.preventDefault();
      }
    };
    
    document.addEventListener('touchmove', preventDefault, { passive: false });
    return () => {
      document.removeEventListener('touchmove', preventDefault);
    };
  }, [isRecording]);
  
  // Clean up recording if component unmounts
  useEffect(() => {
    return () => {
      if (isRecording) {
        onCancelRecording();
      }
    };
  }, [isRecording, onCancelRecording]);
  
  return (
    <div className="relative">
      {isLocked ? (
        <LockedRecording
          onStopRecording={handleStopLockedRecording}
          onCancelRecording={handleCancelLockedRecording}
        />
      ) : (
        <div className="relative">
          <Button
            ref={buttonRef}
            variant={isRecording ? 'destructive' : 'outline'}
            size="icon"
            title={isRecording ? 'Solte para parar' : 'Pressione para gravar áudio'}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            className="transition-all duration-200"
          >
            <Mic className="h-4 w-4" />
          </Button>
          
          <DragIndicators
            isRecording={isRecording}
            isDragging={isDragging}
            dragDirection={dragDirection}
          />
        </div>
      )}
    </div>
  );
};

export default AudioRecordButton;
