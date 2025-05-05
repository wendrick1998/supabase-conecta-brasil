
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Check, CalendarClock, MessageSquare } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface TemplatesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (templateId: string) => void;
}

export const TemplatesDialog: React.FC<TemplatesDialogProps> = ({
  open,
  onOpenChange,
  onSelectTemplate,
}) => {
  const templates: Template[] = [
    {
      id: 'welcome',
      name: 'Boas-vindas ao Lead',
      description: 'Envia mensagem automática quando um novo lead é criado',
      icon: <MessageSquare className="h-8 w-8 text-blue-500" />,
      enabled: true,
    },
    {
      id: 'followup',
      name: 'Follow-up para Lead Inativo',
      description: 'Cria tarefa para follow-up quando lead não interagir por 3 dias',
      icon: <CalendarClock className="h-8 w-8 text-orange-500" />,
      enabled: true,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-surface border-vendah-purple/20 text-white">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">Templates de Automação</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {templates.map((template) => (
            <div 
              key={template.id}
              className="p-6 border border-vendah-purple/20 rounded-lg bg-surface/40"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-2 rounded-lg bg-surface border border-white/10">
                    {template.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-white">{template.name}</h3>
                    <p className="text-text-muted mt-1">{template.description}</p>
                  </div>
                </div>
                <Switch
                  checked={template.enabled}
                  className="data-[state=checked]:bg-vendah-neon"
                />
              </div>

              <Button
                onClick={() => onSelectTemplate(template.id)}
                className="w-full mt-4 bg-vendah-purple hover:bg-vendah-purple/90 text-white"
                variant="default"
              >
                <Check className="mr-2 h-4 w-4" />
                Usar Template
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
