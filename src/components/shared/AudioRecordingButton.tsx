
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, X, ArrowUp, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAudioRecording, DragDirection } from '@/hooks/useAudioRecording';

interface AudioRecordingButtonProps {
  onAudioCaptured?: (audio: { url: string; blob: Blob; duration: number }) => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Helper component to show the drag indicators
const DragIndicators: React.FC<{ direction: DragDirection, size: 'sm' | 'md' | 'lg' }> = ({ direction, size }) => {
  const sizeClasses = {
    'sm': 'p-2',
    'md': 'p-3',
    'lg': 'p-4'
  };
  
  return (
    <div className={cn(
      "absolute left-1/2 -translate-x-1/2 flex flex-col items-center",
      sizeClasses[size],
      direction === 'up' ? "text-blue-500" : "text-gray-400"
    )}>
      <ArrowUp className="animate-bounce" />
      <span className="text-xs mt-1">Travar</span>
      <div className={cn(
        "absolute -left-10 flex items-center",
        direction === 'left' ? "text-red-500" : "text-gray-400"
      )}>
        <X className="animate-pulse" />
        <span className="text-xs ml-1">Cancelar</span>
      </div>
    </div>
  );
};

// Timer display
const RecordingTimer: React.FC<{ timeMs: number, className?: string }> = ({ timeMs, className }) => {
  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  return (
    <div className={cn("text-xs font-mono", className)}>
      {formatTime(timeMs)}
    </div>
  );
};

export const AudioRecordingButton: React.FC<AudioRecordingButtonProps> = ({ 
  onAudioCaptured,
  size = 'md',
  className 
}) => {
  const {
    isRecording,
    isLocked,
    recordingTime,
    recordedAudio,
    dragDirection,
    buttonRef,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useAudioRecording();

  // Handle audio capture
  React.useEffect(() => {
    if (recordedAudio && onAudioCaptured) {
      onAudioCaptured(recordedAudio);
    }
  }, [recordedAudio, onAudioCaptured]);

  // Button size classes
  const sizeClasses = {
    'sm': 'h-10 w-10',
    'md': 'h-12 w-12',
    'lg': 'h-16 w-16'
  };

  // Render audio recording button in different states
  if (isLocked) {
    // Locked recording state
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
              onClick={stopRecording}
            >
              <Mic className="h-5 w-5 text-red-500" />
            </Button>
          </div>
          <RecordingTimer timeMs={recordingTime} className="text-red-500" />
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-500 hover:text-red-500"
            onClick={cancelRecording}
          >
            <X className="h-4 w-4 mr-1" />
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  if (isRecording) {
    // Active recording state (not locked)
    return (
      <div className="relative">
        <div className="absolute -top-16">
          <DragIndicators direction={dragDirection} size={size} />
        </div>
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
  }

  if (recordedAudio) {
    // Recorded audio preview state
    return (
      <div className="flex flex-col items-center">
        <audio 
          src={recordedAudio.url} 
          controls 
          className="w-full max-w-xs mb-2"
        />
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={resetRecording}
            className="text-red-500"
          >
            <X className="h-4 w-4 mr-1" />
            Descartar
          </Button>
          <Button 
            variant="default" 
            size="sm"
            onClick={() => resetRecording()}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Enviar
          </Button>
        </div>
      </div>
    );
  }

  // Default state (not recording)
  return (
    <Button
      ref={buttonRef}
      variant="outline"
      size="icon"
      className={cn(
        "border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-300", 
        sizeClasses[size], 
        className
      )}
      onClick={startRecording}
    >
      <Mic className="h-5 w-5 text-gray-500" />
    </Button>
  );
};

export default AudioRecordingButton;
