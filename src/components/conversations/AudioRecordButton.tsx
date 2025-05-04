
import React, { useState, useRef, useEffect } from 'react';
import { Mic, X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

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
  const [isDragging, setIsDragging] = useState(false);
  const [dragDirection, setDragDirection] = useState<'none' | 'up' | 'left'>('none');
  const [isLocked, setIsLocked] = useState(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Threshold for dragging (in pixels)
  const DRAG_THRESHOLD = 40;
  
  const handlePointerDown = (e: React.PointerEvent) => {
    // Only handle left clicks
    if (e.button !== 0) return;
    
    // Start recording
    if (!isRecording) {
      onStartRecording();
    }
    
    // Set up dragging
    startPos.current = { x: e.clientX, y: e.clientY };
    setIsDragging(true);
    setDragDirection('none');
    
    // Capture the pointer to detect movements outside the button
    if (buttonRef.current) {
      buttonRef.current.setPointerCapture(e.pointerId);
    }
    
    // Prevent text selection
    e.preventDefault();
  };
  
  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging || !startPos.current || isLocked) return;
    
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    
    // Check if user is dragging up (lock) or left (cancel)
    if (Math.abs(deltaY) > DRAG_THRESHOLD && deltaY < 0) {
      setDragDirection('up');
    } else if (Math.abs(deltaX) > DRAG_THRESHOLD && deltaX < 0) {
      setDragDirection('left');
    } else {
      setDragDirection('none');
    }
  };
  
  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging || !isRecording) return;
    
    // Release pointer capture
    if (buttonRef.current) {
      buttonRef.current.releasePointerCapture(e.pointerId);
    }
    
    // Handle different drag directions
    if (dragDirection === 'up') {
      // Lock the recording
      setIsLocked(true);
    } else if (dragDirection === 'left') {
      // Cancel the recording
      onCancelRecording();
      setIsLocked(false);
    } else if (!isLocked) {
      // Regular stop if not locked and not dragged
      onStopRecording();
    }
    
    setIsDragging(false);
    startPos.current = null;
  };
  
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
        <div className="flex items-center gap-2 py-1 px-2 bg-red-50 border border-red-200 rounded-md">
          <div className="animate-pulse">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
          </div>
          <span className="text-xs text-red-600">Gravando...</span>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleStopLockedRecording}
            title="Finalizar gravação"
          >
            <Lock className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleCancelLockedRecording}
            title="Cancelar gravação"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
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
          
          {isRecording && isDragging && (
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
          )}
        </div>
      )}
    </div>
  );
};

export default AudioRecordButton;
