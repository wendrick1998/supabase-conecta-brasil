
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TimelineItem from '@/components/TimelineItem';
import AddTimelineItemForms from './AddTimelineItemForms';
import HistoryFilters from './HistoryFilters';
import { useLeadHistory } from '@/hooks/useLeadHistory';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface LeadTimelineProps {
  leadId: string;
}

const LeadTimeline: React.FC<LeadTimelineProps> = ({ leadId }) => {
  const {
    history,
    isLoading,
    selectedTypes,
    dateRange,
    handleTypeChange,
    handleDateRangeChange,
    handleClearFilters,
    handleItemAdded,
    refreshHistory
  } = useLeadHistory(leadId);

  // Helper function to adapt Message to interface expected by TimelineItem
  const adaptMessageToTimelineItem = (item: any) => {
    // Create an adapter object that matches the expected interface
    if (item.tipo === 'mensagem') {
      return {
        id: item.id,
        tipo: 'interacao', // Treat messages as interactions
        conteudo: item.conteudo,
        criado_em: item.criado_em,
      };
    }
    return item.item;
  };

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Histórico</h2>
        <div className="flex items-center gap-2">
          <HistoryFilters 
            selectedTypes={selectedTypes}
            onTypeChange={handleTypeChange}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onClearFilters={handleClearFilters}
          />
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8" 
            onClick={refreshHistory}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>
      
      <AddTimelineItemForms leadId={leadId} onSuccess={handleItemAdded} />
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
          <TabsTrigger value="interactions">Interações</TabsTrigger>
          <TabsTrigger value="messages">Mensagens</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <p className="text-muted-foreground">Carregando histórico...</p>
          ) : history.length === 0 ? (
            <p className="text-muted-foreground">Nenhum registro encontrado.</p>
          ) : (
            <div>
              {history.map((item, index) => (
                <TimelineItem 
                  key={`${item.tipo}-${item.id}-${index}`} 
                  item={adaptMessageToTimelineItem(item)} 
                  type={item.tipo === 'mensagem' ? 'interacao' : item.tipo} 
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes">
          {isLoading ? (
            <p className="text-muted-foreground">Carregando notas...</p>
          ) : history.filter(item => item.tipo === 'nota').length === 0 ? (
            <p className="text-muted-foreground">Nenhuma nota encontrada.</p>
          ) : (
            <div>
              {history
                .filter(item => item.tipo === 'nota')
                .map((item, index) => (
                  <TimelineItem 
                    key={`note-${item.id}-${index}`} 
                    item={adaptMessageToTimelineItem(item)} 
                    type="nota" 
                  />
                ))
              }
            </div>
          )}
        </TabsContent>

        <TabsContent value="interactions">
          {isLoading ? (
            <p className="text-muted-foreground">Carregando interações...</p>
          ) : history.filter(item => item.tipo === 'interacao').length === 0 ? (
            <p className="text-muted-foreground">Nenhuma interação encontrada.</p>
          ) : (
            <div>
              {history
                .filter(item => item.tipo === 'interacao')
                .map((item, index) => (
                  <TimelineItem 
                    key={`interaction-${item.id}-${index}`} 
                    item={adaptMessageToTimelineItem(item)} 
                    type="interacao" 
                  />
                ))
              }
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="messages">
          {isLoading ? (
            <p className="text-muted-foreground">Carregando mensagens...</p>
          ) : history.filter(item => item.tipo === 'mensagem').length === 0 ? (
            <p className="text-muted-foreground">Nenhuma mensagem encontrada.</p>
          ) : (
            <div>
              {history
                .filter(item => item.tipo === 'mensagem')
                .map((item, index) => (
                  <TimelineItem 
                    key={`message-${item.id}-${index}`} 
                    item={adaptMessageToTimelineItem(item)} 
                    type="interacao" 
                  />
                ))
              }
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadTimeline;
