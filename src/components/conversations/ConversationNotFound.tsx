
import { useNavigate } from 'react-router-dom';

const ConversationNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white">
      <div className="p-4 border-b flex items-center">
        <button
          className="mr-2 p-2 rounded-md hover:bg-gray-100"
          onClick={() => navigate('/conversations')}
        >
          Voltar
        </button>
        <h1 className="text-xl font-bold">Detalhes da Conversa</h1>
      </div>
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center p-8">
          <h2 className="text-xl font-semibold mb-2">Conversa não encontrada</h2>
          <p className="text-gray-500 mb-4">
            A conversa solicitada não existe ou foi removida.
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={() => navigate('/conversations')}
          >
            Voltar para o Inbox
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationNotFound;
