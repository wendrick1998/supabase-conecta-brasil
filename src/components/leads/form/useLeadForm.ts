
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Lead, Canal, EstagioPipeline } from '@/types/lead';
import { getCanais, getEstagios, createLead, updateLead } from '@/services/leadService';
import { leadFormSchema, LeadFormValues } from './LeadFormSchema';
import { toast } from '@/components/ui/sonner';

export function useLeadForm(lead?: Lead, isEditing = false) {
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
        // Ensure nome is provided as it's required by the database
        if (!data.nome) {
          toast.error('Nome é obrigatório');
          setIsSubmitting(false);
          return;
        }
        
        const newLead = await createLead({ ...data, nome: data.nome }, selectedTags);
        if (newLead) {
          navigate(`/leads/${newLead.id}`);
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    canais,
    estagios,
    isSubmitting,
    selectedTags,
    setSelectedTags,
    onSubmit
  };
}
