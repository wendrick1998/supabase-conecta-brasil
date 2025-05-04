
import React from 'react';
import { Block } from '@/types/automation';
import { PreviewDialog } from '@/components/automations/PreviewDialog';
import { TemplatesDialog } from '@/components/automations/TemplatesDialog';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AutomationDialogsProps {
  showTemplates: boolean;
  setShowTemplates: (show: boolean) => void;
  showPreview: boolean;
  setShowPreview: (show: boolean) => void;
  blocks: Block[];
  handleApplyTemplate: (templateBlocks: Block[]) => void;
}

export const AutomationDialogs: React.FC<AutomationDialogsProps> = ({
  showTemplates,
  setShowTemplates,
  showPreview,
  setShowPreview,
  blocks,
  handleApplyTemplate
}) => {
  // Verifica se há blocos suficientes para exibir uma prévia
  const hasEnoughBlocks = blocks.length > 1;
  
  return (
    <>
      {/* Template dialog */}
      <TemplatesDialog 
        open={showTemplates} 
        onOpenChange={setShowTemplates} 
        onApplyTemplate={handleApplyTemplate}
      />
      
      {/* Preview dialog */}
      <PreviewDialog 
        open={showPreview} 
        onOpenChange={setShowPreview} 
        blocks={blocks} 
      >
        {!hasEnoughBlocks && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              Você precisa adicionar pelo menos dois blocos conectados para visualizar a prévia da automação.
            </AlertDescription>
          </Alert>
        )}
      </PreviewDialog>
    </>
  );
};
