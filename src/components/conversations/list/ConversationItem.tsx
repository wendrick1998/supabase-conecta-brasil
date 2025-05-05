
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Conversation } from '@/types/conversation';
import { formatMessageTime, getInitials } from '@/utils/conversationUtils';

// Channel color mapping
const channelColors: Record<Conversation['canal'], string> = {
  'WhatsApp': 'bg-green-500',
  'Instagram': 'bg-purple-500',
  'Facebook': 'bg-blue-500',
  'Email': 'bg-blue-500',
};

interface ConversationItemProps {
  conversation: Conversation;
  onClick: () => void;
}

const ConversationItem = ({ conversation, onClick }: ConversationItemProps) => {
  return (
    <div
      className="flex items-center p-4 border-b border-gray-800 hover:bg-[#222] cursor-pointer transition-colors animate-fade-in"
      onClick={onClick}
    >
      <div className="relative">
        <Avatar className="h-10 w-10">
          <AvatarImage src={conversation.avatar} alt={conversation.lead_nome} />
          <AvatarFallback className="bg-[#333]">{getInitials(conversation.lead_nome)}</AvatarFallback>
        </Avatar>
        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center ${channelColors[conversation.canal]} text-white text-[8px] font-bold`}>
          {conversation.canal === 'WhatsApp' ? 'W' : 
           conversation.canal === 'Instagram' ? 'I' : 
           conversation.canal === 'Facebook' ? 'F' : 'E'}
        </div>
      </div>
      
      <div className="ml-3 flex-1 min-w-0">
        <div className="flex justify-between items-center">
          <h3 className="font-medium truncate text-white">{conversation.lead_nome}</h3>
          <span className="text-xs text-gray-400">{formatMessageTime(conversation.horario)}</span>
        </div>
        <p className="text-sm text-gray-400 truncate">{conversation.ultima_mensagem}</p>
      </div>
      
      {conversation.nao_lida && (
        <Badge className="ml-2 bg-pink-500 w-2 h-2 p-0 rounded-full" />
      )}
    </div>
  );
};

export default ConversationItem;
