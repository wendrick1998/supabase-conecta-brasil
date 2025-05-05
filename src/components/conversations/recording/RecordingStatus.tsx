
import React from 'react';
import { Mic } from 'lucide-react';
import AudioWaveform from './AudioWaveform';
import { RecordedAudio } from '@/hooks/useAudioRecording';

interface RecordingStatusProps {
  isRecording: boolean;
  isPaused: boolean;
  recordedAudio: RecordedAudio | null;
  formattedTime: string;
  audioLevel: number[];
}

const RecordingStatus: React.FC<RecordingStatusProps> = ({ 
  isRecording, 
  isPaused, 
  recordedAudio,
  formattedTime,
  audioLevel
}) => {
  return (
    <div className={`relative w-full flex flex-col items-center justify-center mb-6 
      ${isRecording && !isPaused ? 'animate-pulse' : ''}`}>
      
      {/* Recording microphone icon with animation */}
      <div className={`mb-4 flex items-center justify-center w-20 h-20 rounded-full 
        ${isRecording && !isPaused ? 'bg-red-500' : isPaused ? 'bg-amber-500' : recordedAudio ? 'bg-green-500' : 'bg-blue-500'}`}>
        <Mic className="h-10 w-10 text-white" />
        {isRecording && !isPaused && (
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-red-500 animate-ping"></div>
        )}
      </div>
      
      {/* Timer display */}
      <div className="text-2xl font-mono font-bold mb-2">
        {formattedTime}
      </div>
      
      {/* Waveform visualization */}
      <AudioWaveform 
        audioLevel={audioLevel}
        isRecording={isRecording}
        isPaused={isPaused}
        className="my-2"
      />
      
      {/* Status text */}
      <div className="text-sm text-gray-500 mt-1">
        {isRecording && !isPaused ? "Gravando..." : isPaused ? "Gravação pausada" : 
          recordedAudio ? "Gravação concluída" : "Pronto para gravar"}
      </div>
    </div>
  );
};

export default RecordingStatus;
