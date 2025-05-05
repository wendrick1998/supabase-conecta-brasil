
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConversationData } from '@/hooks/useConversationData';
import ConversationHeader from './ConversationHeader';
import MessageTimeline from './MessageTimeline';
import ConversationLoading from './ConversationLoading';
import ConversationNotFound from './ConversationNotFound';
import ConversationInteraction from './ConversationInteraction';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

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
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white">
      {/* Header */}
      <ConversationHeader conversation={conversation} />
      
      {isEmptyConversation ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <h2 className="text-xl font-medium mb-2">Este lead ainda não possui histórico de conversa</h2>
          <p className="text-gray-500 mb-6">
            Inicie uma nova conversa para entrar em contato com este lead.
          </p>
          <Button 
            onClick={handleStartNewConversation}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Iniciar nova conversa
          </Button>
        </div>
      ) : (
        <>
          {/* Messages */}
          <MessageTimeline messages={messages} notes={notes} />
          
          {/* Input & Note Form */}
          <ConversationInteraction 
            conversationId={conversation.id}
            onSendMessage={handleSendMessage}
            onSaveNote={handleSaveNote}
            onRecordAudio={(file) => handleSendMediaMessage(file, 'Áudio enviado')}
            onRecordVideo={() => {}}
            openRecordingModal={() => {}}
            sendingMessage={sendingMessage}
          />
        </>
      )}
    </div>
  );
};

export default ConversationDetail;
