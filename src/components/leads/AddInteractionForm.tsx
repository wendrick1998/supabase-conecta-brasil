
import React from 'react';
import { useForm } from 'react-hook-form';
import { addLeadInteraction } from '@/services/interacaoService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageCircle, Phone } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface AddInteractionFormProps {
  leadId: string;
  onSuccess: () => void;
}

interface FormValues {
  tipo: string;
  conteudo: string;
}

const AddInteractionForm: React.FC<AddInteractionFormProps> = ({ leadId, onSuccess }) => {
  const form = useForm<FormValues>({
    defaultValues: {
      tipo: 'mensagem',
      conteudo: '',
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = async (values: FormValues) => {
    try {
      await addLeadInteraction({
        lead_id: leadId,
        tipo: values.tipo,
        conteudo: values.conteudo,
      });
      
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error('Erro ao registrar interação');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Interação</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de interação" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="mensagem">
                    <div className="flex items-center">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      <span>Mensagem</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="chamada">
                    <div className="flex items-center">
                      <Phone className="mr-2 h-4 w-4" />
                      <span>Chamada</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="conteudo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Detalhes da Interação</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva os detalhes da interação..."
                  className="min-h-[100px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Registrar Interação'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddInteractionForm;
