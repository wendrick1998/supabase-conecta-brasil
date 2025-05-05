
import { useRef } from 'react';
import { useAudioRecorder } from './audio/useAudioRecorder';
import { useDragHandler } from './audio/useDragHandler';

export type DragDirection = 'none' | 'up' | 'left';

export const useAudioRecording = () => {
  // Use the refactored audio recorder hook
  const {
    isRecording,
    isLocked,
    recordingTime,
    recordedAudio,
    dragDirection,
    startRecording,
    stopRecording,
    cancelRecording,
    resetRecording,
    setIsLocked,
    setDragDirection
  } = useAudioRecorder();
  
  // Create button ref for drag handling
  const buttonRef = useRef<HTMLButtonElement>(null);
  
  // Set up drag handlers
  const { 
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  } = useDragHandler({
    isRecording,
    isLocked,
    onStartRecording: startRecording,
    onStopRecording: stopRecording,
    onCancelRecording: cancelRecording,
    setIsLocked
  });

  // Return the same interface as the original hook to maintain compatibility
  return {
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
    setIsLocked,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp
  };
};

// Fix for the RecordingControls component error
<lov-write file_path="src/components/conversations/recording/RecordingControls.tsx">
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Send, Trash2, Pause, Play } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  isInitializing?: boolean;
  hasRecordedMedia: boolean;
  onStartRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onStopRecording: () => void;
  onResetRecording: () => void;
  onSaveRecording: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  isInitializing = false,
  hasRecordedMedia,
  onStartRecording,
  onPauseRecording,
  onResumeRecording,
  onStopRecording,
  onResetRecording,
  onSaveRecording
}) => {
  // If we're initializing, show a loading state
  if (isInitializing) {
    return (
      <Button disabled variant="outline">
        <span className="animate-pulse">Inicializando...</span>
      </Button>
    );
  }
  
  if (!isRecording && !isPaused && !hasRecordedMedia) {
    return (
      <Button
        onClick={onStartRecording}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <Mic className="h-4 w-4 mr-2" />
        Iniciar Gravação
      </Button>
    );
  }
  
  if (isRecording && !isPaused) {
    return (
      <>
        <Button
          onClick={onPauseRecording}
          variant="outline"
        >
          <Pause className="h-4 w-4 mr-2" />
          Pausar
        </Button>
        
        <Button
          onClick={onStopRecording}
          variant="destructive"
        >
          <Square className="h-4 w-4 mr-2" />
          Parar
        </Button>
      </>
    );
  }
  
  if (isPaused) {
    return (
      <>
        <Button
          onClick={onResumeRecording}
          variant="outline"
          className="border-blue-300 bg-blue-50 hover:bg-blue-100"
        >
          <Play className="h-4 w-4 mr-2" />
          Continuar
        </Button>
        
        <Button
          onClick={onStopRecording}
          variant="destructive"
        >
          <Square className="h-4 w-4 mr-2" />
          Finalizar
        </Button>
      </>
    );
  }
  
  if (hasRecordedMedia) {
    return (
      <>
        <Button
          onClick={onResetRecording}
          variant="outline"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Descartar
        </Button>
        
        <Button
          onClick={onSaveRecording}
          className="bg-green-600 hover:bg-green-700"
        >
          <Send className="h-4 w-4 mr-2" />
          Enviar
        </Button>
      </>
    );
  }
  
  return null;
};

export default RecordingControls;
