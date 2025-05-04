
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const NewConversation = () => {
  const navigate = useNavigate();
  const [canal, setCanal] = useState('');
  const [contato, setContato] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Placeholder for submission
    alert(`Nova conversa para ser implementada: Canal ${canal}, Contato: ${contato}`);
    navigate('/conversations');
  };

  return (
    <div className="flex flex-col h-full max-w-3xl mx-auto bg-white">
      <div className="p-4 border-b flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/conversations')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Nova Mensagem</h1>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4 space-y-4">
        <div>
          <label htmlFor="canal" className="block text-sm font-medium mb-1">
            Canal
          </label>
          <Select value={canal} onValueChange={setCanal} required>
            <SelectTrigger id="canal">
              <SelectValue placeholder="Selecione o canal" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="WhatsApp">WhatsApp</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="Email">Email</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="contato" className="block text-sm font-medium mb-1">
            Contato
          </label>
          <Input
            id="contato"
            placeholder="Número, username ou email"
            value={contato}
            onChange={(e) => setContato(e.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="mensagem" className="block text-sm font-medium mb-1">
            Mensagem
          </label>
          <Textarea
            id="mensagem"
            placeholder="Digite sua mensagem..."
            value={mensagem}
            onChange={(e) => setMensagem(e.target.value)}
            rows={5}
            required
          />
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            className="w-full bg-pink-500 hover:bg-pink-600"
          >
            Enviar Mensagem
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewConversation;
