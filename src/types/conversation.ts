export interface Conversation {
  id: string;
  lead_id: string;
  lead_nome: string;
  canal: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Email';
  ultima_mensagem: string;
  horario: string;
  nao_lida: boolean;
  status: 'Aberta' | 'Fechada';
  avatar?: string | null;
  connection_id?: string | null;
  sender_id?: string | null;
  prioridade?: string;
  conexao_id?: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  sender_type: 'user' | 'lead';
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachment?: {
    type: 'image' | 'video' | 'audio' | 'document';
    url: string;
    name?: string; // Added name property
    filename?: string;
    size?: number;
    thumbnail_url?: string;
  } | null;
  canal_id?: string | null;
}

export interface InternalNote {
  id: string;
  conversation_id: string;
  user_id: string;
  user_name: string;
  content: string;
  timestamp: string;
}
