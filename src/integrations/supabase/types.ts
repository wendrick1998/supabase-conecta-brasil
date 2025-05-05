export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      automacoes: {
        Row: {
          atualizado_em: string
          criado_em: string
          id: string
          nome: string
          status: string
          usuario_id: string
          versao: number | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          nome: string
          status: string
          usuario_id: string
          versao?: number | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          id?: string
          nome?: string
          status?: string
          usuario_id?: string
          versao?: number | null
        }
        Relationships: []
      }
      automacoes_versoes: {
        Row: {
          automacao_id: string
          created_at: string
          description: string | null
          id: string
          user_name: string | null
          version: number
        }
        Insert: {
          automacao_id: string
          created_at?: string
          description?: string | null
          id?: string
          user_name?: string | null
          version: number
        }
        Update: {
          automacao_id?: string
          created_at?: string
          description?: string | null
          id?: string
          user_name?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "automacoes_versoes_automacao_id_fkey"
            columns: ["automacao_id"]
            isOneToOne: false
            referencedRelation: "automacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      automacoes_versoes_blocos: {
        Row: {
          bloco_id: string | null
          conteudo_config: Json
          id: string
          tipo: string
          versao_id: string
          x: number
          y: number
        }
        Insert: {
          bloco_id?: string | null
          conteudo_config?: Json
          id?: string
          tipo: string
          versao_id: string
          x: number
          y: number
        }
        Update: {
          bloco_id?: string | null
          conteudo_config?: Json
          id?: string
          tipo?: string
          versao_id?: string
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: "automacoes_versoes_blocos_versao_id_fkey"
            columns: ["versao_id"]
            isOneToOne: false
            referencedRelation: "automacoes_versoes"
            referencedColumns: ["id"]
          },
        ]
      }
      blocos_automacao: {
        Row: {
          automacao_id: string
          conteudo_config: Json
          id: string
          ordem: number
          tipo: string
          x: number
          y: number
        }
        Insert: {
          automacao_id: string
          conteudo_config?: Json
          id?: string
          ordem: number
          tipo: string
          x: number
          y: number
        }
        Update: {
          automacao_id?: string
          conteudo_config?: Json
          id?: string
          ordem?: number
          tipo?: string
          x?: number
          y?: number
        }
        Relationships: [
          {
            foreignKeyName: "blocos_automacao_automacao_id_fkey"
            columns: ["automacao_id"]
            isOneToOne: false
            referencedRelation: "automacoes"
            referencedColumns: ["id"]
          },
        ]
      }
      canais: {
        Row: {
          criado_em: string
          id: string
          nome: string
        }
        Insert: {
          criado_em?: string
          id?: string
          nome: string
        }
        Update: {
          criado_em?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      conexoes_blocos: {
        Row: {
          id: string
          id_destino: string
          id_origem: string
        }
        Insert: {
          id?: string
          id_destino: string
          id_origem: string
        }
        Update: {
          id?: string
          id_destino?: string
          id_origem?: string
        }
        Relationships: [
          {
            foreignKeyName: "conexoes_blocos_id_destino_fkey"
            columns: ["id_destino"]
            isOneToOne: false
            referencedRelation: "blocos_automacao"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conexoes_blocos_id_origem_fkey"
            columns: ["id_origem"]
            isOneToOne: false
            referencedRelation: "blocos_automacao"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          avatar: string | null
          canal: string
          horario: string
          id: string
          lead_id: string | null
          lead_nome: string
          nao_lida: boolean
          status: string
          ultima_mensagem: string
        }
        Insert: {
          avatar?: string | null
          canal: string
          horario?: string
          id?: string
          lead_id?: string | null
          lead_nome: string
          nao_lida?: boolean
          status?: string
          ultima_mensagem: string
        }
        Update: {
          avatar?: string | null
          canal?: string
          horario?: string
          id?: string
          lead_id?: string | null
          lead_nome?: string
          nao_lida?: boolean
          status?: string
          ultima_mensagem?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_conversations_lead"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      estagios_pipeline: {
        Row: {
          cor: string | null
          criado_em: string
          descricao: string | null
          id: string
          nome: string
          ordem: number
        }
        Insert: {
          cor?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          nome: string
          ordem: number
        }
        Update: {
          cor?: string | null
          criado_em?: string
          descricao?: string | null
          id?: string
          nome?: string
          ordem?: number
        }
        Relationships: []
      }
      interacoes: {
        Row: {
          conteudo: string
          criado_em: string
          id: string
          lead_id: string | null
          tipo: string
        }
        Insert: {
          conteudo: string
          criado_em?: string
          id?: string
          lead_id?: string | null
          tipo: string
        }
        Update: {
          conteudo?: string
          criado_em?: string
          id?: string
          lead_id?: string | null
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "interacoes_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      internal_notes: {
        Row: {
          content: string
          conversation_id: string
          id: string
          timestamp: string
          user_id: string
          user_name: string
        }
        Insert: {
          content: string
          conversation_id: string
          id?: string
          timestamp?: string
          user_id: string
          user_name: string
        }
        Update: {
          content?: string
          conversation_id?: string
          id?: string
          timestamp?: string
          user_id?: string
          user_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_internal_notes_conversation"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "internal_notes_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      leads: {
        Row: {
          atualizado_em: string
          canal_id: string | null
          criado_em: string
          email: string | null
          empresa: string | null
          estagio_id: string | null
          id: string
          nome: string
          telefone: string | null
        }
        Insert: {
          atualizado_em?: string
          canal_id?: string | null
          criado_em?: string
          email?: string | null
          empresa?: string | null
          estagio_id?: string | null
          id?: string
          nome: string
          telefone?: string | null
        }
        Update: {
          atualizado_em?: string
          canal_id?: string | null
          criado_em?: string
          email?: string | null
          empresa?: string | null
          estagio_id?: string | null
          id?: string
          nome?: string
          telefone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_canal_id_fkey"
            columns: ["canal_id"]
            isOneToOne: false
            referencedRelation: "canais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_estagio_id_fkey"
            columns: ["estagio_id"]
            isOneToOne: false
            referencedRelation: "estagios_pipeline"
            referencedColumns: ["id"]
          },
        ]
      }
      leads_tags: {
        Row: {
          lead_id: string
          tag_id: string
        }
        Insert: {
          lead_id: string
          tag_id: string
        }
        Update: {
          lead_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_tags_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachment: Json | null
          content: string
          conversation_id: string
          id: string
          sender_type: string
          status: string
          timestamp: string
        }
        Insert: {
          attachment?: Json | null
          content: string
          conversation_id: string
          id?: string
          sender_type: string
          status?: string
          timestamp?: string
        }
        Update: {
          attachment?: Json | null
          content?: string
          conversation_id?: string
          id?: string
          sender_type?: string
          status?: string
          timestamp?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_messages_conversation"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notas: {
        Row: {
          atualizado_em: string
          conteudo: string
          criado_em: string
          id: string
          lead_id: string | null
        }
        Insert: {
          atualizado_em?: string
          conteudo: string
          criado_em?: string
          id?: string
          lead_id?: string | null
        }
        Update: {
          atualizado_em?: string
          conteudo?: string
          criado_em?: string
          id?: string
          lead_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notas_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          cor: string
          criado_em: string
          id: string
          nome: string
        }
        Insert: {
          cor?: string
          criado_em?: string
          id?: string
          nome: string
        }
        Update: {
          cor?: string
          criado_em?: string
          id?: string
          nome?: string
        }
        Relationships: []
      }
      tarefas: {
        Row: {
          atualizado_em: string
          completa: boolean
          criado_em: string
          data_vencimento: string | null
          descricao: string | null
          id: string
          lead_id: string | null
          titulo: string
        }
        Insert: {
          atualizado_em?: string
          completa?: boolean
          criado_em?: string
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          lead_id?: string | null
          titulo: string
        }
        Update: {
          atualizado_em?: string
          completa?: boolean
          criado_em?: string
          data_vencimento?: string | null
          descricao?: string | null
          id?: string
          lead_id?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "tarefas_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      avancar_estagio_lead: {
        Args: { lead_id: string }
        Returns: string
      }
    }
    Enums: {
      conversation_canal:
        | "WhatsApp"
        | "Email"
        | "Telefone"
        | "Facebook"
        | "Instagram"
        | "Site"
      conversation_status: "Aberta" | "Fechada"
      message_sender: "user" | "lead"
      message_status: "sent" | "delivered" | "read"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      conversation_canal: [
        "WhatsApp",
        "Email",
        "Telefone",
        "Facebook",
        "Instagram",
        "Site",
      ],
      conversation_status: ["Aberta", "Fechada"],
      message_sender: ["user", "lead"],
      message_status: ["sent", "delivered", "read"],
    },
  },
} as const
