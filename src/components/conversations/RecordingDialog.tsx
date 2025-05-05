
import React from 'react';
import { 
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { MediaType } from './recording/types';
import useRecordingDialog from './recording/useRecordingDialog';
import RecordingStatus from './recording/RecordingStatus';
import RecordingControls from './recording/RecordingControls';
import AudioPlayerPreview from './recording/AudioPlayerPreview';

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
    resetRecording,
    handleSaveRecording,
    handleCloseDialog
  } = useRecordingDialog({
    open,
    onOpenChange,
    mediaType,
    onSave
  });

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
          <RecordingStatus 
            isRecording={isRecording}
            isPaused={isPaused}
            recordedAudio={recordedAudio}
            formattedTime={formattedTime}
            audioLevel={audioLevel}
          />
          
          {/* Audio playback */}
          {recordedAudio && !isRecording && !isPaused && (
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
