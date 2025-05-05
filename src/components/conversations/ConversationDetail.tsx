
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConversationData } from '@/hooks/useConversationData';
import ConversationHeader from './ConversationHeader';
import MessageTimeline from './MessageTimeline';
import ConversationLoading from './ConversationLoading';
import ConversationNotFound from './ConversationNotFound';
import ConversationInteraction from './ConversationInteraction';
import { Button } from '@/components/ui/button';
import { Plus, MessageCircle } from 'lucide-react';

const ConversationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Use conversation data hook
  const {
    conversation,
    messages,
    notes,
    loading,
    error,
    sendingMessage,
    handleSendMessage,
    handleSaveNote,
    handleSendMediaMessage,
    setSendingMessage
  } = useConversationData(id);

  const handleStartNewConversation = () => {
    navigate(`/conversations/new?lead=${id}`);
  };

  if (loading) {
    return <ConversationLoading />;
  }

  if (error || !conversation) {
    return <ConversationNotFound />;
  }

  // When a lead has no existing conversation but we have a placeholder
  const isEmptyConversation = messages.length === 0 && conversation.id.startsWith('new-');

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#121212] border-l border-gray-800">
      {/* Header */}
      <ConversationHeader conversation={conversation} />
      
      {isEmptyConversation ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-white">
          <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700 shadow-lg max-w-md">
            <div className="h-16 w-16 bg-gradient-to-br from-vendah-purple to-vendah-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-medium mb-2">Este lead ainda não possui histórico de conversa</h2>
            <p className="text-gray-400 mb-6">
              Inicie uma nova conversa para entrar em contato com este lead.
            </p>
            <Button 
              onClick={handleStartNewConversation}
              className="flex items-center gap-2 bg-gradient-to-r from-vendah-purple to-vendah-blue hover:brightness-110 transition-all"
            >
              <Plus className="h-4 w-4" />
              Iniciar nova conversa
            </Button>
          </div>
        </div>
      ) : (
        <>
          {/* Messages */}
          <MessageTimeline messages={messages} notes={notes} />
          
          {/* Input & Note Form */}
          <div className="bg-[#1A1A1A] border-t border-gray-800 pt-2 pb-4">
            <div className="max-w-4xl w-full mx-auto">
              <ConversationInteraction 
                conversationId={conversation.id}
                onSendMessage={handleSendMessage}
                onSaveNote={handleSaveNote}
                onSendMediaMessage={handleSendMediaMessage}
                sendingMessage={sendingMessage}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConversationDetail;
