
import { BlockType, BlockCategory } from '@/types/automation';

export interface BlockConfigProps {
  blockType: BlockType;
  blockCategory: BlockCategory;
  initialConfig?: Record<string, any>;
  onUpdateConfig?: (config: Record<string, any>) => void;
}
