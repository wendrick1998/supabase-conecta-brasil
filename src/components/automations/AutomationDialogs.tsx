
import React from 'react';
import { Block } from '@/types/automation';
import { PreviewDialog } from '@/components/automations/PreviewDialog';
import { TemplatesDialog } from '@/components/automations/TemplatesDialog';

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
      />
    </>
  );
};
