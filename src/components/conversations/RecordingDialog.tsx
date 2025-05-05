
import React from 'react';
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mic, Square, Send, Trash2, Pause, Play } from "lucide-react";
import { MediaType } from './recording/types';
import useAudioRecorder from '@/hooks/useAudioRecorder';
import AudioWaveform from './recording/AudioWaveform';

interface RecordingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mediaType: MediaType;
  onSave: (file: File, type: MediaType) => void;
}

const RecordingDialog = ({ 
  open, 
  onOpenChange, 
  mediaType, 
  onSave 
}: RecordingDialogProps) => {
  const {
    state,
    isRecording,
    isPaused,
    recordingTime,
    formattedTime,
    recordedAudio,
    audioLevel,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    resetRecording
  } = useAudioRecorder({
    onComplete: (audio) => {
      console.log('Recording completed:', audio);
    }
  });

  // Handle closing dialog
  const handleCloseDialog = () => {
    if (isRecording || isPaused) {
      // Prevent closing while recording is active
      return;
    }
    resetRecording();
    onOpenChange(false);
  };

  // Handle saving the recording
  const handleSaveRecording = () => {
    if (recordedAudio) {
      const file = new File([recordedAudio.blob], recordedAudio.fileName, {
        type: 'audio/webm'
      });
      onSave(file, mediaType);
      resetRecording();
      onOpenChange(false);
    }
  };

  // Start recording when dialog opens
  React.useEffect(() => {
    if (open && state === 'idle' && mediaType === 'audio') {
      const timer = setTimeout(() => {
        startRecording();
      }, 500);
      return () => clearTimeout(timer);
    }
    
    // Cleanup when dialog closes
    if (!open && (isRecording || isPaused)) {
      resetRecording();
    }
  }, [open, state, mediaType, isRecording, isPaused, startRecording, resetRecording]);

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (isRecording || isPaused) {
          // Prevent closing during active recording
          return;
        }
        onOpenChange(newOpen);
      }}
    >
      <DialogContent 
        className="sm:max-w-md"
        onInteractOutside={(e) => {
          if (isRecording || isPaused) {
            e.preventDefault();
          }
        }}
      >
        <div className="flex flex-col items-center py-4">
          <h2 className="text-xl font-semibold mb-6">
            {recordedAudio ? "Revisar Gravação" : isRecording ? "Gravando Áudio" : "Gravar Áudio"}
          </h2>
          
          {/* Audio recording visualization */}
          <div className={`relative w-full flex flex-col items-center justify-center mb-6 
            ${isRecording ? 'animate-pulse' : ''}`}>
            
            {/* Recording microphone icon with animation */}
            <div className={`mb-4 flex items-center justify-center w-20 h-20 rounded-full 
              ${isRecording ? 'bg-red-500' : isPaused ? 'bg-amber-500' : recordedAudio ? 'bg-green-500' : 'bg-blue-500'}`}>
              <Mic className="h-10 w-10 text-white" />
              {isRecording && (
                <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
              )}
            </div>
            
            {/* Timer display */}
            <div className="text-2xl font-mono font-bold mb-2">
              {formattedTime}
            </div>
            
            {/* Waveform visualization */}
            <AudioWaveform 
              audioLevel={audioLevel}
              isRecording={isRecording}
              isPaused={isPaused}
              className="my-2"
            />
            
            {/* Status text */}
            <div className="text-sm text-gray-500 mt-1">
              {isRecording ? "Gravando..." : isPaused ? "Gravação pausada" : 
                recordedAudio ? "Gravação concluída" : "Pronto para gravar"}
            </div>
          </div>
          
          {/* Audio playback */}
          {recordedAudio && !isRecording && !isPaused && (
            <div className="w-full mb-6">
              <audio 
                src={recordedAudio.url} 
                controls 
                className="w-full"
                autoPlay={false}
              />
            </div>
          )}
          
          {/* Controls */}
          <div className="flex gap-3 justify-center">
            {!isRecording && !isPaused && !recordedAudio && (
              <Button
                onClick={startRecording}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Mic className="h-4 w-4 mr-2" />
                Iniciar Gravação
              </Button>
            )}
            
            {isRecording && (
              <>
                <Button
                  onClick={pauseRecording}
                  variant="outline"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </Button>
                
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Parar
                </Button>
              </>
            )}
            
            {isPaused && (
              <>
                <Button
                  onClick={resumeRecording}
                  variant="outline"
                  className="border-blue-300 bg-blue-50 hover:bg-blue-100"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Continuar
                </Button>
                
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Finalizar
                </Button>
              </>
            )}
            
            {recordedAudio && !isRecording && !isPaused && (
              <>
                <Button
                  onClick={resetRecording}
                  variant="outline"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Descartar
                </Button>
                
                <Button
                  onClick={handleSaveRecording}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordingDialog;
