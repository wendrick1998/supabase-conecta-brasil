
import { useCallback, useState } from 'react';
import { Block } from '@/types/automation';
import { toast } from 'sonner';
import { getBlockInfo } from '@/utils/automationUtils';

export const useAutomationValidation = (blocks: Block[]) => {
  const [testResults, setTestResults] = useState<{
    blockId: string;
    status: 'success' | 'error' | 'pending';
    message: string;
  }[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testSummary, setTestSummary] = useState<{
    success: boolean;
    message: string;
    details: string[];
  } | null>(null);

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

  // Simular a execução de um bloco
  const simulateBlockExecution = async (block: Block) => {
    // Adicionar o bloco aos resultados com status pendente
    setTestResults(prev => [
      ...prev, 
      { 
        blockId: block.id, 
        status: 'pending', 
        message: 'Executando...'
      }
    ]);

    // Simular um delay para a execução do bloco
    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 1200));

    // Verificar se o bloco está configurado
    if (!block.configured) {
      setTestResults(prev => prev.map(result => 
        result.blockId === block.id 
          ? { ...result, status: 'error', message: 'Bloco não configurado' }
          : result
      ));
      return false;
    }

    // Simular resultados baseados nos diferentes tipos de blocos
    let success = Math.random() > 0.1; // 90% de chance de sucesso
    let message = '';
    
    switch(block.type) {
      case 'new_lead':
        message = success 
          ? 'Lead fictício "João Silva" criado com sucesso' 
          : 'Erro ao criar lead fictício';
        break;
      case 'lead_moved':
        message = success 
          ? 'Lead movido de "Qualificação" para "Negociação"' 
          : 'Erro ao mover lead';
        break;
      case 'message_received':
        message = success 
          ? 'Mensagem "Olá, preciso de ajuda" recebida' 
          : 'Erro ao simular recebimento de mensagem';
        break;
      case 'lead_status':
        success = block.config?.value ? true : false;
        message = success 
          ? `Condição de status "${block.config?.value}" verificada com sucesso` 
          : 'Condição de status não atendida';
        break;
      case 'lead_source':
        success = block.config?.source ? true : false;
        message = success 
          ? `Canal de origem "${block.config?.source}" confirmado` 
          : 'Condição de origem não atendida';
        break;
      case 'value_greater':
        success = block.config?.amount ? true : false;
        message = success 
          ? `Valor maior que ${block.config?.amount} confirmado` 
          : 'Condição de valor não atendida';
        break;
      case 'send_message':
        message = success 
          ? `Mensagem "${block.config?.message?.substring(0, 25)}${block.config?.message?.length > 25 ? '...' : ''}" enviada com sucesso` 
          : 'Erro ao enviar mensagem';
        break;
      case 'create_task':
        message = success 
          ? `Tarefa "${block.config?.title || 'Sem título'}" criada com sucesso` 
          : 'Erro ao criar tarefa';
        break;
      case 'move_pipeline':
        message = success 
          ? `Lead movido para estágio "${block.config?.stage || 'próximo'}" com sucesso` 
          : 'Erro ao mover lead no pipeline';
        break;
      default:
        message = success ? 'Bloco executado com sucesso' : 'Erro na execução do bloco';
    }
    
    // Atualizar o resultado do teste para este bloco
    setTestResults(prev => prev.map(result => 
      result.blockId === block.id 
        ? { ...result, status: success ? 'success' : 'error', message }
        : result
    ));
    
    return success;
  };

  // Função recursiva para simular a execução do fluxo
  const simulateFlow = async (startBlockId: string, visitedBlocks = new Set<string>()) => {
    // Evitar loops infinitos
    if (visitedBlocks.has(startBlockId)) {
      return;
    }
    visitedBlocks.add(startBlockId);
    
    // Encontrar o bloco inicial
    const currentBlock = blocks.find(b => b.id === startBlockId);
    if (!currentBlock) return;
    
    // Executar o bloco atual
    const success = await simulateBlockExecution(currentBlock);
    
    // Se for condição e falhar, não continuar
    if (currentBlock.category === 'condition' && !success) {
      return;
    }
    
    // Continuar para os próximos blocos
    for (const nextBlockId of currentBlock.connections) {
      await simulateFlow(nextBlockId, visitedBlocks);
    }
  };

  const handleTestAutomation = useCallback(async () => {
    const { valid, errors } = validateAutomation();
    
    if (!valid) {
      // Exibe toast com erros
      errors.forEach(error => {
        toast.error(error);
      });
      return;
    }
    
    setIsTestRunning(true);
    setTestResults([]);
    setTestSummary(null);
    
    toast.info('Iniciando teste da automação com dados fictícios...');
    
    // Encontrar todos os blocos de gatilho
    const triggerBlocks = blocks.filter(b => b.category === 'trigger');
    
    if (triggerBlocks.length === 0) {
      toast.error('Automação precisa ter pelo menos um gatilho para teste');
      setIsTestRunning(false);
      return;
    }
    
    try {
      // Executar o fluxo para cada bloco de gatilho
      for (const trigger of triggerBlocks) {
        await simulateBlockExecution(trigger);
        
        // Continuar para os próximos blocos
        for (const nextBlockId of trigger.connections) {
          await simulateFlow(nextBlockId, new Set([trigger.id]));
        }
      }
      
      // Calcular estatísticas
      const totalBlocks = testResults.length;
      const successBlocks = testResults.filter(r => r.status === 'success').length;
      const errorBlocks = testResults.filter(r => r.status === 'error').length;
      
      // Gerar resumo do teste
      setTestSummary({
        success: errorBlocks === 0,
        message: errorBlocks === 0 
          ? `Teste concluído com sucesso! Todos os ${totalBlocks} blocos executados corretamente.`
          : `Teste concluído com ${errorBlocks} erro(s) em ${totalBlocks} blocos.`,
        details: [
          `Blocos testados: ${totalBlocks}`,
          `Sucessos: ${successBlocks}`,
          `Erros: ${errorBlocks}`
        ]
      });
      
      toast.success('Teste concluído!');
    } catch (error) {
      console.error('Erro durante o teste:', error);
      toast.error('Ocorreu um erro durante o teste da automação');
    } finally {
      setIsTestRunning(false);
    }
  }, [validateAutomation, blocks]);

  return {
    validateAutomation,
    handleSaveAutomation,
    handleTestAutomation,
    testResults,
    isTestRunning,
    testSummary,
    resetTest: () => {
      setTestResults([]);
      setTestSummary(null);
    }
  };
};
