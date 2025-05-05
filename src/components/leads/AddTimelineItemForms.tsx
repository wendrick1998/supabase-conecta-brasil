
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import AddNoteForm from './AddNoteForm';
import AddInteractionForm from './AddInteractionForm';
import { MessageCircle, FileText } from 'lucide-react';

interface AddTimelineItemFormsProps {
  leadId: string;
  onSuccess: () => void;
}

const AddTimelineItemForms: React.FC<AddTimelineItemFormsProps> = ({ leadId, onSuccess }) => {
  return (
    <div className="mt-6 mb-8">
      <Tabs defaultValue="note">
        <TabsList className="grid w-full grid-cols-2 bg-surface/50 p-1">
          <TabsTrigger value="note" className="flex items-center data-[state=active]:bg-vendah-purple/20 data-[state=active]:text-white">
            <FileText className="mr-2 h-4 w-4" />
            Adicionar Nota
          </TabsTrigger>
          <TabsTrigger value="interaction" className="flex items-center data-[state=active]:bg-vendah-purple/20 data-[state=active]:text-white">
            <MessageCircle className="mr-2 h-4 w-4" />
            Registrar Interação
          </TabsTrigger>
        </TabsList>
        <Card className="mt-2 p-4 border-vendah-purple/20">
          <TabsContent value="note">
            <AddNoteForm leadId={leadId} onSuccess={onSuccess} />
          </TabsContent>
          <TabsContent value="interaction">
            <AddInteractionForm leadId={leadId} onSuccess={onSuccess} />
          </TabsContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default AddTimelineItemForms;
