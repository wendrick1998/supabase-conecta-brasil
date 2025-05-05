
-- Create a table to track automation executions
CREATE TABLE IF NOT EXISTS public.automacao_execucoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automacao_id UUID NOT NULL REFERENCES public.automacoes(id),
  lead_id UUID REFERENCES public.leads(id),
  status TEXT NOT NULL CHECK (status IN ('concluída', 'falha', 'em_andamento')),
  detalhes JSONB,
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_automacao_execucoes_automacao_id ON public.automacao_execucoes(automacao_id);
CREATE INDEX IF NOT EXISTS idx_automacao_execucoes_lead_id ON public.automacao_execucoes(lead_id);

-- Add field to automacoes table for version control if it doesn't exist
ALTER TABLE public.automacoes ADD COLUMN IF NOT EXISTS versao INTEGER DEFAULT 1;

-- Add field to track if automacoes table has automacoes_blocos connection already executed
ALTER TABLE public.conexoes_blocos ADD COLUMN IF NOT EXISTS automacao_id UUID REFERENCES public.automacoes(id);

-- Add column to record the last time an automation was executed
ALTER TABLE public.automacoes ADD COLUMN IF NOT EXISTS ultima_execucao TIMESTAMP WITH TIME ZONE;

-- Add error count to automacoes table
ALTER TABLE public.automacoes ADD COLUMN IF NOT EXISTS erros INTEGER DEFAULT 0;

-- Create function to update automation error count
CREATE OR REPLACE FUNCTION public.update_automacao_error_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'falha' THEN
    UPDATE public.automacoes
    SET erros = erros + 1
    WHERE id = NEW.automacao_id;
  END IF;
  
  UPDATE public.automacoes
  SET ultima_execucao = NOW()
  WHERE id = NEW.automacao_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update error count on automation execution
CREATE TRIGGER trgr_update_automacao_error_count
AFTER INSERT ON public.automacao_execucoes
FOR EACH ROW
EXECUTE FUNCTION public.update_automacao_error_count();
