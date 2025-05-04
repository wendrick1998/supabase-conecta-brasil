
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Paperclip, MessageSquarePlus } from 'lucide-react';
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

const NewConversation = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
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

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // Simulation of sending a message
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
              <div className="ml-4 text-sm text-gray-600">
                {selectedFile.name}
              </div>
            )}
          </div>
          
          <div>
            <label className="flex items-center gap-2 text-blue-600 hover:text-blue-800 cursor-pointer mb-4">
              <MessageSquarePlus className="h-5 w-5" />
              <span className="text-sm">Inserir template</span>
            </label>
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
    </div>
  );
};

export default NewConversation;
