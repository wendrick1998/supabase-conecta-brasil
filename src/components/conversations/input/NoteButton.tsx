
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface NoteButtonProps {
  onAddNote: () => void;
  disabled: boolean;
}

const NoteButton = ({ onAddNote, disabled }: NoteButtonProps) => {
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onAddNote}
      className="flex items-center"
      disabled={disabled}
    >
      <FileText className="h-4 w-4 mr-2" />
      <span>Nota interna</span>
    </Button>
  );
};

export default NoteButton;
