
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';

interface NoteFormProps {
  onSave: (noteContent: string) => void;
  onCancel: () => void;
}

const NoteForm = ({ onSave, onCancel }: NoteFormProps) => {
  const [noteContent, setNoteContent] = useState('');

  const handleSave = () => {
    if (noteContent.trim()) {
      onSave(noteContent);
      setNoteContent('');
    }
  };

  return (
    <div className="p-4 bg-yellow-50 border-t border-yellow-200">
      <div className="flex items-center mb-2">
        <FileText className="h-4 w-4 text-yellow-600 mr-2" />
        <h3 className="text-sm font-medium">Adicionar nota interna</h3>
      </div>
      
      <Textarea
        placeholder="Digite uma nota interna (visível apenas para a equipe)..."
        value={noteContent}
        onChange={(e) => setNoteContent(e.target.value)}
        className="min-h-[80px] mb-2 bg-white"
      />
      
      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          size="sm"
          onClick={handleSave}
        >
          Salvar nota
        </Button>
      </div>
    </div>
  );
};

export default NoteForm;
