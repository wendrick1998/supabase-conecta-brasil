import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription,
  CardFooter, 
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { MessageSquare, Users, AlertTriangle, ZapIcon, CalendarCheck, ArrowRight, ArrowLeft, ArrowRightCircle } from 'lucide-react';
import { BlockType, Block } from '@/types/automation';
import { AutomationBlockConfig } from './AutomationBlockConfig';

interface AutomationWizardProps {
  wizardStep: 'trigger' | 'condition' | 'action' | 'connection';
  blocks: Block[];
  hasTrigger: boolean;
  hasCondition: boolean;
  hasAction: boolean;
  onAddBlock: (blockType: BlockType) => void;
  onConfigureBlock: (blockId: string) => void;
  onNextStep: () => void;
  onPrevStep: () => void;
  onCreateConnection: (fromBlockId: string, toBlockId: string) => void;
}

export const AutomationWizard: React.FC<AutomationWizardProps> = ({
  wizardStep,
  blocks,
  hasTrigger,
  hasCondition,
  hasAction,
  onAddBlock,
  onConfigureBlock,
  onNextStep,
  onPrevStep,
  onCreateConnection
}) => {
  const renderBlockOptions = (blockType: 'trigger' | 'condition' | 'action') => {
    const blockOptions = {
      trigger: [
        { id: 'new_lead', label: 'Novo Lead', icon: <Users size={16} /> },
        { id: 'lead_moved', label: 'Lead Movido', icon: <ArrowRight size={16} /> },
        { id: 'message_received', label: 'Mensagem Recebida', icon: <MessageSquare size={16} /> }
      ],
      condition: [
        { id: 'lead_status', label: 'Status do Lead', icon: <AlertTriangle size={16} /> },
        { id: 'lead_source', label: 'Canal de Origem', icon: <ArrowRightCircle size={16} /> },
        { id: 'value_greater', label: 'Valor Maior Que', icon: <ArrowRight size={16} /> }
      ],
      action: [
        { id: 'send_message', label: 'Enviar Mensagem', icon: <MessageSquare size={16} /> },
        { id: 'create_task', label: 'Criar Tarefa', icon: <CalendarCheck size={16} /> },
        { id: 'move_pipeline', label: 'Mover no Pipeline', icon: <ZapIcon size={16} /> }
      ]
    };

    const blockCategory = blockOptions[blockType];
    
    return (
      <div className="grid grid-cols-1 gap-2 mb-4">
        {blockCategory.map(block => (
          <Button
            key={block.id}
            variant="outline"
            className="justify-start h-auto py-3"
            onClick={() => onAddBlock(block.id as BlockType)}
          >
            <span className="mr-2">{block.icon}</span>
            <span>{block.label}</span>
          </Button>
        ))}
      </div>
    );
  };

  const renderExistingBlocks = (category: 'trigger' | 'condition' | 'action') => {
    let filteredBlocks: Block[] = [];
    
    if (category === 'trigger') {
      filteredBlocks = blocks.filter(b => ['new_lead', 'lead_moved', 'message_received'].includes(b.type));
    } else if (category === 'condition') {
      filteredBlocks = blocks.filter(b => ['lead_status', 'lead_source', 'value_greater'].includes(b.type));
    } else if (category === 'action') {
      filteredBlocks = blocks.filter(b => ['send_message', 'create_task', 'move_pipeline'].includes(b.type));
    }
    
    if (filteredBlocks.length === 0) {
      return null;
    }
    
    return (
      <div className="space-y-3 mt-4">
        <h3 className="text-sm font-semibold">Blocos Adicionados:</h3>
        {filteredBlocks.map(block => (
          <Card 
            key={block.id} 
            className={`border-l-4 ${
              block.category === 'trigger' 
                ? 'border-l-blue-500' 
                : block.category === 'condition' 
                  ? 'border-l-amber-500' 
                  : 'border-l-green-500'
            }`}
          >
            <CardHeader className="py-3">
              <CardTitle className="text-base">{getBlockLabel(block.type)}</CardTitle>
            </CardHeader>
            {block.configured && (
              <CardContent className="py-0">
                <div className="text-sm text-muted-foreground">
                  {renderBlockSummary(block)}
                </div>
              </CardContent>
            )}
            <CardFooter className="pt-3 pb-3">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onConfigureBlock(block.id)}
              >
                {block.configured ? 'Editar' : 'Configurar'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  const renderConnectionStep = () => {
    const triggerBlocks = blocks.filter(b => ['new_lead', 'lead_moved', 'message_received'].includes(b.type));
    const conditionBlocks = blocks.filter(b => ['lead_status', 'lead_source', 'value_greater'].includes(b.type));
    const actionBlocks = blocks.filter(b => ['send_message', 'create_task', 'move_pipeline'].includes(b.type));

    // If conditions exist, recommend trigger->condition->action connections
    // Otherwise recommend trigger->action connections
    return (
      <div className="space-y-6">
        <CardDescription>
          Conecte os blocos para definir o fluxo da automação
        </CardDescription>
        
        {conditionBlocks.length > 0 ? (
          <>
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Conectar Gatilho para Condição:</h3>
              {triggerBlocks.map(trigger => (
                <div key={trigger.id} className="pl-4 border-l-2 border-l-blue-500 py-2">
                  <p className="font-medium mb-2">{getBlockLabel(trigger.type)}</p>
                  <div className="pl-6">
                    {conditionBlocks.map(condition => (
                      <Button 
                        key={condition.id}
                        variant="outline"
                        size="sm"
                        className="mb-2 mr-2"
                        onClick={() => onCreateConnection(trigger.id, condition.id)}
                      >
                        → {getBlockLabel(condition.type)}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Conectar Condição para Ação:</h3>
              {conditionBlocks.map(condition => (
                <div key={condition.id} className="pl-4 border-l-2 border-l-amber-500 py-2">
                  <p className="font-medium mb-2">{getBlockLabel(condition.type)}</p>
                  <div className="pl-6">
                    {actionBlocks.map(action => (
                      <Button 
                        key={action.id}
                        variant="outline"
                        size="sm"
                        className="mb-2 mr-2"
                        onClick={() => onCreateConnection(condition.id, action.id)}
                      >
                        → {getBlockLabel(action.type)}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Conectar Gatilho para Ação:</h3>
            {triggerBlocks.map(trigger => (
              <div key={trigger.id} className="pl-4 border-l-2 border-l-blue-500 py-2">
                <p className="font-medium mb-2">{getBlockLabel(trigger.type)}</p>
                <div className="pl-6">
                  {actionBlocks.map(action => (
                    <Button 
                      key={action.id}
                      variant="outline"
                      size="sm"
                      className="mb-2 mr-2"
                      onClick={() => onCreateConnection(trigger.id, action.id)}
                    >
                      → {getBlockLabel(action.type)}
                    </Button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const getBlockLabel = (type: BlockType): string => {
    const labels: Record<BlockType, string> = {
      new_lead: 'Novo Lead',
      lead_moved: 'Lead Movido',
      message_received: 'Mensagem Recebida',
      lead_status: 'Status do Lead',
      lead_source: 'Canal de Origem',
      value_greater: 'Valor Maior Que',
      send_message: 'Enviar Mensagem',
      create_task: 'Criar Tarefa',
      move_pipeline: 'Mover no Pipeline',
    };
    
    return labels[type] || type;
  };

  const renderBlockSummary = (block: Block): React.ReactNode => {
    switch (block.type) {
      case 'send_message':
        return `Mensagem: "${block.config.message?.substring(0, 20)}${block.config.message?.length > 20 ? '...' : ''}"`;
      case 'create_task':
        return `Tarefa: ${block.config.title}`;
      case 'move_pipeline':
        return `Mover para: ${block.config.stageName || 'Estágio definido'}`;
      case 'lead_status':
        return `Status: ${block.config.statusName || 'Status definido'}`;
      default:
        return 'Configurado';
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {wizardStep === 'trigger' && 'Escolha um Gatilho'}
          {wizardStep === 'condition' && 'Defina uma Condição (Opcional)'}
          {wizardStep === 'action' && 'Escolha uma Ação'}
          {wizardStep === 'connection' && 'Conecte os Blocos'}
        </CardTitle>
        <CardDescription>
          {wizardStep === 'trigger' && 'O que vai iniciar sua automação?'}
          {wizardStep === 'condition' && 'Quando esta automação deve executar?'}
          {wizardStep === 'action' && 'O que deve acontecer quando a automação for disparada?'}
          {wizardStep === 'connection' && 'Defina o fluxo de sua automação'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {wizardStep === 'trigger' && !hasTrigger && renderBlockOptions('trigger')}
        {wizardStep === 'condition' && !hasCondition && renderBlockOptions('condition')}
        {wizardStep === 'action' && !hasAction && renderBlockOptions('action')}
        {wizardStep === 'connection' && renderConnectionStep()}
        
        {wizardStep === 'trigger' && renderExistingBlocks('trigger')}
        {wizardStep === 'condition' && renderExistingBlocks('condition')}
        {wizardStep === 'action' && renderExistingBlocks('action')}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onPrevStep}
          disabled={wizardStep === 'trigger'}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>
        
        <Button 
          onClick={onNextStep}
          disabled={(wizardStep === 'trigger' && !hasTrigger) || 
                   (wizardStep === 'action' && !hasAction)}
        >
          Próximo
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};
