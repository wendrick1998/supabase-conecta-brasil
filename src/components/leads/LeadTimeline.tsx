
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getLeadNotes } from '@/services/notaService';
import { getLeadInteractions } from '@/services/interacaoService';
import TimelineItem from '@/components/TimelineItem';
import { Nota, Interacao } from '@/types/lead';
import AddTimelineItemForms from './AddTimelineItemForms';

interface LeadTimelineProps {
  leadId: string;
}

const LeadTimeline: React.FC<LeadTimelineProps> = ({ leadId }) => {
  const [notes, setNotes] = useState<Nota[]>([]);
  const [interactions, setInteractions] = useState<Interacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTimelineData = async () => {
    setIsLoading(true);
    const [notesData, interactionsData] = await Promise.all([
      getLeadNotes(leadId),
      getLeadInteractions(leadId)
    ]);
    setNotes(notesData);
    setInteractions(interactionsData);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTimelineData();
  }, [leadId]);

  const handleItemAdded = () => {
    fetchTimelineData();
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Histórico</h2>
      
      <AddTimelineItemForms leadId={leadId} onSuccess={handleItemAdded} />
      
      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="notes">Notas</TabsTrigger>
          <TabsTrigger value="interactions">Interações</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {isLoading ? (
            <p className="text-muted-foreground">Carregando histórico...</p>
          ) : notes.length === 0 && interactions.length === 0 ? (
            <p className="text-muted-foreground">Nenhum registro encontrado.</p>
          ) : (
            <div>
              {[...notes.map(note => ({ item: note, type: 'nota' as const })), 
                ...interactions.map(interaction => ({ item: interaction, type: 'interacao' as const }))]
                .sort((a, b) => new Date(b.item.criado_em).getTime() - new Date(a.item.criado_em).getTime())
                .map((item, index) => (
                  <TimelineItem key={`${item.type}-${item.item.id}-${index}`} item={item.item} type={item.type} />
                ))
              }
            </div>
          )}
        </TabsContent>

        <TabsContent value="notes">
          {isLoading ? (
            <p className="text-muted-foreground">Carregando notas...</p>
          ) : notes.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma nota encontrada.</p>
          ) : (
            <div>
              {notes.map((note, index) => (
                <TimelineItem key={`note-${note.id}-${index}`} item={note} type="nota" />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="interactions">
          {isLoading ? (
            <p className="text-muted-foreground">Carregando interações...</p>
          ) : interactions.length === 0 ? (
            <p className="text-muted-foreground">Nenhuma interação encontrada.</p>
          ) : (
            <div>
              {interactions.map((interaction, index) => (
                <TimelineItem key={`interaction-${interaction.id}-${index}`} item={interaction} type="interacao" />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LeadTimeline;
