
import React from 'react';
import MediaPreview from './MediaPreview';
import RecordingControls from './RecordingControls';
import { MediaType } from './types';

interface RecordingContainerProps {
  mediaType: MediaType;
  isRecording: boolean;
  isPaused: boolean;
  isInitializing?: boolean;
  initError?: string | null;
  recordingTime?: number;
  recordedMedia: {
    url: string;
    blob: Blob | null;
    fileName: string;
  } | null;
  stream: MediaStream | null;
  browserSupport?: boolean | null;
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
  isInitializing = false,
  initError = null,
  recordingTime = 0,
  recordedMedia,
  stream,
  browserSupport = true,
  onStartRecording,
  onStopRecording,
  onPauseRecording,
  onResumeRecording,
  onSaveRecording,
  onReset
}) => {
  // Show browser support warning if needed
  if (browserSupport === false) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-yellow-50 text-yellow-800 rounded-md">
        <h3 className="font-medium text-lg mb-2">Navegador não compatível</h3>
        <p className="text-center text-sm">
          Seu navegador não suporta gravação de {mediaType === 'audio' ? 'áudio' : 
            mediaType === 'video' ? 'vídeo' : 'foto'}. 
          Por favor, use um navegador mais recente como Chrome, Firefox ou Edge.
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <MediaPreview 
        mediaType={mediaType}
        isRecording={isRecording}
        isPaused={isPaused}
        isInitializing={isInitializing}
        initError={initError}
        recordedMedia={recordedMedia}
        recordingTime={recordingTime}
        stream={stream}
        onSaveRecording={onSaveRecording}
        onReset={onReset}
      />
      
      {/* Only show recording controls if we don't have recorded media 
          or we're still recording. AudioPreview handles its own controls
          after recording is complete */}
      {(!recordedMedia || isRecording) && (
        <RecordingControls 
          isRecording={isRecording}
          isPaused={isPaused}
          isInitializing={isInitializing}
          hasRecordedMedia={!!recordedMedia}
          onStartRecording={onStartRecording}
          onStopRecording={onStopRecording}
          onPauseRecording={onPauseRecording}
          onResumeRecording={onResumeRecording}
          onSaveRecording={onSaveRecording}
          onReset={onReset}
        />
      )}
    </div>
  );
};

export default RecordingContainer;
