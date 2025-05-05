
import React from 'react';
import { Pause } from "lucide-react";
import { RecordedMedia } from '../types';
import RecordingTimer from '../RecordingTimer';

interface VideoPreviewProps {
  isRecording: boolean;
  isPaused?: boolean;
  recordedMedia: RecordedMedia | null;
  stream: MediaStream | null;
}

const VideoPreview: React.FC<VideoPreviewProps> = ({
  isRecording,
  isPaused = false,
  recordedMedia,
  stream
}) => {
  // Live recording preview
  if (stream && isRecording) {
    return (
      <div className="relative w-full">
        <video 
          autoPlay 
          muted 
          className="w-full h-64 bg-gray-100 rounded-md object-cover mb-4"
          ref={(videoElement) => {
            if (videoElement && stream) {
              videoElement.srcObject = stream;
            }
          }}
        />
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
  
  // Recorded video preview
  if (recordedMedia && !isRecording) {
    return (
      <video 
        src={recordedMedia.url} 
        controls 
        className="w-full h-64 bg-gray-100 rounded-md object-cover mb-4"
      />
    );
  }
  
  return null;
};

export default VideoPreview;
