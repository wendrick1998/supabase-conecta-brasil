
import React from 'react';
import { useForm } from 'react-hook-form';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { EstagioPipeline } from '@/types/lead';

interface PipelineStageFormProps {
  stage: EstagioPipeline;
  onSave: (data: Partial<EstagioPipeline>) => Promise<void>;
  onCancel: () => void;
}

// Cores pré-definidas para escolher
const predefinedColors = [
  '#9b87f5', // Primary Purple
  '#8B5CF6', // Vivid Purple
  '#0EA5E9', // Ocean Blue
  '#1EAEDB', // Bright Blue
  '#33C3F0', // Sky Blue
  '#F97316', // Bright Orange
  '#ea384c', // Red
  '#10B981', // Green
  '#6366F1', // Indigo
  '#8B5CF6', // Purple
];

const PipelineStageForm: React.FC<PipelineStageFormProps> = ({ 
  stage, 
  onSave,
  onCancel 
}) => {
  const isNewStage = !stage.id;
  const form = useForm<Partial<EstagioPipeline>>({
    defaultValues: {
      nome: stage.nome || '',
      cor: stage.cor || predefinedColors[0],
      descricao: stage.descricao || '',
    }
  });
  
  const handleSubmit = async (data: Partial<EstagioPipeline>) => {
    await onSave(data);
  };
  
  return (
    <Card className="bg-gray-50 p-6 rounded-lg shadow-inner">
      <h2 className="text-xl font-semibold mb-4">
        {isNewStage ? 'Novo Estágio' : 'Editar Estágio'}
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="nome"
            rules={{ required: 'O nome do estágio é obrigatório' }}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Estágio</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Qualificação" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cor</FormLabel>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 mb-2">
                  {predefinedColors.map(color => (
                    <div
                      key={color}
                      onClick={() => form.setValue('cor', color)}
                      className={`w-8 h-8 rounded-full cursor-pointer ${
                        field.value === color 
                          ? 'ring-2 ring-offset-2 ring-blue-500' 
                          : ''
                      }`}
                      style={{ backgroundColor: color }}
                      aria-label={`Cor ${color}`}
                    />
                  ))}
                </div>
                <FormControl>
                  <Input type="color" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição (opcional)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Descreva o que significa este estágio"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex space-x-2 justify-end pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="bg-pink-500 hover:bg-pink-600"
            >
              {isNewStage ? 'Criar Estágio' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </Form>
    </Card>
  );
};

export default PipelineStageForm;
