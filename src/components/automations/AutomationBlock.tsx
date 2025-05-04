import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  MessageSquare, 
  Users, 
  PipetteIcon,
  ZapIcon, 
  CalendarCheck,
  ArrowRight,
  AlertTriangle,
  Settings,
  Trash2
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Block, BlockCategory, BlockType } from '@/types/automation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DialogFooter } from '@/components/ui/dialog';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AutomationBlockProps {
  block: Block;
  onConfigure: () => void;
  onDelete: () => void;
  onConnect: (fromBlockId: string, toBlockId: string) => void;
}

export const AutomationBlock: React.FC<AutomationBlockProps> = ({
  block,
  onConfigure,
  onDelete,
  onConnect
}) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: block.id,
  });
  
  const [showConfig, setShowConfig] = useState(false);
  
  // Maps block type to human-readable name and icon
  const blockInfo: Record<BlockType, { name: string; icon: React.ReactNode }> = {
    new_lead: { name: 'Novo Lead', icon: <Users size={20} /> },
    lead_moved: { name: 'Lead Movido', icon: <ArrowRight size={20} /> },
    message_received: { name: 'Mensagem Recebida', icon: <MessageSquare size={20} /> },
    lead_status: { name: 'Status do Lead', icon: <AlertTriangle size={20} /> },
    lead_source: { name: 'Canal de Origem', icon: <PipetteIcon size={20} /> },
    value_greater: { name: 'Valor Maior Que', icon: <ArrowRight size={20} /> },
    send_message: { name: 'Enviar Mensagem', icon: <MessageSquare size={20} /> },
    create_task: { name: 'Criar Tarefa', icon: <CalendarCheck size={20} /> },
    move_pipeline: { name: 'Mover no Pipeline', icon: <ZapIcon size={20} /> },
  };

  // Define the block color based on category
  const getBlockColor = () => {
    switch (block.category) {
      case 'trigger':
        return 'bg-blue-100 border-blue-300';
      case 'condition':
        return 'bg-yellow-100 border-yellow-300';
      case 'action':
        return 'bg-green-100 border-green-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  // Fixed TypeScript type issue with position
  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    position: 'absolute' as const, // Cast to literal type
    top: block.position.y,
    left: block.position.x,
    width: '300px',
    zIndex: 10,
  } : {
    position: 'absolute' as const, // Cast to literal type
    top: block.position.y,
    left: block.position.x,
    width: '300px',
  };
  
  const handleSaveConfig = () => {
    setShowConfig(false);
    onConfigure();
  };
  
  const renderConfigForm = () => {
    // Render different forms based on block type
    switch (block.type) {
      case 'new_lead':
        return (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Quando um novo lead é criado</Label>
                <p className="text-sm text-muted-foreground">
                  Esta automação será executada sempre que um novo lead for criado no sistema.
                </p>
              </div>
            </div>
          </>
        );
        
      case 'send_message':
        return (
          <>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="message">Mensagem</Label>
                <Input id="message" placeholder="Olá, {nome}! Bem-vindo à nossa empresa." />
              </div>
              <div className="space-y-2">
                <Label htmlFor="channel">Canal</Label>
                <Select defaultValue="whatsapp">
                  <SelectTrigger id="channel">
                    <SelectValue placeholder="Selecione o canal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="email">E-mail</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </>
        );
        
      // Add more configuration forms for other block types
      default:
        return (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Configuração para {blockInfo[block.type].name}
            </p>
          </div>
        );
    }
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`rounded-md shadow-md ${getBlockColor()} ${!block.configured ? 'border-2 border-dashed border-red-500' : 'border'}`}
        aria-labelledby={`block-title-${block.id}`}
      >
        <div className="p-4">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              {blockInfo[block.type].icon}
              <h3 id={`block-title-${block.id}`} className="font-medium ml-2">
                {blockInfo[block.type].name}
              </h3>
            </div>
            
            <div className="flex space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8" 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowConfig(true);
                      }}
                      aria-label="Configurar bloco"
                    >
                      <Settings size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Configurar</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500 hover:text-red-700" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                      aria-label="Excluir bloco"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Excluir</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <div className="text-sm">
            {block.configured ? 
              <p>Bloco configurado</p> : 
              <p className="text-red-500">Necessita configuração</p>
            }
          </div>
          
          {/* Connection point */}
          {block.category !== 'action' && (
            <div 
              className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-pink-500 rounded-full cursor-pointer hover:bg-pink-700"
              aria-label="Ponto de conexão"
              onClick={(e) => {
                e.stopPropagation();
                // Connection logic would go here
              }}
            />
          )}
          
          {block.category !== 'trigger' && (
            <div 
              className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-700"
              aria-label="Ponto de entrada"
              onClick={(e) => {
                e.stopPropagation();
                // Connection target logic would go here
              }}
            />
          )}
        </div>
      </div>
      
      {/* Configuration Dialog */}
      <Dialog open={showConfig} onOpenChange={setShowConfig}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Configurar {blockInfo[block.type].name}</DialogTitle>
          </DialogHeader>
          
          {renderConfigForm()}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfig(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveConfig}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
