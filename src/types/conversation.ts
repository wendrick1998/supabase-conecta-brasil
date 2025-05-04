
export interface Conversation {
  id: string;
  lead_id: string;
  lead_nome: string;
  canal: 'WhatsApp' | 'Instagram' | 'Email';
  ultima_mensagem: string;
  horario: string; // ISO date string
  nao_lida: boolean;
  avatar?: string;
  status: 'Aberta' | 'Fechada';
}
