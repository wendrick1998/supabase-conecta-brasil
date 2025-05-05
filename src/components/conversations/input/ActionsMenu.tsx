
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ActionsMenuProps {
  onFileUpload: () => void;
}

const ActionsMenu = ({ onFileUpload }: ActionsMenuProps) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            onClick={onFileUpload}
            aria-label="Anexar documento"
            className="hover:bg-blue-50"
          >
            <FileText className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Anexar documento (PDF, DOC, XLS, etc)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionsMenu;
