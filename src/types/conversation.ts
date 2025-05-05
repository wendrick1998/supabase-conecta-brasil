
export interface Conversation {
  id: string;
  lead_id: string;
  lead_nome: string;
  canal: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Email';
  ultima_mensagem: string;
  horario: string; // ISO date string
  nao_lida: boolean;
  avatar?: string;
  status: 'Aberta' | 'Fechada';
}

export interface Message {
  id: string;
  conversation_id: string;
  content: string;
  timestamp: string; // ISO date string
  sender_type: 'user' | 'lead';
  status: 'sent' | 'delivered' | 'read';
  attachment?: {
    name: string;
    url: string;
    type: string;
  };
}

export interface InternalNote {
  id: string;
  conversation_id: string;
  content: string;
  timestamp: string;
  user_id: string;
  user_name: string;
}
