
import React from 'react';
import MediaPreview from './MediaPreview';
import RecordingControls from './RecordingControls';

interface RecordingContainerProps {
  mediaType: string;
  isRecording: boolean;
  isPaused: boolean;
  recordedMedia: {
    url: string;
    blob: Blob | null;
    fileName: string;
  } | null;
  stream: MediaStream | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPauseRecording: () => void;
  onResumeRecording: () => void;
  onSaveRecording: () => void;
  onReset: () => void;
}

const RecordingContainer: React.FC<RecordingContainerProps> = ({
  mediaType,
  isRecording,
  isPaused,
  recordedMedia,
  stream,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onSaveRecording,
  onReset
}) => {
  return (
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
        onStartRecording={onStartRecording}
        onStopRecording={onStopRecording}
        onPauseRecording={onPauseRecording}
        onResumeRecording={onResumeRecording}
        onSaveRecording={onSaveRecording}
        onReset={onReset}
      />
    </div>
  );
};

export default RecordingContainer;
