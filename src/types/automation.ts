
export type BlockCategory = 'trigger' | 'condition' | 'action';

export type BlockType = 
  // Trigger types
  | 'new_lead'
  | 'lead_moved'
  | 'message_received'
  // Condition types
  | 'lead_status'
  | 'lead_source'
  | 'value_greater'
  // Action types
  | 'send_message'
  | 'create_task'
  | 'move_pipeline';

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
  category?: string; // Add category field
  blocks: Block[];
}
