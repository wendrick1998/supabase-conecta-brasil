
import { Loader2 } from 'lucide-react';

const ConversationLoading = () => {
  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-pink-500" />
      <p className="mt-2 text-gray-500">Carregando conversa...</p>
    </div>
  );
};

export default ConversationLoading;
