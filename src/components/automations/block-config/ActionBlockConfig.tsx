
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlockType } from '@/types/automation';

interface ActionBlockConfigProps {
  blockType: BlockType;
  config: Record<string, any>;
  updateConfig: (key: string, value: any) => void;
}

export const ActionBlockConfig: React.FC<ActionBlockConfigProps> = ({ 
  blockType,
  config,
  updateConfig
}) => {
  switch (blockType) {
    case 'send_message':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message-channel">Canal</Label>
            <Select 
              value={config.channel || 'none'} 
              onValueChange={(value) => updateConfig('channel', value)}
            >
              <SelectTrigger id="message-channel">
                <SelectValue placeholder="Selecione o canal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="none">Selecione um canal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template">Template (opcional)</Label>
            <Select 
              value={config.template || 'none'} 
              onValueChange={(value) => updateConfig('template', value === 'none' ? '' : value)}
            >
              <SelectTrigger id="template">
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="boas-vindas">Boas-vindas</SelectItem>
                <SelectItem value="agradecimento">Agradecimento</SelectItem>
                <SelectItem value="lembrete">Lembrete</SelectItem>
                <SelectItem value="proposta">Proposta</SelectItem>
                <SelectItem value="none">Sem template</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Textarea 
              id="message" 
              placeholder="Olá, {nome}! Bem-vindo à nossa empresa."
              value={config.message || ''} 
              onChange={(e) => updateConfig('message', e.target.value)}
              className="min-h-[100px]"
            />
            <p className="text-xs text-gray-500">
              Use {"{nome}"}, {"{email}"}, etc. para incluir dados do lead
            </p>
          </div>
        </div>
      );
      
    case 'create_task':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="description">Descrição da Tarefa</Label>
            <Input 
              id="description" 
              placeholder="Ex: Ligar para o cliente"
              value={config.description || ''} 
              onChange={(e) => updateConfig('description', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assignee">Responsável</Label>
            <Select 
              value={config.assignee || 'none'} 
              onValueChange={(value) => updateConfig('assignee', value)}
            >
              <SelectTrigger id="assignee">
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current_user">Usuário atual</SelectItem>
                <SelectItem value="lead_owner">Proprietário do lead</SelectItem>
                <SelectItem value="user1">João Silva</SelectItem>
                <SelectItem value="user2">Maria Santos</SelectItem>
                <SelectItem value="none">Selecione um responsável</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="due_days">Prazo (em dias)</Label>
            <Input 
              id="due_days" 
              type="number"
              min="0"
              placeholder="Ex: 3"
              value={config.due_days || ''} 
              onChange={(e) => updateConfig('due_days', e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Prioridade</Label>
            <Select 
              value={config.priority || 'medium'} 
              onValueChange={(value) => updateConfig('priority', value)}
            >
              <SelectTrigger id="priority">
                <SelectValue placeholder="Selecione a prioridade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Baixa</SelectItem>
                <SelectItem value="medium">Média</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
      
    case 'move_pipeline':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pipeline">Pipeline</Label>
            <Select 
              value={config.pipeline || 'default'} 
              onValueChange={(value) => updateConfig('pipeline', value)}
            >
              <SelectTrigger id="pipeline">
                <SelectValue placeholder="Selecione o pipeline" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Pipeline principal</SelectItem>
                <SelectItem value="support">Suporte</SelectItem>
                <SelectItem value="sales">Vendas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stage">Estágio</Label>
            <Select 
              value={config.stage || 'none'} 
              onValueChange={(value) => updateConfig('stage', value)}
            >
              <SelectTrigger id="stage">
                <SelectValue placeholder="Selecione o estágio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="qualificado">Qualificado</SelectItem>
                <SelectItem value="proposta">Proposta</SelectItem>
                <SelectItem value="fechado">Fechado</SelectItem>
                <SelectItem value="none">Selecione um estágio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      );
      
    default:
      return (
        <div className="space-y-2">
          <Label>Ação</Label>
          <p className="text-sm text-muted-foreground">
            Configure os detalhes desta ação.
          </p>
        </div>
      );
  }
};
