
import React from 'react';
import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Canal, EstagioPipeline } from '@/types/lead';
import { LeadFormValues } from './LeadFormSchema';

interface CategoryFieldsProps {
  control: Control<LeadFormValues>;
  canais: Canal[];
  estagios: EstagioPipeline[];
}

const CategoryFields: React.FC<CategoryFieldsProps> = ({ control, canais, estagios }) => {
  return (
    <>
      {/* Canal */}
      <FormField
        control={control}
        name="canal_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Canal de Origem</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um canal" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {canais.map((canal) => (
                  <SelectItem key={canal.id} value={canal.id}>
                    {canal.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Estágio do Pipeline */}
      <FormField
        control={control}
        name="estagio_id"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Estágio no Pipeline</FormLabel>
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value || undefined}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um estágio" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {estagios.map((estagio) => (
                  <SelectItem key={estagio.id} value={estagio.id}>
                    {estagio.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};

export default CategoryFields;
