import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Paperclip, MessageSquarePlus, Mic, Camera, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'sonner';

const formSchema = z.object({
  canal: z.enum(['WhatsApp', 'Instagram', 'Email']),
  contato: z.string().min(1, "Contato é obrigatório"),
  mensagem: z.string().min(1, "Mensagem é obrigatória")
});

type FormValues = z.infer<typeof formSchema>;

type MediaType = 'audio' | 'video';

const NewConversation = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [recordingModalOpen, setRecordingModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState<MediaType>('audio');
  const [isRecording, setIsRecording] = useState(false);
  const [recordedMedia, setRecordedMedia] = useState<{
    url: string;
    blob: Blob | null;
    fileName: string;
  } | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaChunksRef = useRef<BlobPart[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      canal: undefined,
      contato: '',
      mensagem: ''
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      toast.success(`Arquivo anexado: ${e.target.files[0].name}`);
    }
  };

  const openRecordingModal = (type: MediaType) => {
    setMediaType(type);
    setRecordingModalOpen(true);
    setRecordedMedia(null);
    setIsRecording(false);
  };

  const closeRecordingModal = () => {
    setRecordingModalOpen(false);
    stopMediaStream();
  };

  const stopMediaStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const constraints = {
        audio: true,
        video: mediaType === 'video'
      };

      // Stop any existing stream
      stopMediaStream();
      
      // Request media permissions
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      
      // Reset chunks
      mediaChunksRef.current = [];
      
      // Create media recorder
      const mimeType = mediaType === 'audio' ? 'audio/webm' : 'video/webm';
      mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });
      
      // Add data handler
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          mediaChunksRef.current.push(e.data);
        }
      };
      
      // Handle recording stop
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(mediaChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);
        const fileName = `${mediaType}-${new Date().toISOString().replace(/:/g, '-')}.webm`;
        
        setRecordedMedia({
          url,
          blob,
          fileName
        });
        
        setIsRecording(false);
      };
      
      // Start recording
      mediaRecorderRef.current.start();
      setIsRecording(true);
      
    } catch (error) {
      console.error('Error accessing media devices:', error);
      toast.error(`Não foi possível acessar o ${mediaType === 'audio' ? 'microfone' : 'câmera'}`);
      setRecordingModalOpen(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };

  const saveRecording = () => {
    if (recordedMedia && recordedMedia.blob) {
      const file = new File([recordedMedia.blob], recordedMedia.fileName, {
        type: recordedMedia.blob.type
      });
      
      setSelectedFile(file);
      toast.success(`${mediaType === 'audio' ? 'Áudio' : 'Vídeo'} anexado: ${file.name}`);
      closeRecordingModal();
    }
  };

  const removeAttachment = () => {
    setSelectedFile(null);
    if (recordedMedia) {
      URL.revokeObjectURL(recordedMedia.url);
      setRecordedMedia(null);
    }
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
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          <FormField
            control={form.control}
            name="canal"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Canal</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione o canal" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="WhatsApp">WhatsApp</SelectItem>
                    <SelectItem value="Instagram">Instagram</SelectItem>
                    <SelectItem value="Email">Email</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contato"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Destinatário</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Número, username ou email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mensagem"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Mensagem</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Digite sua mensagem..."
                    className="min-h-[150px]"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-4">
            <div className="flex items-center">
              <label htmlFor="file-upload" className="cursor-pointer">
                <div className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
                  <Paperclip className="h-5 w-5" />
                  <span className="text-sm">Anexar arquivo</span>
                </div>
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>
              
              {selectedFile && (
                <div className="ml-4 text-sm text-gray-600 flex items-center">
                  <span className="mr-2">{selectedFile.name}</span>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={removeAttachment}
                    className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-transparent"
                    aria-label="Remover anexo"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            
            <div>
              <label className="flex items-center gap-2 text-blue-600 hover:text-blue-800 cursor-pointer mb-4">
                <MessageSquarePlus className="h-5 w-5" />
                <span className="text-sm">Inserir template</span>
              </label>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm text-blue-700 font-medium">Anexos Multimídia</h3>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => openRecordingModal('audio')}
                  aria-label="Gravar áudio"
                >
                  <Mic className="h-5 w-5" />
                  <span>Gravar Áudio</span>
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700"
                  onClick={() => openRecordingModal('video')}
                  aria-label="Gravar vídeo"
                >
                  <Camera className="h-5 w-5" />
                  <span>Gravar Vídeo</span>
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 pt-4">
            <Button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Mensagem'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline"
              onClick={handleSaveAsDraft}
              disabled={isSubmitting}
            >
              Salvar como Rascunho
            </Button>
            
            <Button 
              type="button" 
              variant="ghost"
              onClick={() => navigate('/conversations')}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </Form>

      <Dialog open={recordingModalOpen} onOpenChange={setRecordingModalOpen}>
        <DialogContent className="sm:max-w-md" onInteractOutside={(e) => {
          if (isRecording) {
            e.preventDefault();
          }
        }}>
          <DialogHeader>
            <DialogTitle>
              {isRecording 
                ? `Gravando ${mediaType === 'audio' ? 'áudio' : 'vídeo'}...` 
                : `Gravar ${mediaType === 'audio' ? 'áudio' : 'vídeo'}`}
            </DialogTitle>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center p-4">
            {mediaType === 'video' && streamRef.current && isRecording && (
              <video 
                autoPlay 
                muted 
                className="w-full h-64 bg-gray-100 rounded-md object-cover mb-4"
              >
                <source src={streamRef.current ? '' : undefined} />
              </video>
            )}
            
            {mediaType === 'video' && recordedMedia && !isRecording && (
              <video 
                src={recordedMedia.url} 
                controls 
                className="w-full h-64 bg-gray-100 rounded-md object-cover mb-4"
              />
            )}
            
            {mediaType === 'audio' && isRecording && (
              <div className="w-full h-24 bg-gray-100 rounded-md flex items-center justify-center mb-4">
                <div className="w-4 h-4 rounded-full bg-red-500 animate-pulse mr-2"></div>
                <span>Gravando áudio...</span>
              </div>
            )}
            
            {mediaType === 'audio' && recordedMedia && !isRecording && (
              <audio 
                src={recordedMedia.url} 
                controls 
                className="w-full mb-4"
              />
            )}
            
            <div className="flex gap-3 justify-center">
              {!isRecording && !recordedMedia && (
                <Button
                  onClick={startRecording}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Iniciar Gravação
                </Button>
              )}
              
              {isRecording && (
                <Button
                  onClick={stopRecording}
                  variant="destructive"
                >
                  Parar Gravação
                </Button>
              )}
              
              {recordedMedia && !isRecording && (
                <>
                  <Button
                    onClick={startRecording}
                    variant="outline"
                  >
                    Regravar
                  </Button>
                  
                  <Button
                    onClick={saveRecording}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Salvar e Anexar
                  </Button>
                </>
              )}
            </div>
          </div>
          
          <DialogFooter className="sm:justify-start">
            {!isRecording && (
              <Button
                type="button"
                variant="secondary"
                onClick={closeRecordingModal}
              >
                Cancelar
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NewConversation;
