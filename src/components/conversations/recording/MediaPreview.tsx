
import React from 'react';
import { Loader2 } from "lucide-react";
import { MediaType } from './useRecording';

interface MediaPreviewProps {
  mediaType: MediaType;
  isRecording: boolean;
  recordedMedia: {
    url: string;
    blob: Blob | null;
    fileName: string;
  } | null;
  stream: MediaStream | null;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({
  mediaType,
  isRecording,
  recordedMedia,
  stream
}) => {
  if (mediaType === 'video' && stream && isRecording) {
    return (
      <video 
        autoPlay 
        muted 
        className="w-full h-64 bg-gray-100 rounded-md object-cover mb-4"
      >
        <source src={stream ? '' : undefined} />
      </video>
    );
  }
  
  if (mediaType === 'video' && recordedMedia && !isRecording) {
    return (
      <video 
        src={recordedMedia.url} 
        controls 
        className="w-full h-64 bg-gray-100 rounded-md object-cover mb-4"
      />
    );
  }
  
  if (mediaType === 'audio' && isRecording) {
    return (
      <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center mb-4">
        <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse mr-2"></div>
        <span>Gravando áudio...</span>
      </div>
    );
  }
  
  if (mediaType === 'audio' && recordedMedia && !isRecording) {
    return (
      <audio 
        src={recordedMedia.url} 
        controls 
        className="w-full mb-4"
      />
    );
  }
  
  if (isRecording) {
    return (
      <div className="flex items-center justify-center mb-4">
        <Loader2 className="h-5 w-5 animate-spin mr-2" />
        <span>Gravando...</span>
      </div>
    );
  }
  
  return null;
};

export default MediaPreview;
