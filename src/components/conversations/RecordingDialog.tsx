
import React from 'react';
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { MediaType } from './recording/useRecording';
import { useRecordingDialog } from './recording/useRecordingDialog';
import RecordingHeader from './recording/RecordingHeader';
import RecordingFooter from './recording/RecordingFooter';
import RecordingContainer from './recording/RecordingContainer';

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
    isPaused,
    isRecording,
    recordedMedia,
    stream,
    startRecording,
    stopRecording,
    handlePauseRecording,
    handleResumeRecording,
    handleReset,
    handleSaveRecording,
    closeDialog
  } = useRecordingDialog({
    open,
    mediaType,
    onSave,
    onOpenChange
  });

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
        <RecordingHeader 
          mediaType={mediaType}
          isRecording={isRecording}
          isPaused={isPaused}
          hasRecordedMedia={!!recordedMedia}
        />
        
        <RecordingContainer 
          mediaType={mediaType}
          isRecording={isRecording}
          isPaused={isPaused}
          recordedMedia={recordedMedia}
          stream={stream}
          onStartRecording={startRecording}
          onStopRecording={stopRecording}
          onPauseRecording={handlePauseRecording}
          onResumeRecording={handleResumeRecording}
          onSaveRecording={handleSaveRecording}
          onReset={handleReset}
        />
        
        <RecordingFooter 
          isRecording={isRecording} 
          hasRecordedMedia={!!recordedMedia}
          onClose={closeDialog}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RecordingDialog;
