
import React from 'react';
import { useForm } from 'react-hook-form';
import { addLeadNote } from '@/services/notaService';
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
import { toast } from '@/components/ui/sonner';

interface AddNoteFormProps {
  leadId: string;
  onSuccess: () => void;
}

interface FormValues {
  conteudo: string;
}

const AddNoteForm: React.FC<AddNoteFormProps> = ({ leadId, onSuccess }) => {
  const form = useForm<FormValues>({
    defaultValues: {
      conteudo: '',
    },
  });

  const { handleSubmit, formState: { isSubmitting } } = form;

  const onSubmit = async (values: FormValues) => {
    try {
      await addLeadNote({
        lead_id: leadId,
        conteudo: values.conteudo,
      });
      
      form.reset();
      onSuccess();
    } catch (error) {
      toast.error('Erro ao adicionar nota');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="conteudo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova Nota</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escreva sua nota aqui..."
                  className="min-h-[120px] resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Nota'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddNoteForm;
