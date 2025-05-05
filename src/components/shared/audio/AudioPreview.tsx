
import React from 'react';
import { Button } from '@/components/ui/button';
import { X, CheckCircle } from 'lucide-react';

interface AudioPreviewProps {
  audioUrl: string;
  onDiscard: () => void;
  onSend: () => void;
}

const AudioPreview: React.FC<AudioPreviewProps> = ({
  audioUrl,
  onDiscard,
  onSend
}) => {
  return (
    <div className="flex flex-col items-center">
      <audio 
        src={audioUrl} 
        controls 
        className="w-full max-w-xs mb-2"
      />
      <div className="flex space-x-2">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onDiscard}
          className="text-red-500"
        >
          <X className="h-4 w-4 mr-1" />
          Descartar
        </Button>
        <Button 
          variant="default" 
          size="sm"
          onClick={onSend}
          className="bg-green-600 hover:bg-green-700"
        >
          <CheckCircle className="h-4 w-4 mr-1" />
          Enviar
        </Button>
      </div>
    </div>
  );
};

export default AudioPreview;
