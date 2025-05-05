import React from 'react';
import { Mic, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MediaType } from './recording/types';
interface MultimediaButtonsProps {
  onOpenRecordingModal: (mediaType: MediaType) => void;
}
const MultimediaButtons: React.FC<MultimediaButtonsProps> = ({
  onOpenRecordingModal
}) => {
  return <div className="space-y-3">
      <h3 className="text-sm font-medium text-green-500">Anexos Multimídia</h3>
      <div className="flex flex-wrap gap-3">
        <Button type="button" variant="outline" onClick={() => onOpenRecordingModal('audio')} aria-label="Gravar áudio" className="flex items-center gap-2 bg-lime-500 hover:bg-lime-400 text-zinc-950">
          <Mic className="h-5 w-5" />
          <span>Gravar Áudio</span>
        </Button>
        
        <Button type="button" variant="outline" onClick={() => onOpenRecordingModal('video')} aria-label="Gravar vídeo" className="flex items-center gap-2 bg-lime-500 hover:bg-lime-400 text-zinc-950">
          <Camera className="h-5 w-5" />
          <span>Gravar Vídeo</span>
        </Button>
      </div>
    </div>;
};
export default MultimediaButtons;