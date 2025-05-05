
import React from 'react';
import { Block } from '@/types/automation';
import { getBlockInfo } from '@/utils/automationUtils';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AutomationBlockConfig } from '../AutomationBlockConfig';

interface BlockConfigDialogProps {
  block: Block;
  showConfig: boolean;
  setShowConfig: (show: boolean) => void;
  blockConfig: Record<string, any>;
  handleUpdateBlockConfig: (newConfig: Record<string, any>) => void;
  handleSaveConfig: () => void;
}

export const BlockConfigDialog: React.FC<BlockConfigDialogProps> = ({
  block,
  showConfig,
  setShowConfig,
  blockConfig,
  handleUpdateBlockConfig,
  handleSaveConfig
}) => {
  const blockInfo = getBlockInfo(block.type);
  
  return (
    <Dialog open={showConfig} onOpenChange={setShowConfig}>
      <DialogContent className="sm:max-w-[500px] bg-surface border-vendah-purple/20 rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            {blockInfo.icon && <span className="mr-2">{blockInfo.icon}</span>}
            Configurar {blockInfo.name}
          </DialogTitle>
        </DialogHeader>
        
        <AutomationBlockConfig 
          blockType={block.type} 
          blockCategory={block.category}
          initialConfig={blockConfig}
          onUpdateConfig={handleUpdateBlockConfig}
        />
        
        <DialogFooter className="border-t border-vendah-purple/20 pt-4 mt-6">
          <Button variant="outline" onClick={() => setShowConfig(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveConfig}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
