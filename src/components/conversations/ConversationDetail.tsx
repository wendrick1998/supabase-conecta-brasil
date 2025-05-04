
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ConversationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white">
      <div className="p-4 border-b flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/conversations')}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Detalhes da Conversa</h1>
      </div>
      
      <div className="p-4 flex-1">
        <p>Visualizando conversa com ID: {id}</p>
        <p className="text-gray-500 mt-4">
          Esta é uma página placeholder. Aqui serão exibidos os detalhes da conversa e o
          histórico de mensagens.
        </p>
      </div>
    </div>
  );
};

export default ConversationDetail;
