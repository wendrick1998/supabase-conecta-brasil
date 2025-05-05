
import React, { ReactNode } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Block, AutomationTemplate } from '@/types/automation';
import { MessageSquare, Users, Calendar, Check } from 'lucide-react';

interface TemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyTemplate: (blocks: Block[]) => void;
  children?: ReactNode;
}

export const TemplatesDialog: React.FC<TemplatesDialogProps> = ({
  open,
  onOpenChange,
  onApplyTemplate,
  children
}) => {
  // Example templates
  const templates: AutomationTemplate[] = [
    {
      id: "1",
      name: "Boas-vindas ao Lead",
      description: "Envia mensagem automática quando um novo lead é criado",
      blocks: [
        {
          id: "t1-trigger",
          type: "new_lead",
          category: "trigger",
          position: { x: 100, y: 100 },
          configured: true,
          config: {},
          connections: ["t1-action"]
        },
        {
          id: "t1-action",
          type: "send_message",
          category: "action",
          position: { x: 400, y: 100 },
          configured: true,
          config: {
            message: "Olá {nome}, bem-vindo! Como podemos te ajudar hoje?",
            channel: "whatsapp"
          },
          connections: []
        }
      ]
    },
    {
      id: "2",
      name: "Follow-up para Lead Inativo",
      description: "Cria tarefa para follow-up quando lead não interagir por 3 dias",
      blocks: [
        {
          id: "t2-trigger",
          type: "lead_moved",
          category: "trigger",
          position: { x: 100, y: 100 },
          configured: true,
          config: {},
          connections: ["t2-condition"]
        },
        {
          id: "t2-condition",
          type: "lead_status",
          category: "condition",
          position: { x: 400, y: 100 },
          configured: true,
          config: {
            status: "Qualificado"
          },
          connections: ["t2-action"]
        },
        {
          id: "t2-action",
          type: "create_task",
          category: "action",
          position: { x: 700, y: 100 },
          configured: true,
          config: {
            title: "Follow-up com {nome}",
            dueDate: "+3d"
          },
          connections: []
        }
      ]
    },
    {
      id: "3",
      name: "Resposta Automática a Mensagens",
      description: "Responde automaticamente mensagens recebidas fora do horário comercial",
      blocks: [
        {
          id: "t3-trigger",
          type: "message_received",
          category: "trigger",
          position: { x: 100, y: 100 },
          configured: true,
          config: {},
          connections: ["t3-action"]
        },
        {
          id: "t3-action",
          type: "send_message",
          category: "action",
          position: { x: 400, y: 100 },
          configured: true,
          config: {
            message: "Obrigado pelo contato! Nossa equipe retornará no próximo dia útil.",
            channel: "auto"
          },
          connections: []
        }
      ]
    }
  ];

  // Icons for template cards
  const templateIcons: Record<string, React.ReactNode> = {
    "1": <MessageSquare className="h-6 w-6 text-blue-500" />,
    "2": <Calendar className="h-6 w-6 text-amber-500" />,
    "3": <Users className="h-6 w-6 text-purple-500" />
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Templates de Automação</DialogTitle>
        </DialogHeader>
        
        {children && (
          <div className="mb-4">
            {children}
          </div>
        )}
        
        <ScrollArea className="h-[500px] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {templates.map((template) => (
              <Card key={template.id} className="border hover:border-pink-200 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    {templateIcons[template.id]}
                    <div className="bg-gray-100 text-xs font-medium rounded-full px-2 py-1">
                      {template.blocks.length} blocos
                    </div>
                  </div>
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button 
                    onClick={() => {
                      onApplyTemplate(template.blocks);
                    }}
                    className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Usar Template
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
