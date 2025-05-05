
import React from 'react';
import { DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface RecordingFooterProps {
  isRecording: boolean;
  hasRecordedMedia: boolean;
  onClose: () => void;
}

const RecordingFooter: React.FC<RecordingFooterProps> = ({ 
  isRecording, 
  hasRecordedMedia, 
  onClose 
}) => {
  return (
    <DialogFooter className="sm:justify-start">
      {!isRecording && !hasRecordedMedia && (
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
        >
          Cancelar
        </Button>
      )}
    </DialogFooter>
  );
};

export default RecordingFooter;
