
import React from 'react';
import { Button } from "@/components/ui/button";

interface RecordingControlsProps {
  isRecording: boolean;
  hasRecordedMedia: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onSaveRecording: () => void;
}

const RecordingControls: React.FC<RecordingControlsProps> = ({
  isRecording,
  hasRecordedMedia,
  onStartRecording,
  onStopRecording,
  onSaveRecording
}) => {
  return (
    <div className="flex gap-3 justify-center">
      {!isRecording && !hasRecordedMedia && (
        <Button
          onClick={onStartRecording}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Iniciar Gravação
        </Button>
      )}
      
      {isRecording && (
        <Button
          onClick={onStopRecording}
          variant="destructive"
        >
          Parar Gravação
        </Button>
      )}
      
      {hasRecordedMedia && !isRecording && (
        <>
          <Button
            onClick={onStartRecording}
            variant="outline"
          >
            Regravar
          </Button>
          
          <Button
            onClick={onSaveRecording}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Salvar e Enviar
          </Button>
        </>
      )}
    </div>
  );
};

export default RecordingControls;
