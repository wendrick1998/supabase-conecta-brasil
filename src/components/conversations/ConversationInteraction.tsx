
import { useState } from 'react';
import { toast } from "@/components/ui/sonner";
import MessageInput from './MessageInput';
import NoteForm from './NoteForm';
import RecordingDialog from './RecordingDialog';
import { MediaType } from './recording/types';
import useMediaUpload from '@/hooks/useMediaUpload';
import { getMediaType } from '@/utils/mediaCompression';

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
  const { isUploading, uploadMedia } = useMediaUpload(conversationId);

  // Document file upload handler
  const handleDocumentFileUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.accept = '.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.rar';
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        
        // Verify file is a document
        const fileType = getMediaType(file);
        if (fileType !== 'document') {
          toast.error('Por favor, selecione apenas documentos. Para mídia, use os botões específicos.');
          return;
        }
        
        handleSendFile(file);
      }
    };
    
    input.click();
  };

  // Photo library (gallery) upload handler
  const handlePhotoLibraryUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.accept = 'image/*,video/*';
    // No capture attribute for gallery selection
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        
        // Verify file is image or video
        const fileType = getMediaType(file);
        if (fileType !== 'image' && fileType !== 'video') {
          toast.error('Por favor, selecione apenas imagens ou vídeos.');
          return;
        }
        
        handleSendFile(file);
      }
    };
    
    input.click();
  };

  // Camera capture handler
  const handleCameraCaptureUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = false;
    input.accept = 'image/*,video/*';
    input.capture = 'environment'; // Add capture attribute for camera access
    
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        const file = target.files[0];
        
        // Verify file is image or video
        const fileType = getMediaType(file);
        if (fileType !== 'image' && fileType !== 'video') {
          toast.error('Por favor, selecione apenas imagens ou vídeos.');
          return;
        }
        
        handleSendFile(file);
      }
    };
    
    input.click();
  };

  const handleSendFile = async (file: File) => {
    const fileType = getMediaType(file);
    
    let messageText = 'Arquivo enviado';
    switch (fileType) {
      case 'image':
        messageText = 'Imagem enviada';
        break;
      case 'video':
        messageText = 'Vídeo enviado';
        break;
      case 'audio':
        messageText = 'Áudio enviado';
        break;
      case 'document':
        messageText = `Documento enviado: ${file.name}`;
        break;
      default:
        messageText = `Arquivo enviado: ${file.name}`;
    }
    
    const success = await uploadMedia(file, messageText);
    if (success) {
      onSendMediaMessage(file, messageText);
    }
  };

  const handleSaveNote = (noteContent: string) => {
    onSaveNote(noteContent);
    setShowNoteForm(false);
  };

  const handleOpenRecordingModal = (type: MediaType) => {
    setMediaType(type);
    setRecordingDialogOpen(true);
  };

  const handleSaveRecording = async (file: File, type: MediaType) => {
    let messageText = 'Mídia enviada';
    
    if (type === 'audio') messageText = 'Áudio enviado';
    if (type === 'video') messageText = 'Vídeo enviado';
    if (type === 'photo') messageText = 'Foto enviada';
    
    const success = await uploadMedia(file, messageText);
    if (success) {
      onSendMediaMessage(file, messageText);
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
          onFileUpload={handleDocumentFileUpload}
          onAddNote={() => setShowNoteForm(true)}
          onOpenRecordingModal={handleOpenRecordingModal}
          onPhotoLibraryUpload={handlePhotoLibraryUpload}
          onCameraCaptureUpload={handleCameraCaptureUpload}
          onDocumentFileUpload={handleDocumentFileUpload}
          isLoading={sendingMessage || isUploading}
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
