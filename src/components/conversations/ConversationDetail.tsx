
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConversationData } from '@/hooks/useConversationData';
import ConversationHeader from './ConversationHeader';
import MessageTimeline from './MessageTimeline';
import ConversationLoading from './ConversationLoading';
import ConversationNotFound from './ConversationNotFound';
import ConversationInteraction from './ConversationInteraction';

const ConversationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Use conversation data hook
  const {
    conversation,
    messages,
    notes,
    loading,
    sendingMessage,
    handleSendMessage,
    handleSaveNote,
    handleSendMediaMessage,
    setSendingMessage
  } = useConversationData(id);

  // Recording handlers
  const openRecordingModal = (type: 'audio' | 'video') => {
    // This is now handled directly in ConversationInteraction
  };

  const handleRecordAudio = (file: File) => {
    handleSendMediaMessage(file, 'Áudio enviado');
  };

  if (loading) {
    return <ConversationLoading />;
  }

  if (!conversation) {
    return <ConversationNotFound />;
  }

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto bg-white">
      {/* Header */}
      <ConversationHeader conversation={conversation} />
      
      {/* Messages */}
      <MessageTimeline messages={messages} notes={notes} />
      
      {/* Input & Note Form */}
      <ConversationInteraction 
        conversationId={id || ''}
        onSendMessage={handleSendMessage}
        onSaveNote={handleSaveNote}
        onRecordAudio={handleRecordAudio}
        onRecordVideo={() => openRecordingModal('video')}
        openRecordingModal={openRecordingModal}
        sendingMessage={sendingMessage}
      />
    </div>
  );
};

export default ConversationDetail;
