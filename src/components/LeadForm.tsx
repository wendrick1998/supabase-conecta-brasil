import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lead, Canal, EstagioPipeline } from '@/types/lead';
import { getCanais, getEstagios, createLead, updateLead } from '@/services/leadService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import LeadTagSelect from './LeadTagSelect';
import { Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

// Esquema de validação
const leadFormSchema = z.object({
  nome: z.string().min(2, { message: 'Nome é obrigatório e deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }).nullable().optional(),
  telefone: z.string().nullable().optional(),
  empresa: z.string().nullable().optional(),
  canal_id: z.string().nullable().optional(),
  estagio_id: z.string().nullable().optional(),
});

type LeadFormValues = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  lead?: Lead;
  isEditing?: boolean;
}

const LeadForm: React.FC<LeadFormProps> = ({ lead, isEditing = false }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canais, setCanais] = useState<Canal[]>([]);
  const [estagios, setEstagios] = useState<EstagioPipeline[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Configurar o formulário
  const form = useForm<LeadFormValues>({
    resolver: zodResolver(leadFormSchema),
    defaultValues: {
      nome: lead?.nome || '',
      email: lead?.email || null,
      telefone: lead?.telefone || null,
      empresa: lead?.empresa || null,
      canal_id: lead?.canal_id || null,
      estagio_id: lead?.estagio_id || null,
    },
  });

  // Carregar canais, estágios e dados do lead (se estiver editando)
  useEffect(() => {
    const fetchData = async () => {
      const [canaisData, estagiosData] = await Promise.all([
        getCanais(),
        getEstagios()
      ]);
      
      setCanais(canaisData);
      setEstagios(estagiosData);

      // Se estiver editando, definir as tags selecionadas
      if (lead && lead.tags) {
        setSelectedTags(lead.tags.map(tag => tag.id));
      }

      // Se não estiver editando, definir estágio padrão como o primeiro
      if (!isEditing && estagiosData.length > 0) {
        form.setValue('estagio_id', estagiosData[0].id);
      }
    };

    fetchData();
  }, [lead, isEditing, form]);

  const onSubmit = async (data: LeadFormValues) => {
    setIsSubmitting(true);

    try {
      if (isEditing && lead) {
        // Atualizar lead existente
        await updateLead(lead.id, data, selectedTags);
        navigate(`/leads/${lead.id}`);
      } else {
        // Criar novo lead
        const newLead = await createLead(data, selectedTags);
        if (newLead) {
          navigate(`/leads/${newLead.id}`);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nome */}
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome *</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Nome do lead" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Email do lead"
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value || null)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Telefone */}
          <FormField
            control={form.control}
            name="telefone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Telefone do lead" 
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Empresa */}
          <FormField
            control={form.control}
            name="empresa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Empresa</FormLabel>
                <FormControl>
                  <Input 
                    {...field} 
                    placeholder="Empresa do lead" 
                    value={field.value || ''}
                    onChange={(e) => field.onChange(e.target.value || null)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Canal */}
          <FormField
            control={form.control}
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
            control={form.control}
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
        </div>

        {/* Tags */}
        <LeadTagSelect 
          selectedTags={selectedTags} 
          onChange={setSelectedTags} 
        />

        <div className="flex justify-end space-x-2 pt-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/leads')}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? 'Salvar Alterações' : 'Criar Lead'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default LeadForm;
