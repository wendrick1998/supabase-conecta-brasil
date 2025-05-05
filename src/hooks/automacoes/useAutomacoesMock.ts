
import { useState } from 'react';

// Interface for automations
export interface Automacao {
  id: string;
  nome: string;
  ativa: boolean;
  ultimaExecucao: string | null;
  erros: number;
  gatilho: string;
  acao: string;
}

// Mock data for automations
const automacoesMock: Automacao[] = [
  { 
    id: '1', 
    nome: 'Enviar boas-vindas ao novo lead', 
    ativa: true, 
    ultimaExecucao: '2025-05-03T14:32:00', 
    erros: 0,
    gatilho: 'Novo lead',
    acao: 'Enviar mensagem'
  },
  { 
    id: '2', 
    nome: 'Notificar equipe sobre lead qualificado', 
    ativa: false, 
    ultimaExecucao: '2025-05-01T09:15:00', 
    erros: 2,
    gatilho: 'Lead movido no pipeline',
    acao: 'Notificar equipe'
  },
  { 
    id: '3', 
    nome: 'Criar tarefa para follow-up', 
    ativa: true, 
    ultimaExecucao: '2025-05-02T16:45:00', 
    erros: 0,
    gatilho: 'Lead sem interação',
    acao: 'Criar tarefa'
  },
  { 
    id: '4', 
    nome: 'Atualizar tag após resposta', 
    ativa: true, 
    ultimaExecucao: null, 
    erros: 0,
    gatilho: 'Resposta recebida',
    acao: 'Atualizar tags'
  }
];

export const useAutomacoesMock = () => {
  const [automacoes, setAutomacoes] = useState<Automacao[]>(automacoesMock);

  const handleToggleStatus = (id: string) => {
    setAutomacoes(automacoes.map(automacao => {
      if (automacao.id === id) {
        return { ...automacao, ativa: !automacao.ativa };
      }
      return automacao;
    }));
  };

  const formatarData = (dataString: string | null) => {
    if (!dataString) return 'Nunca executada';
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return {
    automacoes,
    setAutomacoes,
    handleToggleStatus,
    formatarData,
  };
};
