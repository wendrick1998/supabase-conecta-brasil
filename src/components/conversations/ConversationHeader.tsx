
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft } from 'lucide-react';
import { Conversation } from '@/types/conversation';
import { useNavigate } from 'react-router-dom';
import { getInitials } from '@/utils/conversationUtils';
import { getChannelIcon } from '@/components/conversations/ChannelIcons';

interface ConversationHeaderProps {
  conversation: Conversation;
}

const ConversationHeader = ({ conversation }: ConversationHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="p-4 border-b sticky top-0 bg-white z-10 shadow-sm">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/conversations')}
          className="mr-2"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={conversation.avatar} alt={conversation.lead_nome} />
          <AvatarFallback>{getInitials(conversation.lead_nome)}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold">{conversation.lead_nome}</h1>
            <div className="flex items-center ml-2">
              {getChannelIcon(conversation.canal)}
              <span className="text-xs text-muted-foreground ml-1">{conversation.canal}</span>
            </div>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Badge variant={conversation.status === 'Aberta' ? 'default' : 'secondary'} className="text-xs h-5">
              {conversation.status}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConversationHeader;
