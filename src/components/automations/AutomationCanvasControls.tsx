import React from 'react';
import { FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
interface AutomationCanvasControlsProps {
  onShowPreview: () => void;
}
export const AutomationCanvasControls: React.FC<AutomationCanvasControlsProps> = ({
  onShowPreview
}) => {
  return <div className="absolute bottom-4 right-4 flex gap-2">
      <Button onClick={onShowPreview} variant="secondary" size="sm" className="shadow-md bg-gray-700 hover:bg-gray-600">
        <FileCode className="mr-2 h-4 w-4" />
        Ver como Fluxo
      </Button>
    </div>;
};