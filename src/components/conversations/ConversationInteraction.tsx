
import { useState } from 'react';
import { toast } from "@/components/ui/sonner";
import MessageInput from './MessageInput';
import NoteForm from './NoteForm';

interface ConversationInteractionProps {
  conversationId: string;
  onSendMessage: (message: string) => void;
  onSaveNote: (noteContent: string) => void;
  onRecordAudio: (file: File) => void;
  onRecordVideo: () => void;
  openRecordingModal: (type: 'audio' | 'video') => void;
  sendingMessage: boolean;
}

const ConversationInteraction = ({
  conversationId,
  onSendMessage,
  onSaveNote,
  onRecordAudio,
  onRecordVideo,
  openRecordingModal,
  sendingMessage,
}: ConversationInteractionProps) => {
  const [showNoteForm, setShowNoteForm] = useState(false);

  const handleFileUpload = () => {
    toast.info('Funcionalidade de anexo em desenvolvimento');
  };

  const handleSaveNote = (noteContent: string) => {
    onSaveNote(noteContent);
    setShowNoteForm(false);
  };

  return (
    <>
      {showNoteForm ? (
        <NoteForm 
          onSave={handleSaveNote} 
          onCancel={() => setShowNoteForm(false)} 
        />
      ) : (
        <MessageInput 
          onSend={onSendMessage}
          onFileUpload={handleFileUpload}
          onAddNote={() => setShowNoteForm(true)}
          onRecordAudio={onRecordAudio}
          onRecordVideo={onRecordVideo}
          isLoading={sendingMessage}
        />
      )}
    </>
  );
};

export default ConversationInteraction;
