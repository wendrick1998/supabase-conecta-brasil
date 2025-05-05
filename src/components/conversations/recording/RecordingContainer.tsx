
import React, { useEffect } from 'react';
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
  // Log state changes for debugging
  useEffect(() => {
    console.log('RecordingContainer state:', { 
      mediaType, 
      isRecording, 
      isPaused, 
      isInitializing, 
      recordedMedia: !!recordedMedia,
      stream: !!stream
    });
  }, [mediaType, isRecording, isPaused, isInitializing, recordedMedia, stream]);
  
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
  
  // Show error message if there's an initialization error
  if (initError) {
    return (
      <div className="flex flex-col items-center justify-center p-4 bg-red-50 text-red-800 rounded-md">
        <h3 className="font-medium text-lg mb-2">Erro de acesso ao dispositivo</h3>
        <p className="text-center text-sm">
          Não foi possível acessar {mediaType === 'audio' ? 'o microfone' : 
            mediaType === 'video' ? 'a câmera' : 'a câmera'}. 
          Verifique as permissões do seu navegador.
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
      
      {/* Only show recording controls if we're not showing the post-recording controls in AudioPreview */}
      {(mediaType !== 'audio' || !recordedMedia || isRecording) && (
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
