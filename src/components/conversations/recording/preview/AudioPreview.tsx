
import React, { useState, useRef, useEffect } from 'react';
import { Mic, Pause, Send, Trash2, Play } from "lucide-react";
import { RecordedMedia } from '../types';
import RecordingTimer from '../RecordingTimer';
import { Button } from '@/components/ui/button';

interface AudioPreviewProps {
  isRecording: boolean;
  isPaused: boolean;
  recordingTime?: number;
  recordedMedia: RecordedMedia | null;
  onSaveRecording?: () => void;
  onReset?: () => void;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({
  isRecording,
  isPaused,
  recordingTime = 0,
  recordedMedia,
  onSaveRecording,
  onReset
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Handle play state
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [recordedMedia]);

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
        <RecordingTimer 
          isRecording={isRecording && !isPaused} 
          initialTimeMs={recordingTime}
        />
      </div>
    );
  }
  
  // Recorded audio preview
  if (recordedMedia && !isRecording) {
    const formattedDuration = () => {
      const seconds = Math.floor(recordingTime / 1000);
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
      <div className="w-full py-6 px-4 bg-gray-50 rounded-md flex flex-col items-center justify-center mb-4">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          Ouça a gravação antes de enviar
        </h3>
        
        <div className="w-full mb-4">
          <audio 
            ref={audioRef}
            src={recordedMedia.url} 
            controls 
            className="w-full"
            preload="metadata"
          />
        </div>
        
        <div className="text-xs text-gray-500 mb-4 flex items-center justify-center gap-2">
          <span>{recordedMedia.fileName}</span>
          <span>|</span>
          <span>Duração: {formattedDuration()}</span>
        </div>
        
        <div className="flex justify-center space-x-3">
          {onReset && (
            <Button
              variant="outline"
              onClick={onReset}
              className="border-gray-300"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Descartar
            </Button>
          )}
          
          {onSaveRecording && (
            <Button
              onClick={onSaveRecording}
              className="bg-pink-600 hover:bg-pink-700"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  return null;
};

export default AudioPreview;
