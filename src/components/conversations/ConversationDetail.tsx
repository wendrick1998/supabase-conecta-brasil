
import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useConversationData } from '@/hooks/useConversationData';
import ConversationHeader from './ConversationHeader';
import MessageTimeline from './MessageTimeline';
import RecordingDialog from './RecordingDialog';
import ConversationLoading from './ConversationLoading';
import ConversationNotFound from './ConversationNotFound';
import ConversationInteraction from './ConversationInteraction';

const ConversationDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Recording state
  const [recordingDialogOpen, setRecordingDialogOpen] = useState(false);
  const [mediaType, setMediaType] = useState<'audio' | 'video'>('audio');

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
    setMediaType(type);
    setRecordingDialogOpen(true);
  };

  const handleRecordAudio = (file: File) => {
    handleSendMediaMessage(file, 'Áudio enviado');
  };

  const handleSaveRecording = (file: File) => {
    const isAudio = file.type.includes('audio');
    handleSendMediaMessage(file, isAudio ? 'Áudio enviado' : 'Vídeo enviado');
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

      {/* Recording Dialog */}
      <RecordingDialog
        open={recordingDialogOpen}
        onOpenChange={setRecordingDialogOpen}
        mediaType={mediaType}
        onSave={handleSaveRecording}
      />
    </div>
  );
};

export default ConversationDetail;
