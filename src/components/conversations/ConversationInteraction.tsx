
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";
import MessageInput from './MessageInput';
import NoteForm from './NoteForm';
import RecordingDialog from './RecordingDialog';
import { MediaType } from './recording/types';
import useMediaUpload from '@/hooks/useMediaUpload';
import { getMediaType, clearMediaCache } from '@/utils/mediaCompression';
import { useAuth } from '@/contexts/AuthContext';
import { Progress } from '@/components/ui/progress';

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
  const { isUploading, uploadMedia, uploadProgress } = useMediaUpload(conversationId);
  const { user } = useAuth();
  const [isCompressing, setIsCompressing] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Limpar cache quando componente desmontar
  useEffect(() => {
    return () => {
      clearMediaCache();
    };
  }, []);

  // Photo library (gallery) upload handler
  const handlePhotoLibraryUpload = () => {
    if (!user) {
      toast.error('Você precisa estar logado para enviar mídia.');
      return;
    }
    
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
        
        setSelectedFile(file);
        handleSendFile(file);
      }
    };
    
    input.click();
  };

  // Camera capture handler
  const handleCameraCaptureUpload = () => {
    if (!user) {
      toast.error('Você precisa estar logado para enviar mídia.');
      return;
    }
    
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
        
        setSelectedFile(file);
        handleSendFile(file);
      }
    };
    
    input.click();
  };

  // Document file upload handler
  const handleDocumentFileUpload = () => {
    if (!user) {
      toast.error('Você precisa estar logado para enviar documentos.');
      return;
    }
    
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
        
        setSelectedFile(file);
        handleSendFile(file);
      }
    };
    
    input.click();
  };

  const handleSendFile = async (file: File) => {
    if (!user) {
      toast.error('Você precisa estar logado para enviar arquivos.');
      return;
    }

    const fileType = getMediaType(file);
    
    let messageText = 'Arquivo enviado';
    switch (fileType) {
      case 'image':
        messageText = 'Imagem enviada';
        setIsCompressing(true);
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
    
    try {
      if (fileType === 'image') {
        // Adiciona atraso para mostrar o indicador de compressão brevemente
        await new Promise(resolve => setTimeout(resolve, 800));
      }

      const success = await uploadMedia(file, messageText);
      
      if (success) {
        onSendMediaMessage(file, messageText);
        toast.success(`${messageText} com sucesso!`);
      } else {
        // Mostrar botão de retry
        toast.error('Falha no upload. Tente novamente.', {
          action: {
            label: 'Tentar novamente',
            onClick: () => handleSendFile(file),
          },
        });
      }
    } catch (error) {
      console.error('Erro ao enviar arquivo:', error);
      toast.error('Não foi possível enviar o arquivo.', {
        action: {
          label: 'Tentar novamente',
          onClick: () => handleSendFile(file),
        },
      });
    } finally {
      setIsCompressing(false);
      setSelectedFile(null);
    }
  };

  const handleSaveNote = (noteContent: string) => {
    if (!user) {
      toast.error('Você precisa estar logado para adicionar notas.');
      return;
    }
    
    onSaveNote(noteContent);
    setShowNoteForm(false);
    toast.success('Nota adicionada com sucesso!');
  };

  const handleOpenRecordingModal = (type: MediaType) => {
    if (!user) {
      toast.error('Você precisa estar logado para gravar mídia.');
      return;
    }
    
    setMediaType(type);
    setRecordingDialogOpen(true);
  };

  const handleSaveRecording = async (file: File, type: MediaType) => {
    if (!user) {
      toast.error('Você precisa estar logado para enviar gravações.');
      return;
    }
    
    let messageText = 'Mídia enviada';
    
    if (type === 'audio') messageText = 'Áudio enviado';
    if (type === 'video') messageText = 'Vídeo enviado';
    if (type === 'photo') messageText = 'Foto enviada';
    
    setSelectedFile(file);
    
    try {
      const success = await uploadMedia(file, messageText);
      if (success) {
        onSendMediaMessage(file, messageText);
        toast.success(`${messageText} com sucesso!`);
      } else {
        toast.error('Falha no upload. Tente novamente.', {
          action: {
            label: 'Tentar novamente',
            onClick: () => handleSaveRecording(file, type),
          },
        });
      }
    } catch (error) {
      console.error('Erro ao enviar gravação:', error);
      toast.error('Não foi possível enviar a gravação.', {
        action: {
          label: 'Tentar novamente',
          onClick: () => handleSaveRecording(file, type),
        },
      });
    } finally {
      setSelectedFile(null);
    }
  };

  return (
    <>
      {/* Upload Progress */}
      {(isUploading || isCompressing) && (
        <div className="bg-white border-t px-4 py-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium">
              {isCompressing ? 'Comprimindo' : 'Enviando'} 
              {selectedFile ? ` ${selectedFile.name.substring(0, 20)}${selectedFile.name.length > 20 ? '...' : ''}` : ''}
            </span>
            <span className="text-xs text-gray-500">{Math.round(uploadProgress)}%</span>
          </div>
          <Progress value={isCompressing ? 70 : uploadProgress} className="h-1" />
        </div>
      )}

      {showNoteForm ? (
        <NoteForm 
          onSave={handleSaveNote} 
          onCancel={() => setShowNoteForm(false)} 
        />
      ) : (
        <MessageInput 
          onSend={(message) => {
            if (!user) {
              toast.error('Você precisa estar logado para enviar mensagens.');
              return;
            }
            onSendMessage(message);
          }}
          onFileUpload={handleDocumentFileUpload}
          onAddNote={() => setShowNoteForm(true)}
          onOpenRecordingModal={handleOpenRecordingModal}
          onPhotoLibraryUpload={handlePhotoLibraryUpload}
          onCameraCaptureUpload={handleCameraCaptureUpload}
          onDocumentFileUpload={handleDocumentFileUpload}
          isLoading={sendingMessage || isUploading || isCompressing}
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
