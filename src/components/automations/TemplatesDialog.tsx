
import React, { ReactNode, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Block, AutomationTemplate } from '@/types/automation';
import { 
  MessageSquare, 
  Users, 
  Calendar, 
  Check, 
  Clock, 
  Tag, 
  Star, 
  Bell,
  Zap,
  Mail
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

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
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('todos');

  // Template categories
  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'vendas', name: 'Vendas' },
    { id: 'atendimento', name: 'Atendimento' },
    { id: 'engajamento', name: 'Engajamento' }
  ];

  // Example templates with categories
  const allTemplates: AutomationTemplate[] = [
    {
      id: "1",
      name: "Boas-vindas ao Lead",
      description: "Envia mensagem automática quando um novo lead é criado",
      category: "engajamento",
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
      category: "vendas",
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
      category: "atendimento",
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
    },
    {
      id: "4",
      name: "Notificação de Lead VIP",
      description: "Alerta a equipe quando um lead de alto valor entra no funil",
      category: "vendas",
      blocks: [
        {
          id: "t4-trigger",
          type: "new_lead",
          category: "trigger",
          position: { x: 100, y: 100 },
          configured: true,
          config: {},
          connections: ["t4-condition"]
        },
        {
          id: "t4-condition",
          type: "value_greater",
          category: "condition",
          position: { x: 400, y: 100 },
          configured: true,
          config: {
            amount: 10000
          },
          connections: ["t4-action"]
        },
        {
          id: "t4-action",
          type: "create_task",
          category: "action",
          position: { x: 700, y: 100 },
          configured: true,
          config: {
            title: "Contato prioritário com {nome}",
            dueDate: "hoje",
            priority: "alta"
          },
          connections: []
        }
      ]
    },
    {
      id: "5",
      name: "Recuperação de Lead Perdido",
      description: "Tenta recuperar leads que não responderam após 7 dias",
      category: "engajamento",
      blocks: [
        {
          id: "t5-trigger",
          type: "lead_moved",
          category: "trigger",
          position: { x: 100, y: 100 },
          configured: true,
          config: {
            status: "Perdido"
          },
          connections: ["t5-action1"]
        },
        {
          id: "t5-action1",
          type: "send_message",
          category: "action",
          position: { x: 400, y: 100 },
          configured: true,
          config: {
            message: "Olá {nome}, notamos que faz um tempo desde nosso último contato. Ainda podemos ajudá-lo(a)?",
            channel: "whatsapp"
          },
          connections: []
        }
      ]
    },
    {
      id: "6",
      name: "Qualificação Automática de Leads",
      description: "Categoriza leads automaticamente com base na interação inicial",
      category: "vendas",
      blocks: [
        {
          id: "t6-trigger",
          type: "message_received",
          category: "trigger",
          position: { x: 100, y: 100 },
          configured: true,
          config: {},
          connections: ["t6-condition"]
        },
        {
          id: "t6-condition",
          type: "lead_source",
          category: "condition",
          position: { x: 400, y: 100 },
          configured: true,
          config: {
            source: "Instagram"
          },
          connections: ["t6-action"]
        },
        {
          id: "t6-action",
          type: "move_pipeline",
          category: "action",
          position: { x: 700, y: 100 },
          configured: true,
          config: {
            stage: "Qualificado"
          },
          connections: []
        }
      ]
    },
    {
      id: "7",
      name: "Lembrete de Agendamento",
      description: "Envia lembretes para compromissos marcados com leads",
      category: "atendimento",
      blocks: [
        {
          id: "t7-trigger",
          type: "lead_moved",
          category: "trigger",
          position: { x: 100, y: 100 },
          configured: true,
          config: {
            stage: "Reunião Agendada"
          },
          connections: ["t7-action"]
        },
        {
          id: "t7-action",
          type: "send_message",
          category: "action",
          position: { x: 400, y: 100 },
          configured: true,
          config: {
            message: "Olá {nome}, estamos confirmando nossa reunião para {data_reuniao}. Você confirma sua presença?",
            channel: "whatsapp",
            delay: "1d"
          },
          connections: []
        }
      ]
    },
    {
      id: "8",
      name: "Coletar Feedback pós-venda",
      description: "Solicita avaliação do cliente após a conclusão da venda",
      category: "engajamento",
      blocks: [
        {
          id: "t8-trigger",
          type: "lead_moved",
          category: "trigger",
          position: { x: 100, y: 100 },
          configured: true,
          config: {
            stage: "Cliente"
          },
          connections: ["t8-action"]
        },
        {
          id: "t8-action",
          type: "send_message",
          category: "action",
          position: { x: 400, y: 100 },
          configured: true,
          config: {
            message: "Olá {nome}, agradecemos a confiança! Poderia nos ajudar com um feedback rápido sobre sua experiência?",
            channel: "email",
            delay: "3d"
          },
          connections: []
        }
      ]
    }
  ];

  // Filter templates based on search and active tab
  const filteredTemplates = allTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          template.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'todos' || template.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });

  // Icons for template cards
  const templateIcons: Record<string, React.ReactNode> = {
    "1": <MessageSquare className="h-6 w-6 text-vendah-purple" />,
    "2": <Calendar className="h-6 w-6 text-vendah-purple" />,
    "3": <Users className="h-6 w-6 text-vendah-purple" />,
    "4": <Star className="h-6 w-6 text-vendah-purple" />,
    "5": <Zap className="h-6 w-6 text-vendah-purple" />,
    "6": <Tag className="h-6 w-6 text-vendah-purple" />,
    "7": <Bell className="h-6 w-6 text-vendah-purple" />,
    "8": <Mail className="h-6 w-6 text-vendah-purple" />
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface border-vendah-purple/20 rounded-xl sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">Biblioteca de Automações</DialogTitle>
        </DialogHeader>
        
        {children && (
          <div className="mb-4">
            {children}
          </div>
        )}

        <div className="mb-4">
          <Input
            placeholder="Pesquisar templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-background border-vendah-purple/20"
          />
        </div>
        
        <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-4 bg-background">
            {categories.map(category => (
              <TabsTrigger 
                key={category.id} 
                value={category.id}
                className="data-[state=active]:bg-vendah-purple data-[state=active]:text-white"
              >
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <ScrollArea className="flex-grow h-[500px] pr-2">
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                {filteredTemplates.length === 0 ? (
                  <div className="col-span-2 flex flex-col items-center justify-center p-8">
                    <p className="text-text-muted text-center">
                      Nenhum template encontrado para sua pesquisa.
                    </p>
                  </div>
                ) : (
                  filteredTemplates.map((template) => (
                    <Card key={template.id} className="bg-surface border-vendah-purple/20 hover:border-vendah-purple/40 transition-colors">
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between">
                          {templateIcons[template.id]}
                          <Badge variant="outline" className="bg-background/30 text-white text-xs">
                            {template.blocks.length} blocos
                          </Badge>
                        </div>
                        <CardTitle className="text-lg text-white mt-2">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </CardHeader>
                      <CardFooter className="pt-2">
                        <Button 
                          onClick={() => {
                            onApplyTemplate(template.blocks);
                          }}
                          className="w-full bg-vendah-purple hover:bg-vendah-purple/90 text-white font-medium"
                        >
                          <Check className="mr-2 h-4 w-4" />
                          Usar Template
                        </Button>
                      </CardFooter>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
