
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Paperclip } from 'lucide-react';

interface ActionsMenuProps {
  onFileUpload: () => void;
}

const ActionsMenu = ({ onFileUpload }: ActionsMenuProps) => {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onFileUpload}
      title="Anexar arquivo"
      aria-label="Anexar arquivo"
      className="hover:bg-blue-50"
    >
      <Paperclip className="h-4 w-4" />
    </Button>
  );
};

export default ActionsMenu;
