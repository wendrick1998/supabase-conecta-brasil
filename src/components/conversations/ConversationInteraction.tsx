
import { useState } from 'react';
import { toast } from "@/components/ui/sonner";
import MessageInput from './MessageInput';
import NoteForm from './NoteForm';
import RecordingDialog from './RecordingDialog';
import { MediaType } from './recording/useRecording';

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
  const [recordingDialogOpen, setRecordingDialogOpen] = useState(false);
  const [mediaType, setMediaType] = useState<MediaType>('audio');

  const handleFileUpload = () => {
    toast.info('Funcionalidade de anexo em desenvolvimento');
  };

  const handleSaveNote = (noteContent: string) => {
    onSaveNote(noteContent);
    setShowNoteForm(false);
  };

  const handleOpenAudioRecording = () => {
    setMediaType('audio');
    setRecordingDialogOpen(true);
  };

  const handleOpenVideoRecording = () => {
    setMediaType('video');
    setRecordingDialogOpen(true);
  };

  const handleSaveRecording = (file: File) => {
    if (mediaType === 'audio') {
      onRecordAudio(file);
    } else {
      // Handle video differently if needed
      onRecordVideo();
    }
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
          onRecordAudio={() => handleOpenAudioRecording()}
          onRecordVideo={handleOpenVideoRecording}
          isLoading={sendingMessage}
        />
      )}

      {/* Recording Dialog */}
      <RecordingDialog
        open={recordingDialogOpen}
        onOpenChange={setRecordingDialogOpen}
        mediaType={mediaType}
        onSave={handleSaveRecording}
      />
    </>
  );
};

export default ConversationInteraction;
