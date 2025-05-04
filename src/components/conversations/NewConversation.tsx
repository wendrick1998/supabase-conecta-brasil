
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import ConversationForm, { FormValues, MediaType } from './ConversationForm';
import RecordingDialog from './RecordingDialog';

const NewConversation = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordingModalOpen, setRecordingModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState<MediaType>('audio');
  const [recordedMedia, setRecordedMedia] = useState<{
    url: string;
    blob: Blob | null;
    fileName: string;
  } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      toast.success(`Arquivo anexado: ${e.target.files[0].name}`);
    }
  };

  const openRecordingModal = (type: MediaType) => {
    setMediaType(type);
    setRecordingModalOpen(true);
  };

  const removeAttachment = () => {
    setSelectedFile(null);
    if (recordedMedia) {
      URL.revokeObjectURL(recordedMedia.url);
      setRecordedMedia(null);
    }
  };

  const handleSaveRecording = (file: File) => {
    setSelectedFile(file);
    toast.success(`${mediaType === 'audio' ? 'Áudio' : 'Vídeo'} anexado: ${file.name}`);
  };

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulation of sending a message with possible media attachment
      console.log('Enviando mensagem:', values, selectedFile);
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Mensagem enviada com sucesso!');
      navigate('/conversations');
    } catch (error) {
      toast.error('Erro ao enviar mensagem.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveAsDraft = () => {
    toast.info('Rascunho salvo!');
  };

  return (
    <div className="flex flex-col h-full max-w-2xl mx-auto bg-white">
      <div className="p-4 border-b flex items-center shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/conversations')}
          className="mr-2"
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-bold">Nova Mensagem</h1>
      </div>
      
      <ConversationForm
        onSubmit={onSubmit}
        onSaveAsDraft={handleSaveAsDraft}
        onCancel={() => navigate('/conversations')}
        isSubmitting={isSubmitting}
        selectedFile={selectedFile}
        onFileChange={handleFileChange}
        onRemoveAttachment={removeAttachment}
        onOpenRecordingModal={openRecordingModal}
      />

      <RecordingDialog
        open={recordingModalOpen}
        onOpenChange={setRecordingModalOpen}
        mediaType={mediaType}
        onSave={handleSaveRecording}
      />
    </div>
  );
};

export default NewConversation;
