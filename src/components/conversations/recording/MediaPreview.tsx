
import React from 'react';
import { MediaType, RecordedMedia } from './types';
import VideoPreview from './preview/VideoPreview';
import AudioPreview from './preview/AudioPreview';
import PhotoPreview from './preview/PhotoPreview';
import LoadingPreview from './preview/LoadingPreview';

interface MediaPreviewProps {
  mediaType: MediaType;
  isRecording: boolean;
  isPaused?: boolean;
  isInitializing?: boolean;
  initError?: string | null;
  recordedMedia: RecordedMedia | null;
  recordingTime?: number;
  stream: MediaStream | null;
  onSaveRecording?: () => void;
  onReset?: () => void;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  mediaType,
  isRecording,
  isPaused = false,
  isInitializing = false,
  initError = null,
  recordedMedia,
  recordingTime = 0,
  stream,
  onSaveRecording,
  onReset
}) => {
  // Show error or initializing states first
  if (initError) {
    return <LoadingPreview error={initError} />;
  }
  
  if (isInitializing) {
    return <LoadingPreview isInitializing={true} />;
  }
  
  // Render different previews based on media type
  if (mediaType === 'video') {
    return (
      <VideoPreview
        isRecording={isRecording}
        isPaused={isPaused}
        recordedMedia={recordedMedia}
        stream={stream}
        onSaveRecording={onSaveRecording}
        onReset={onReset}
      />
    );
  }
  
  if (mediaType === 'audio') {
    return (
      <AudioPreview
        isRecording={isRecording}
        isPaused={isPaused}
        recordingTime={recordingTime}
        recordedMedia={recordedMedia}
        onSaveRecording={onSaveRecording}
        onReset={onReset}
      />
    );
  }
  
  if (mediaType === 'photo' && stream) {
    return <PhotoPreview stream={stream} />;
  }
  
  if (isRecording) {
    return <LoadingPreview />;
  }
  
  return null;
};

export default MediaPreview;
