
import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useRecording, MediaType } from './recording/useRecording';
import MediaPreview from './recording/MediaPreview';
import RecordingControls from './recording/RecordingControls';

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
  const [recordingTime, setRecordingTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const { 
    isRecording, 
    recordedMedia, 
    stream,
    startRecording, 
    stopRecording, 
    resetRecording,
    stopMediaStream,
    pauseRecording,
    resumeRecording
  } = useRecording({ 
    mediaType 
  });

  const closeDialog = () => {
    stopMediaStream();
    resetRecording();
    setIsPaused(false);
    onOpenChange(false);
  };

  const handleTimeUpdate = (seconds: number) => {
    setRecordingTime(seconds);
  };

  const handleSaveRecording = () => {
    if (recordedMedia && recordedMedia.blob) {
      const file = new File([recordedMedia.blob], recordedMedia.fileName, {
        type: recordedMedia.blob.type
      });
      
      onSave(file, mediaType);
      closeDialog();
    }
  };

  const handleReset = () => {
    resetRecording();
    setIsPaused(false);
  };

  const handlePauseRecording = () => {
    if (isRecording) {
      pauseRecording();
      setIsPaused(true);
    }
  };

  const handleResumeRecording = () => {
    if (isPaused) {
      resumeRecording();
      setIsPaused(false);
    }
  };

  const getDialogTitle = () => {
    const mediaTypeText = 
      mediaType === 'audio' ? 'áudio' : 
      mediaType === 'video' ? 'vídeo' : 'foto';
    
    if (isRecording && !isPaused) {
      return `Gravando ${mediaTypeText}...`;
    } else if (isPaused) {
      return `Gravação de ${mediaTypeText} pausada`;
    } else if (recordedMedia) {
      return `Revisar ${mediaTypeText}`;
    } else {
      return `Gravar ${mediaTypeText}`;
    }
  };

  useEffect(() => {
    // Reset state when dialog opens
    if (open) {
      resetRecording();
      setRecordingTime(0);
      setIsPaused(false);
    } else {
      stopMediaStream();
    }
  }, [open]);

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (isRecording && !isPaused) {
          // Prevent closing while recording
          return;
        }
        onOpenChange(newOpen);
      }}
    >
      <DialogContent 
        className="sm:max-w-md" 
        onInteractOutside={(e) => {
          if (isRecording) {
            e.preventDefault();
          }
        }}
      >
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          <MediaPreview 
            mediaType={mediaType}
            isRecording={isRecording}
            isPaused={isPaused}
            recordedMedia={recordedMedia}
            stream={stream}
          />
          
          <RecordingControls 
            isRecording={isRecording}
            isPaused={isPaused}
            hasRecordedMedia={!!recordedMedia}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onPauseRecording={handlePauseRecording}
            onResumeRecording={handleResumeRecording}
            onSaveRecording={handleSaveRecording}
            onReset={handleReset}
          />
        </div>
        
        <DialogFooter className="sm:justify-start">
          {!isRecording && !recordedMedia && (
            <Button
              type="button"
              variant="secondary"
              onClick={closeDialog}
            >
              Cancelar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RecordingDialog;
