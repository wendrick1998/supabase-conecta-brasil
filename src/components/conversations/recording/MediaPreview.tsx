
import React from 'react';
import { Loader2, Mic, Pause } from "lucide-react";
import { MediaType } from './useRecording';
import RecordingTimer from './RecordingTimer';

interface MediaPreviewProps {
  mediaType: MediaType;
  isRecording: boolean;
  isPaused?: boolean;
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
  isPaused = false,
  recordedMedia,
  stream
}) => {
  if (mediaType === 'video' && stream && isRecording) {
    return (
      <div className="relative w-full">
        <video 
          autoPlay 
          muted 
          className="w-full h-64 bg-gray-100 rounded-md object-cover mb-4"
        >
          <source src={stream ? '' : undefined} />
        </video>
        <div className="absolute top-4 right-4">
          <div className="bg-red-500 text-white px-2 py-1 rounded-full flex items-center space-x-2">
            {isPaused ? (
              <Pause className="h-4 w-4" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
            )}
            <RecordingTimer isRecording={isRecording && !isPaused} />
          </div>
        </div>
      </div>
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
  
  if (mediaType === 'audio' && (isRecording || isPaused)) {
    return (
      <div className="w-full py-8 px-4 bg-blue-50 rounded-md flex flex-col items-center justify-center mb-4">
        <div className={`relative w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center mb-4 ${isPaused ? '' : 'animate-pulse'}`}>
          {isPaused ? (
            <Pause className="h-8 w-8 text-white" />
          ) : (
            <Mic className="h-8 w-8 text-white" />
          )}
          {!isPaused && (
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
          )}
        </div>
        <div className="text-blue-600 font-medium mb-2">
          {isPaused ? "Gravação pausada" : "Gravando áudio..."}
        </div>
        <RecordingTimer isRecording={isRecording && !isPaused} />
      </div>
    );
  }
  
  if (mediaType === 'audio' && recordedMedia && !isRecording) {
    return (
      <div className="w-full py-6 px-4 bg-gray-50 rounded-md flex flex-col items-center justify-center mb-4">
        <div className="w-full mb-2">
          <audio 
            src={recordedMedia.url} 
            controls 
            className="w-full"
          />
        </div>
        <div className="text-xs text-gray-500">
          {recordedMedia.fileName}
        </div>
      </div>
    );
  }

  if (mediaType === 'photo' && stream) {
    return (
      <div className="relative w-full">
        <video 
          autoPlay 
          muted 
          className="w-full h-64 bg-gray-100 rounded-md object-cover mb-4"
        >
          <source src={stream ? '' : undefined} />
        </video>
      </div>
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
