
import React, { useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { MediaType } from './recording/types';
import useAudioRecorder from '@/hooks/useAudioRecorder';
import RecordingStatus from './recording/RecordingStatus';
import RecordingControls from './recording/RecordingControls';
import AudioPlayerPreview from './recording/AudioPlayerPreview';
import { toast } from '@/components/ui/sonner';

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
    if (!recordedAudio || !recordedAudio.blob) {
      console.error('No recorded audio available');
      toast.error('Nenhum áudio disponível para salvar');
      return;
    }

    try {
      console.log(`Creating file from blob: ${recordedAudio.blob.size} bytes`);
      
      // Validate blob size
      if (recordedAudio.blob.size === 0) {
        toast.error('O arquivo de áudio está vazio');
        return;
      }
      
      // Use audio/mpeg if supported, otherwise fallback to webm
      const mimeType = 'audio/webm';
      const extension = 'webm';
      
      const fileName = `audio-${Date.now()}.${extension}`;
      const file = new File([recordedAudio.blob], fileName, {
        type: mimeType
      });
      
      console.log(`File created successfully: ${file.name}, ${file.size} bytes`);
      onSave(file, mediaType);
      resetRecording();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating file from blob:', error);
      toast.error('Erro ao processar áudio');
    }
  };

  // Start recording when dialog opens
  useEffect(() => {
    if (open && state === 'idle' && mediaType === 'audio') {
      const timer = setTimeout(() => {
        console.log('Auto-starting recording');
        startRecording();
      }, 500);
      return () => clearTimeout(timer);
    }
    
    // Cleanup when dialog closes
    if (!open && (isRecording || isPaused)) {
      console.log('Dialog closed, resetting recording');
      resetRecording();
    }
  }, [open, state, mediaType, isRecording, isPaused, startRecording, resetRecording]);

  const dialogTitle = () => {
    if (recordedAudio) return "Revisar Gravação";
    if (isRecording) return "Gravando Áudio";
    return mediaType === 'audio' ? "Gravar Áudio" : "Capturar Mídia";
  };

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
            {dialogTitle()}
          </h2>
          
          {/* Audio recording visualization */}
          <RecordingStatus 
            isRecording={isRecording}
            isPaused={isPaused}
            recordedAudio={recordedAudio}
            formattedTime={formattedTime}
            audioLevel={audioLevel || new Array(10).fill(0.1)}
          />
          
          {/* Audio playback */}
          {recordedAudio && recordedAudio.url && !isRecording && !isPaused && (
            <AudioPlayerPreview audioUrl={recordedAudio.url} />
          )}
          
          {/* Controls */}
          <div className="flex gap-3 justify-center">
            <RecordingControls 
              isRecording={isRecording}
              isPaused={isPaused}
              hasRecordedMedia={!!recordedAudio}
              onStartRecording={startRecording}
              onPauseRecording={pauseRecording}
              onResumeRecording={resumeRecording}
              onStopRecording={stopRecording}
              onResetRecording={resetRecording}
              onSaveRecording={handleSaveRecording}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RecordingDialog;
