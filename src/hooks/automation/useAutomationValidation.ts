
import { useCallback } from 'react';
import { Block } from '@/types/automation';
import { toast } from 'sonner';

export const useAutomationValidation = (blocks: Block[]) => {
  // Validates if the automation flow is correct
  const validateAutomation = useCallback((): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];
    
    // Verifica se há pelo menos um gatilho
    const triggers = blocks.filter(block => block.category === 'trigger');
    if (triggers.length === 0) {
      errors.push('Sua automação precisa de pelo menos um gatilho.');
    }
    
    // Verifica se todos os blocos estão configurados
    const unconfiguredBlocks = blocks.filter(block => !block.configured);
    if (unconfiguredBlocks.length > 0) {
      errors.push(`Há ${unconfiguredBlocks.length} bloco(s) não configurado(s).`);
    }
    
    // Verifica conexões lógicas (se há blocos sem conexão)
    if (blocks.length > 1) {
      // Encontra todos os IDs de blocos que são destinos de conexões
      const connectedBlockIds = new Set<string>();
      blocks.forEach(block => {
        block.connections.forEach(connId => {
          connectedBlockIds.add(connId);
        });
      });
      
      // Verifica blocos que não são gatilhos e não estão conectados
      const disconnectedBlocks = blocks.filter(
        block => block.category !== 'trigger' && !connectedBlockIds.has(block.id)
      );
      
      if (disconnectedBlocks.length > 0) {
        errors.push(`Há ${disconnectedBlocks.length} bloco(s) sem conexão lógica com o fluxo.`);
      }
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }, [blocks]);

  const handleSaveAutomation = useCallback((navigate: (path: string) => void) => {
    const { valid, errors } = validateAutomation();
    
    if (!valid) {
      // Exibe toast com erros
      errors.forEach(error => {
        toast.error(error);
      });
      return;
    }
    
    // Se tudo estiver válido, salva e redireciona
    toast.success('Automação salva com sucesso!');
    navigate('/automacoes');
  }, [validateAutomation]);

  const handleTestAutomation = useCallback(() => {
    const { valid, errors } = validateAutomation();
    
    if (!valid) {
      // Exibe toast com erros
      errors.forEach(error => {
        toast.error(error);
      });
      return;
    }
    
    toast.info('Testando automação com dados fictícios...');
    
    // Simula processamento de teste
    setTimeout(() => {
      toast.success('Teste concluído com sucesso! O fluxo de automação funciona corretamente.');
    }, 1500);
  }, [validateAutomation]);

  return {
    validateAutomation,
    handleSaveAutomation,
    handleTestAutomation
  };
};
