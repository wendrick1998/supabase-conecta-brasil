import React from 'react';
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MediaType } from './types';

interface RecordingHeaderProps {
  mediaType: MediaType;
  isRecording: boolean;
  isPaused: boolean;
  hasRecordedMedia: boolean;
}

const RecordingHeader: React.FC<RecordingHeaderProps> = ({
  mediaType,
  isRecording,
  isPaused,
  hasRecordedMedia
}) => {
  const getDialogTitle = () => {
    const mediaTypeText = 
      mediaType === 'audio' ? 'áudio' : 
      mediaType === 'video' ? 'vídeo' : 'foto';
    
    if (isRecording && !isPaused) {
      return `Gravando ${mediaTypeText}...`;
    } else if (isPaused) {
      return `Gravação de ${mediaTypeText} pausada`;
    } else if (hasRecordedMedia) {
      return `Revisar ${mediaTypeText}`;
    } else {
      return `Gravar ${mediaTypeText}`;
    }
  };

  return (
    <DialogHeader>
      <DialogTitle>{getDialogTitle()}</DialogTitle>
    </DialogHeader>
  );
};

export default RecordingHeader;
