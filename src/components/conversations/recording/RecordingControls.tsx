
import React from 'react';
import { Button } from "@/components/ui/button";
import { Mic, Stop, Send, Trash2 } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  hasRecordedMedia: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSaveRecording: () => void;
  onReset?: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  hasRecordedMedia,
  onStartRecording,
  onStopRecording,
  onSaveRecording,
  onReset
}) => {
  return (
    <div className="flex gap-3 justify-center">
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
      
      {isRecording && (
        <Button
          onClick={onStopRecording}
          variant="destructive"
          size="lg"
        >
          <Stop className="h-4 w-4 mr-2" />
          Parar Gravação
        </Button>
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
