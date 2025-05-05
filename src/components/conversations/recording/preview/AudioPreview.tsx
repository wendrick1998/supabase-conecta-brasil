
import React from 'react';
import { Mic, Pause } from "lucide-react";
import { RecordedMedia } from '../types';
import RecordingTimer from '../RecordingTimer';

interface AudioPreviewProps {
  isRecording: boolean;
  isPaused: boolean;
  recordedMedia: RecordedMedia | null;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({
  isRecording,
  isPaused,
  recordedMedia
}) => {
  // Audio recording in progress
  if (isRecording || isPaused) {
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
  
  // Recorded audio preview
  if (recordedMedia && !isRecording) {
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
  
  return null;
};

export default AudioPreview;
