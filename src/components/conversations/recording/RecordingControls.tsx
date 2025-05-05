
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Square, Send, Trash2, Pause, Play } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  isPaused: boolean;
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
  hasRecordedMedia,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onSaveRecording,
  onReset
}) => {
  return (
    <div className="flex gap-3 flex-wrap justify-center">
      {!isRecording && !hasRecordedMedia && (
        <Button
          onClick={onStartRecording}
          className="bg-blue-600 hover:bg-blue-700 px-6"
          size="lg"
        >
          <Mic className="h-4 w-4 mr-2" />
          Iniciar Gravação
        </Button>
      )}
      
      {isRecording && !isPaused && (
        <>
          <Button
            onClick={onPauseRecording}
            variant="outline"
            size="sm"
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
        </>
      )}

      {isRecording && isPaused && (
        <>
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
        </>
      )}
      
      {hasRecordedMedia && !isRecording && (
        <>
          <Button
            onClick={onReset || onStartRecording}
            variant="outline"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Regravar
          </Button>
          
          <Button
            onClick={onSaveRecording}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4 mr-2" />
            Salvar e Enviar
          </Button>
        </>
      )}
    </div>
  );
};

export default RecordingControls;
