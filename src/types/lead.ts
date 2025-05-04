
export interface Lead {
  id: string;
  nome: string;
  email: string | null;
  telefone: string | null;
  empresa: string | null;
  canal_id: string | null;
  estagio_id: string | null;
  criado_em: string;
  atualizado_em: string;
  canal?: Canal;
  estagio?: EstagioPipeline;
  tags?: Tag[];
}

export interface Canal {
  id: string;
  nome: string;
  criado_em: string;
}

export interface EstagioPipeline {
  id: string;
  nome: string;
  ordem: number;
  criado_em: string;
  cor?: string;
  descricao?: string;
}

export interface Tag {
  id: string;
  nome: string;
  cor: string;
  criado_em: string;
}

export interface LeadTag {
  lead_id: string;
  tag_id: string;
}

export interface Nota {
  id: string;
  lead_id: string | null;
  conteudo: string;
  criado_em: string;
  atualizado_em: string;
}

export interface Interacao {
  id: string;
  lead_id: string | null;
  tipo: string;
  conteudo: string;
  criado_em: string;
}

export interface Tarefa {
  id: string;
  lead_id: string | null;
  titulo: string;
  descricao: string | null;
  data_vencimento: string | null;
  completa: boolean;
  criado_em: string;
  atualizado_em: string;
}
