import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MessageSquare, 
  Users, 
  PipetteIcon,
  ZapIcon, 
  CalendarCheck,
  ArrowRight,
  AlertTriangle,
  LayoutGrid,
  PanelLeft
} from 'lucide-react';
import { BlockType } from '@/types/automation';

interface AutomationSidebarProps {
  onShowTemplates: () => void;
  isMobile: boolean;
  onBlockClick: (blockType: string) => void;
}

export const AutomationSidebar: React.FC<AutomationSidebarProps> = ({ 
  onShowTemplates,
  isMobile,
  onBlockClick
}) => {
  const [collapsed, setCollapsed] = useState(isMobile);
  
  // Define block templates
  const triggerBlocks = [
    { id: 'new_lead', label: 'Novo Lead', icon: <Users size={16} />, color: 'bg-blue-100' },
    { id: 'lead_moved', label: 'Lead Movido', icon: <ArrowRight size={16} />, color: 'bg-blue-100' },
    { id: 'message_received', label: 'Mensagem Recebida', icon: <MessageSquare size={16} />, color: 'bg-blue-100' },
  ];
  
  const conditionBlocks = [
    { id: 'lead_status', label: 'Status do Lead', icon: <AlertTriangle size={16} />, color: 'bg-yellow-100' },
    { id: 'lead_source', label: 'Canal de Origem', icon: <PipetteIcon size={16} />, color: 'bg-yellow-100' },
    { id: 'value_greater', label: 'Valor Maior Que', icon: <ArrowRight size={16} />, color: 'bg-yellow-100' },
  ];
  
  const actionBlocks = [
    { id: 'send_message', label: 'Enviar Mensagem', icon: <MessageSquare size={16} />, color: 'bg-green-100' },
    { id: 'create_task', label: 'Criar Tarefa', icon: <CalendarCheck size={16} />, color: 'bg-green-100' },
    { id: 'move_pipeline', label: 'Mover no Pipeline', icon: <ZapIcon size={16} />, color: 'bg-green-100' },
  ];

  const renderBlockTemplates = (blocks: { id: string; label: string; icon: React.ReactNode; color: string }[]) => {
    return blocks.map((block) => (
      <div
        key={block.id}
        id={`template-${block.id}`}
        className={`flex items-center p-3 mb-2 rounded-md shadow-sm border cursor-move ${block.color} hover:shadow-md transition-shadow`}
        draggable
        onClick={() => onBlockClick(block.id)}
      >
        <span className="mr-2">{block.icon}</span>
        {!collapsed && <span className="text-sm font-medium">{block.label}</span>}
      </div>
    ));
  };

  return (
    <div className={`border-r bg-white flex flex-col ${collapsed ? 'w-[60px]' : 'w-[250px]'}`}>
      <div className="p-2 flex justify-end border-b">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setCollapsed(!collapsed)}
          className="h-8 w-8 p-0"
        >
          {collapsed ? <LayoutGrid size={16} /> : <PanelLeft size={16} />}
          <span className="sr-only">{collapsed ? 'Expand' : 'Collapse'}</span>
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-3">
          {collapsed ? (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs text-gray-500 mb-2 text-center">Gatilhos</h4>
                {renderBlockTemplates(triggerBlocks)}
              </div>
              <div>
                <h4 className="text-xs text-gray-500 mb-2 text-center">Condições</h4>
                {renderBlockTemplates(conditionBlocks)}
              </div>
              <div>
                <h4 className="text-xs text-gray-500 mb-2 text-center">Ações</h4>
                {renderBlockTemplates(actionBlocks)}
              </div>
            </div>
          ) : (
            <Tabs defaultValue="triggers">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="triggers">Gatilhos</TabsTrigger>
                <TabsTrigger value="conditions">Condições</TabsTrigger>
                <TabsTrigger value="actions">Ações</TabsTrigger>
              </TabsList>
              
              <TabsContent value="triggers" className="space-y-2">
                <h3 className="font-medium text-sm mb-2">Gatilhos</h3>
                <p className="text-xs text-muted-foreground mb-4">O que inicia a automação</p>
                {renderBlockTemplates(triggerBlocks)}
              </TabsContent>
              
              <TabsContent value="conditions" className="space-y-2">
                <h3 className="font-medium text-sm mb-2">Condições</h3>
                <p className="text-xs text-muted-foreground mb-4">Verificações para seguir o fluxo</p>
                {renderBlockTemplates(conditionBlocks)}
              </TabsContent>
              
              <TabsContent value="actions" className="space-y-2">
                <h3 className="font-medium text-sm mb-2">Ações</h3>
                <p className="text-xs text-muted-foreground mb-4">O que acontece na automação</p>
                {renderBlockTemplates(actionBlocks)}
              </TabsContent>
            </Tabs>
          )}
          
          {!collapsed && (
            <div className="mt-8">
              <Button 
                variant="outline" 
                className="w-full" 
                onClick={onShowTemplates}
              >
                Ver Templates
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
