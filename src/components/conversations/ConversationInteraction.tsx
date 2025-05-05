
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
  onSendMediaMessage: (file: File, contentText: string) => void;
  sendingMessage: boolean;
}

const ConversationInteraction = ({
  conversationId,
  onSendMessage,
  onSaveNote,
  onSendMediaMessage,
  sendingMessage,
}: ConversationInteractionProps) => {
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [recordingDialogOpen, setRecordingDialogOpen] = useState(false);
  const [mediaType, setMediaType] = useState<MediaType>('audio');

  const handleFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar,.jpg,.jpeg,.png,.gif';
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        handleSendFile(file);
      }
    };
    
    input.click();
  };

  const handleGalleryUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.accept = 'image/*,video/*';
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        handleSendFile(file);
      }
    };
    
    input.click();
  };

  const handleSendFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');
    
    let messageText = 'Arquivo enviado';
    
    if (isImage) messageText = 'Imagem enviada';
    if (isVideo) messageText = 'Vídeo enviado';
    if (isAudio) messageText = 'Áudio enviado';
    
    onSendMediaMessage(file, messageText);
  };

  const handleSaveNote = (noteContent: string) => {
    onSaveNote(noteContent);
    setShowNoteForm(false);
  };

  const handleOpenRecordingModal = (type: MediaType) => {
    setMediaType(type);
    setRecordingDialogOpen(true);
  };

  const handleSaveRecording = (file: File, type: MediaType) => {
    let messageText = 'Mídia enviada';
    
    if (type === 'audio') messageText = 'Áudio enviado';
    if (type === 'video') messageText = 'Vídeo enviado';
    if (type === 'photo') messageText = 'Foto enviada';
    
    onSendMediaMessage(file, messageText);
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
          onOpenRecordingModal={handleOpenRecordingModal}
          onGalleryUpload={handleGalleryUpload}
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
