
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { MessageSquarePlus } from 'lucide-react';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import FileAttachment from './FileAttachment';
import MultimediaButtons from './MultimediaButtons';

const formSchema = z.object({
  canal: z.enum(['WhatsApp', 'Instagram', 'Email']),
  contato: z.string().min(1, "Contato é obrigatório"),
  mensagem: z.string().min(1, "Mensagem é obrigatória")
});

export type FormValues = z.infer<typeof formSchema>;
export type MediaType = 'audio' | 'video';

interface ConversationFormProps {
  onSubmit: (values: FormValues) => Promise<void>;
  onSaveAsDraft: () => void;
  onCancel: () => void;
  isSubmitting: boolean;
  selectedFile: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveAttachment: () => void;
  onOpenRecordingModal: (type: MediaType) => void;
}

const ConversationForm: React.FC<ConversationFormProps> = ({
  onSubmit,
  onSaveAsDraft,
  onCancel,
  isSubmitting,
  selectedFile,
  onFileChange,
  onRemoveAttachment,
  onOpenRecordingModal
}) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      canal: undefined,
      contato: '',
      mensagem: ''
    }
  });

  return (
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
          <FileAttachment 
            selectedFile={selectedFile} 
            onFileChange={onFileChange}
            onRemoveAttachment={onRemoveAttachment}
          />
          
          <div>
            <label className="flex items-center gap-2 text-blue-600 hover:text-blue-800 cursor-pointer mb-4">
              <MessageSquarePlus className="h-5 w-5" />
              <span className="text-sm">Inserir template</span>
            </label>
          </div>
          
          <MultimediaButtons onOpenRecordingModal={onOpenRecordingModal} />
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
            onClick={onSaveAsDraft}
            disabled={isSubmitting}
          >
            Salvar como Rascunho
          </Button>
          
          <Button 
            type="button" 
            variant="ghost"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ConversationForm;
