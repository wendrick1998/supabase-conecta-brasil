
import { z } from 'zod';

// Esquema de validação
export const leadFormSchema = z.object({
  nome: z.string().min(2, { message: 'Nome é obrigatório e deve ter pelo menos 2 caracteres' }),
  email: z.string().email({ message: 'E-mail inválido' }).nullable().optional(),
  telefone: z.string().nullable().optional(),
  empresa: z.string().nullable().optional(),
  canal_id: z.string().nullable().optional(),
  estagio_id: z.string().nullable().optional(),
});

export type LeadFormValues = z.infer<typeof leadFormSchema>;
