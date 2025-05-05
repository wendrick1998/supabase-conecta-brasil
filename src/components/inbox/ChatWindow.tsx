
import React, { useState, useEffect, useRef } from 'react';
import { Conversation, Message } from '@/types/conversation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { formatRelative } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/utils/conversationUtils';
import MessageInput from './MessageInput';
import { toast } from 'sonner';

interface ChatWindowProps {
  conversation: Conversation;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ conversation }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // Fetch messages when conversation changes
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        // Mark conversation as read when opened
        await supabase
          .from('conversations')
          .update({ nao_lida: false })
          .eq('id', conversation.id);

        // Fetch messages for this conversation
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .eq('conversation_id', conversation.id)
          .order('timestamp', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
          throw error;
        }

        // Properly cast the data to the Message type
        const typedMessages = data?.map(msg => ({
          ...msg,
          sender_type: msg.sender_type as "user" | "lead",
          status: msg.status as "sent" | "delivered" | "read",
          attachment: msg.attachment as Message['attachment'] | undefined
        })) || [];

        setMessages(typedMessages);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        toast.error('Não foi possível carregar as mensagens');
      } finally {
        setIsLoading(false);
      }
    };

    if (conversation?.id) {
      fetchMessages();
    }

    // Set up realtime subscription for new messages
    const channel = supabase
      .channel(`messages-${conversation.id}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `conversation_id=eq.${conversation.id}`
        }, 
        (payload) => {
          // Ensure the new message is properly typed
          const newMsg = payload.new;
          const typedMessage: Message = {
            ...newMsg,
            id: newMsg.id,
            conversation_id: newMsg.conversation_id,
            content: newMsg.content,
            timestamp: newMsg.timestamp,
            sender_type: newMsg.sender_type as "user" | "lead",
            status: newMsg.status as "sent" | "delivered" | "read",
            attachment: newMsg.attachment as Message['attachment'] | undefined
          };
          setMessages(prev => [...prev, typedMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversation.id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isSending) return;

    setIsSending(true);
    try {
      const { error } = await supabase.from('messages').insert({
        conversation_id: conversation.id,
        content: messageText,
        sender_type: 'user',
        status: 'sent',
      });

      if (error) {
        console.error('Error sending message:', error);
        toast.error('Erro ao enviar mensagem');
        throw error;
      }

      // Update conversation's last message
      await supabase
        .from('conversations')
        .update({ 
          ultima_mensagem: messageText,
          horario: new Date().toISOString(),
          nao_lida: false
        })
        .eq('id', conversation.id);

      toast.success('Mensagem enviada');
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsSending(false);
    }
  };

  const formatMessageTime = (timestamp: string) => {
    try {
      return formatRelative(new Date(timestamp), new Date(), { locale: ptBR });
    } catch (error) {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-vendah-purple/20 flex items-center">
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={conversation.avatar} alt={conversation.lead_nome} />
          <AvatarFallback className="bg-vendah-purple">{getInitials(conversation.lead_nome)}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-medium text-white">{conversation.lead_nome}</h3>
          <p className="text-sm text-text-muted">Canal: {conversation.canal}</p>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-grow overflow-y-auto p-4 bg-[#1a1a1a] space-y-4">
        {isLoading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'} mb-4`}>
              <div className={`rounded-lg p-3 max-w-[80%] ${i % 2 === 0 ? 'bg-surface/40' : 'bg-vendah-purple/30'}`}>
                <Skeleton className="h-4 w-40 mb-2" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          ))
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-text-muted">
            Ainda não há mensagens nesta conversa
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={message.id || index}
              className={`flex ${message.sender_type === 'lead' ? 'justify-start' : 'justify-end'}`}
            >
              <div 
                className={`rounded-lg p-3 max-w-[80%] ${
                  message.sender_type === 'lead'
                    ? 'bg-surface/40 text-white'
                    : 'bg-vendah-purple/30 text-white'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="text-right text-xs text-text-muted mt-1">
                  {formatMessageTime(message.timestamp)}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message input */}
      <MessageInput 
        onSend={sendMessage} 
        isLoading={isSending} 
        channelType={conversation.canal}
      />
    </div>
  );
};

export default ChatWindow;
