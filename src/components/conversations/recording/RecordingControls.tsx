
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Send, Trash2, Pause, Play, Loader2 } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
  isInitializing?: boolean;
  hasRecordedMedia: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onSaveRecording: () => void;
  onReset?: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  isPaused,
  isInitializing = false,
  hasRecordedMedia,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onSaveRecording,
  onReset
}) => {
  // Show initializing state
  if (isInitializing) {
    return (
      <div className="flex justify-center mt-2">
        <Button
          disabled
          variant="outline"
          className="bg-blue-50 border-blue-100"
        >
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Iniciando microfone...
        </Button>
      </div>
    );
  }

  // Not recording and no media recorded yet
  if (!isRecording && !hasRecordedMedia) {
    return (
      <div className="flex gap-3 flex-wrap justify-center">
        <Button
          onClick={onStartRecording}
          className="bg-blue-600 hover:bg-blue-700 px-6"
          size="lg"
        >
          <Mic className="h-4 w-4 mr-2" />
          Iniciar Gravação
        </Button>
      </div>
    );
  }
  
  // Currently recording, not paused
  if (isRecording && !isPaused) {
    return (
      <div className="flex gap-3 flex-wrap justify-center mt-2">
        <Button
          onClick={onPauseRecording}
          variant="outline"
          size="sm"
          className="bg-white"
        >
          <Pause className="h-4 w-4 mr-2" />
          Pausar
        </Button>
        
        <Button
          onClick={onStopRecording}
          variant="destructive"
          size="sm"
        >
          <Square className="h-4 w-4 mr-2" />
          Parar
        </Button>
      </div>
    );
  }

  // Recording is paused
  if (isRecording && isPaused) {
    return (
      <div className="flex gap-3 flex-wrap justify-center mt-2">
        <Button
          onClick={onResumeRecording}
          variant="outline"
          size="sm"
          className="bg-blue-50 border-blue-200 hover:bg-blue-100"
        >
          <Play className="h-4 w-4 mr-2" />
          Retomar
        </Button>
        
        <Button
          onClick={onStopRecording}
          variant="destructive"
          size="sm"
        >
          <Square className="h-4 w-4 mr-2" />
          Parar
        </Button>
      </div>
    );
  }
  
  // After recording is complete, with saved media
  if (hasRecordedMedia && !isRecording) {
    return (
      <div className="flex gap-3 flex-wrap justify-center mt-2">
        {onReset && (
          <Button
            onClick={onReset}
            variant="outline"
            size="sm"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Descartar
          </Button>
        )}
        
        <Button
          onClick={onSaveRecording}
          className="bg-pink-600 hover:bg-pink-700"
          size="sm"
        >
          <Send className="h-4 w-4 mr-2" />
          Enviar
        </Button>
      </div>
    );
  }
  
  return null;
};

export default RecordingControls;
