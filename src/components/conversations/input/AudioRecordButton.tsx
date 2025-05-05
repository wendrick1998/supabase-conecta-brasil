
import React from 'react';
import { Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AudioRecordButtonProps {
  onClick: () => void;
}

const AudioRecordButton: React.FC<AudioRecordButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      title="Gravar áudio"
      aria-label="Gravar áudio"
      className="hover:bg-blue-50"
    >
      <Mic className="h-4 w-4" />
    </Button>
  );
};

export default AudioRecordButton;
