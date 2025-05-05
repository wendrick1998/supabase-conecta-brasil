
export type BlockCategory = 'trigger' | 'condition' | 'action';

export type BlockType = 
  // Trigger types
  | 'new_lead'
  | 'lead_moved'
  | 'message_received'
  | 'form_submitted'
  | 'schedule_triggered'
  // Condition types
  | 'lead_status'
  | 'lead_source'
  | 'value_greater'
  | 'has_tag'
  | 'date_condition'
  // Action types
  | 'send_message'
  | 'create_task'
  | 'move_pipeline'
  | 'add_tag'
  | 'assign_user'
  | 'send_notification';

export interface Block {
  id: string;
  type: BlockType;
  category: BlockCategory;
  position: {
    x: number;
    y: number;
  };
  configured: boolean;
  config: Record<string, any>;
  connections: string[]; // IDs of connected blocks
}

export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category?: string;
  blocks: Block[];
}

export interface TestResult {
  blockId: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}

export interface BlockAccessibility {
  ariaLabel?: string;
  description?: string;
  shortcutKey?: string;
  focusable?: boolean;
  role?: string;
  status?: 'configured' | 'unconfigured' | 'error';
  channelType?: 'whatsapp' | 'instagram' | 'facebook' | 'email' | 'all';
}
