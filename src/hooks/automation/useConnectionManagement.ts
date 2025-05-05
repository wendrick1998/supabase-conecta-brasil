
import { useCallback } from 'react';
import { Block, BlockCategory } from '@/types/automation';
import { toast } from 'sonner';

export const useConnectionManagement = (blocks: Block[], setBlocks: React.Dispatch<React.SetStateAction<Block[]>>) => {
  // Helper to validate connection based on block categories
  const isConnectionValid = (sourceCat: BlockCategory, targetCat: BlockCategory): boolean => {
    // Trigger -> Condition or Action
    if (sourceCat === 'trigger') {
      return targetCat === 'condition' || targetCat === 'action';
    }
    // Condition -> Condition or Action
    else if (sourceCat === 'condition') {
      return targetCat === 'condition' || targetCat === 'action';
    }
    // Action -> Action
    else if (sourceCat === 'action') {
      return targetCat === 'action';
    }
    return false;
  };

  const handleCreateConnection = useCallback((fromBlockId: string, toBlockId: string) => {
    // Verifica se a conexão já existe
    const blockFrom = blocks.find(b => b.id === fromBlockId);
    if (blockFrom && blockFrom.connections.includes(toBlockId)) {
      toast.info('Esta conexão já existe.');
      return;
    }
    
    // Verifica se a conexão é válida (não permitir ciclos, etc)
    const fromBlock = blocks.find(b => b.id === fromBlockId);
    const toBlock = blocks.find(b => b.id === toBlockId);
    
    if (!fromBlock || !toBlock) {
      toast.error('Blocos não encontrados.');
      return;
    }
    
    // Verifica se a conexão é lógica baseada nas categorias dos blocos
    if (!isConnectionValid(fromBlock.category, toBlock.category)) {
      toast.error('Esta conexão não é válida entre estes tipos de blocos.');
      return;
    }
    
    // Adiciona a conexão
    setBlocks(currentBlocks => 
      currentBlocks.map(block => {
        if (block.id === fromBlockId) {
          return {
            ...block,
            connections: [...block.connections, toBlockId]
          };
        }
        return block;
      })
    );
    
    toast.success('Blocos conectados com sucesso!');
  }, [blocks, setBlocks]);

  return {
    handleCreateConnection,
    isConnectionValid
  };
};
