
import { useState, useCallback } from 'react';
import { Block } from '@/types/automation';
import { toast } from 'sonner';

export const useTemplateManagement = (setBlocks: React.Dispatch<React.SetStateAction<Block[]>>) => {
  const [showTemplates, setShowTemplates] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleApplyTemplate = useCallback((templateBlocks: Block[]) => {
    setBlocks(templateBlocks);
    setShowTemplates(false);
    toast.success('Template aplicado com sucesso!');
  }, [setBlocks]);

  return {
    showTemplates,
    setShowTemplates,
    showPreview,
    setShowPreview,
    handleApplyTemplate
  };
};
