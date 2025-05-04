
import React from 'react';
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
  onSave: (file: File) => void;
}

const RecordingDialog = ({ 
  open, 
  onOpenChange, 
  mediaType, 
  onSave 
}: RecordingDialogProps) => {
  const { 
    isRecording, 
    recordedMedia, 
    stream,
    startRecording, 
    stopRecording, 
    resetRecording,
    stopMediaStream 
  } = useRecording({ 
    mediaType 
  });

  const closeDialog = () => {
    stopMediaStream();
    resetRecording();
    onOpenChange(false);
  };

  const handleSaveRecording = () => {
    if (recordedMedia && recordedMedia.blob) {
      const file = new File([recordedMedia.blob], recordedMedia.fileName, {
        type: recordedMedia.blob.type
      });
      
      onSave(file);
      closeDialog();
    }
  };

  React.useEffect(() => {
    // Reset state when dialog opens
    if (open) {
      resetRecording();
    } else {
      stopMediaStream();
    }
  }, [open]);

  return (
    <Dialog 
      open={open} 
      onOpenChange={(newOpen) => {
        if (isRecording) {
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
          <DialogTitle>
            {isRecording 
              ? `Gravando ${mediaType === 'audio' ? 'áudio' : 'vídeo'}...` 
              : `Gravar ${mediaType === 'audio' ? 'áudio' : 'vídeo'}`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center justify-center p-4">
          <MediaPreview 
            mediaType={mediaType}
            isRecording={isRecording}
            recordedMedia={recordedMedia}
            stream={stream}
          />
          
          <RecordingControls 
            isRecording={isRecording}
            hasRecordedMedia={!!recordedMedia}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onSaveRecording={handleSaveRecording}
          />
        </div>
        
        <DialogFooter className="sm:justify-start">
          {!isRecording && (
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
