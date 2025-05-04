
import React from 'react';
import { Mic, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaType } from './recording/useRecording';

interface MultimediaButtonsProps {
  onOpenRecordingModal: (mediaType: MediaType) => void;
}

const MultimediaButtons: React.FC<MultimediaButtonsProps> = ({ onOpenRecordingModal }) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm text-blue-700 font-medium">Anexos Multimídia</h3>
      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => onOpenRecordingModal('audio')}
          aria-label="Gravar áudio"
        >
          <Mic className="h-5 w-5" />
          <span>Gravar Áudio</span>
        </Button>
        
        <Button
          type="button"
          variant="outline"
          className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => onOpenRecordingModal('video')}
          aria-label="Gravar vídeo"
        >
          <Camera className="h-5 w-5" />
          <span>Gravar Vídeo</span>
        </Button>
      </div>
    </div>
  );
};

export default MultimediaButtons;
