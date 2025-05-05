
import { useState, useEffect } from 'react';
import { Nota, Interacao } from '@/types/lead';
import { Message } from '@/types/conversation';
import { getLeadNotes } from '@/services/notaService';
import { getLeadInteractions } from '@/services/interacaoService';
import { getLeadMessages } from '@/services/conversationService';

export type HistoryItem = {
  id: string;
  tipo: 'nota' | 'interacao' | 'mensagem';
  conteudo: string;
  criado_em: string;
  item: Nota | Interacao | Message;
};

export const useLeadHistory = (leadId: string) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [filteredHistory, setFilteredHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<('nota' | 'interacao' | 'mensagem')[]>(['nota', 'interacao', 'mensagem']);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: undefined,
    to: undefined
  });
  
  const fetchHistoryData = async () => {
    setIsLoading(true);
    try {
      const [notes, interactions, messages] = await Promise.all([
        getLeadNotes(leadId),
        getLeadInteractions(leadId),
        getLeadMessages(leadId)
      ]);
      
      const historyItems: HistoryItem[] = [
        ...notes.map(note => ({
          id: note.id,
          tipo: 'nota' as const,
          conteudo: note.conteudo,
          criado_em: note.criado_em,
          item: note
        })),
        ...interactions.map(interaction => ({
          id: interaction.id,
          tipo: 'interacao' as const,
          conteudo: interaction.conteudo,
          criado_em: interaction.criado_em,
          item: interaction
        })),
        ...messages.map(message => ({
          id: message.id,
          tipo: 'mensagem' as const,
          conteudo: message.content,
          criado_em: message.timestamp,
          item: message
        }))
      ].sort((a, b) => new Date(b.criado_em).getTime() - new Date(a.criado_em).getTime());
      
      setHistory(historyItems);
      setFilteredHistory(historyItems);
    } catch (error) {
      console.error('Error fetching lead history:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    if (leadId) {
      fetchHistoryData();
    }
  }, [leadId]);
  
  // Apply filters whenever they change
  useEffect(() => {
    applyFilters();
  }, [selectedTypes, dateRange, history]);
  
  const applyFilters = () => {
    let filtered = [...history];
    
    // Filter by type
    if (selectedTypes.length < 3) {
      filtered = filtered.filter(item => selectedTypes.includes(item.tipo));
    }
    
    // Filter by date range
    if (dateRange.from && dateRange.to) {
      const fromTime = dateRange.from.getTime();
      const toTime = dateRange.to.getTime();
      
      filtered = filtered.filter(item => {
        const itemTime = new Date(item.criado_em).getTime();
        return itemTime >= fromTime && itemTime <= toTime;
      });
    }
    
    setFilteredHistory(filtered);
  };
  
  const handleTypeChange = (type: 'nota' | 'interacao' | 'mensagem') => {
    setSelectedTypes(prev => {
      // If all types are selected and we're removing one
      if (prev.length === 3) {
        return prev.filter(t => t !== type);
      }
      
      // If the type is already selected, remove it
      if (prev.includes(type)) {
        const newTypes = prev.filter(t => t !== type);
        // Don't allow empty selection, add all back
        return newTypes.length === 0 ? ['nota', 'interacao', 'mensagem'] : newTypes;
      }
      
      // Add the type
      return [...prev, type];
    });
  };
  
  const handleDateRangeChange = (range: { from: Date; to: Date } | null) => {
    setDateRange(range || { from: undefined, to: undefined });
  };
  
  const handleClearFilters = () => {
    setSelectedTypes(['nota', 'interacao', 'mensagem']);
    setDateRange({ from: undefined, to: undefined });
  };
  
  const handleItemAdded = () => {
    fetchHistoryData();
  };
  
  return {
    history: filteredHistory,
    isLoading,
    selectedTypes,
    dateRange,
    handleTypeChange,
    handleDateRangeChange,
    handleClearFilters,
    handleItemAdded,
    refreshHistory: fetchHistoryData
  };
};
