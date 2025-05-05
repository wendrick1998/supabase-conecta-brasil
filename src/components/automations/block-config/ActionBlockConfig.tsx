
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlockType } from '@/types/automation';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

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
            <Label htmlFor="message-channel" className="text-white">Canal</Label>
            <Select 
              value={config.channel || 'none'} 
              onValueChange={(value) => updateConfig('channel', value)}
            >
              <SelectTrigger id="message-channel" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o canal" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="none">Selecione um canal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="template" className="text-white">Template (opcional)</Label>
            <Select 
              value={config.template || 'none'} 
              onValueChange={(value) => updateConfig('template', value === 'none' ? '' : value)}
            >
              <SelectTrigger id="template" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione um template" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="boas-vindas">Boas-vindas</SelectItem>
                <SelectItem value="agradecimento">Agradecimento</SelectItem>
                <SelectItem value="lembrete">Lembrete</SelectItem>
                <SelectItem value="proposta">Proposta</SelectItem>
                <SelectItem value="none">Sem template</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message" className="text-white">Mensagem</Label>
            <Textarea 
              id="message" 
              placeholder="Olá, {nome}! Bem-vindo à nossa empresa."
              value={config.message || ''} 
              onChange={(e) => updateConfig('message', e.target.value)}
              className="min-h-[100px] bg-[#202027] border-vendah-purple/40 text-white"
            />
            <p className="text-xs text-gray-400">
              Use {"{nome}"}, {"{email}"}, etc. para incluir dados do lead
            </p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="add_tracking" 
              checked={config.addTracking || false}
              onCheckedChange={(checked) => updateConfig('addTracking', checked)}
            />
            <Label 
              htmlFor="add_tracking" 
              className="text-sm text-white cursor-pointer"
            >
              Adicionar rastreamento de abertura
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 pt-1">
            <Switch 
              id="add_attachment" 
              checked={config.addAttachment || false}
              onCheckedChange={(checked) => updateConfig('addAttachment', checked)}
            />
            <Label 
              htmlFor="add_attachment" 
              className="text-sm text-white cursor-pointer"
            >
              Adicionar anexo
            </Label>
          </div>
          
          {config.addAttachment && (
            <div className="space-y-2 pl-6 border-l-2 border-vendah-purple/30">
              <Label htmlFor="attachment-type" className="text-white">Tipo de anexo</Label>
              <Select 
                value={config.attachmentType || 'file'} 
                onValueChange={(value) => updateConfig('attachmentType', value)}
              >
                <SelectTrigger id="attachment-type" className="bg-[#202027] border-vendah-purple/40 text-white">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-vendah-purple/30">
                  <SelectItem value="file">Arquivo específico</SelectItem>
                  <SelectItem value="proposal">Proposta</SelectItem>
                  <SelectItem value="contract">Contrato</SelectItem>
                </SelectContent>
              </Select>
              
              {config.attachmentType === 'file' && (
                <div className="pt-2">
                  <Label htmlFor="file-url" className="text-white text-sm">URL do arquivo</Label>
                  <Input 
                    id="file-url" 
                    placeholder="https://exemplo.com/arquivo.pdf" 
                    value={config.fileUrl || ''} 
                    onChange={(e) => updateConfig('fileUrl', e.target.value)}
                    className="bg-[#202027] border-vendah-purple/40 text-white mt-1"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      );
      
    case 'create_task':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-white">Título da Tarefa</Label>
            <Input 
              id="title" 
              placeholder="Ex: Ligar para o cliente"
              value={config.title || ''} 
              onChange={(e) => updateConfig('title', e.target.value)}
              className="bg-[#202027] border-vendah-purple/40 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">Descrição</Label>
            <Textarea 
              id="description" 
              placeholder="Ex: Ligar para o cliente para confirmar o pedido"
              value={config.description || ''} 
              onChange={(e) => updateConfig('description', e.target.value)}
              className="min-h-[60px] bg-[#202027] border-vendah-purple/40 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assignee" className="text-white">Responsável</Label>
            <Select 
              value={config.assignee || 'none'} 
              onValueChange={(value) => updateConfig('assignee', value)}
            >
              <SelectTrigger id="assignee" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o responsável" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="current_user">Usuário atual</SelectItem>
                <SelectItem value="lead_owner">Proprietário do lead</SelectItem>
                <SelectItem value="user1">João Silva</SelectItem>
                <SelectItem value="user2">Maria Santos</SelectItem>
                <SelectItem value="none">Selecione um responsável</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="due_days" className="text-white">Prazo (em dias)</Label>
              <Input 
                id="due_days" 
                type="number"
                min="0"
                placeholder="Ex: 3"
                value={config.due_days || ''} 
                onChange={(e) => updateConfig('due_days', e.target.value)}
                className="bg-[#202027] border-vendah-purple/40 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-white">Prioridade</Label>
              <Select 
                value={config.priority || 'medium'} 
                onValueChange={(value) => updateConfig('priority', value)}
              >
                <SelectTrigger id="priority" className="bg-[#202027] border-vendah-purple/40 text-white">
                  <SelectValue placeholder="Selecione a prioridade" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-vendah-purple/30">
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="medium">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white">Tipo de Tarefa</Label>
            <RadioGroup 
              value={config.taskType || 'general'} 
              onValueChange={(value) => updateConfig('taskType', value)}
              className="flex flex-col space-y-2 pt-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="general" id="task-type-general" className="text-vendah-purple" />
                <Label htmlFor="task-type-general" className="text-sm text-white cursor-pointer">Geral</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="call" id="task-type-call" className="text-vendah-purple" />
                <Label htmlFor="task-type-call" className="text-sm text-white cursor-pointer">Ligação</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="meeting" id="task-type-meeting" className="text-vendah-purple" />
                <Label htmlFor="task-type-meeting" className="text-sm text-white cursor-pointer">Reunião</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="followup" id="task-type-followup" className="text-vendah-purple" />
                <Label htmlFor="task-type-followup" className="text-sm text-white cursor-pointer">Acompanhamento</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="send_notification" 
              checked={config.sendNotification || false}
              onCheckedChange={(checked) => updateConfig('sendNotification', checked)}
            />
            <Label 
              htmlFor="send_notification" 
              className="text-sm text-white cursor-pointer"
            >
              Enviar notificação ao responsável
            </Label>
          </div>
        </div>
      );
      
    case 'move_pipeline':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="pipeline" className="text-white">Pipeline</Label>
            <Select 
              value={config.pipeline || 'default'} 
              onValueChange={(value) => updateConfig('pipeline', value)}
            >
              <SelectTrigger id="pipeline" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o pipeline" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="default">Pipeline principal</SelectItem>
                <SelectItem value="support">Suporte</SelectItem>
                <SelectItem value="sales">Vendas</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stage" className="text-white">Estágio</Label>
            <Select 
              value={config.stage || 'none'} 
              onValueChange={(value) => updateConfig('stage', value)}
            >
              <SelectTrigger id="stage" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o estágio" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="qualificado">Qualificado</SelectItem>
                <SelectItem value="proposta">Proposta</SelectItem>
                <SelectItem value="fechado">Fechado</SelectItem>
                <SelectItem value="none">Selecione um estágio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason" className="text-white">Motivo da Movimentação</Label>
            <Input 
              id="reason" 
              placeholder="Ex: Avançando no processo de venda" 
              value={config.reason || ''} 
              onChange={(e) => updateConfig('reason', e.target.value)}
              className="bg-[#202027] border-vendah-purple/40 text-white"
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="update_probability" 
              checked={config.updateProbability || false}
              onCheckedChange={(checked) => updateConfig('updateProbability', checked)}
            />
            <Label 
              htmlFor="update_probability" 
              className="text-sm text-white cursor-pointer"
            >
              Atualizar probabilidade de fechamento
            </Label>
          </div>
          
          {config.updateProbability && (
            <div className="space-y-2 pl-6 border-l-2 border-vendah-purple/30">
              <Label htmlFor="probability" className="text-white">Probabilidade (%)</Label>
              <Input 
                id="probability" 
                type="number"
                min="0"
                max="100"
                placeholder="Ex: 75" 
                value={config.probability || ''} 
                onChange={(e) => updateConfig('probability', e.target.value)}
                className="bg-[#202027] border-vendah-purple/40 text-white"
              />
            </div>
          )}
        </div>
      );
      
    case 'add_tag':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-action" className="text-white">Ação</Label>
            <Select 
              value={config.action || 'add'} 
              onValueChange={(value) => updateConfig('action', value)}
            >
              <SelectTrigger id="tag-action" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione a ação" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="add">Adicionar tag</SelectItem>
                <SelectItem value="remove">Remover tag</SelectItem>
                <SelectItem value="toggle">Alternar tag</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-white">Tags</Label>
            <Input 
              id="tags" 
              placeholder="Ex: vip, interessado, prioritário" 
              value={config.tags || ''} 
              onChange={(e) => updateConfig('tags', e.target.value)}
              className="bg-[#202027] border-vendah-purple/40 text-white"
            />
            <p className="text-xs text-gray-400">Separe múltiplas tags com vírgula</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tag-color" className="text-white">Cor da Tag (para novas)</Label>
            <Select 
              value={config.color || 'blue'} 
              onValueChange={(value) => updateConfig('color', value)}
            >
              <SelectTrigger id="tag-color" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione a cor" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="blue">Azul</SelectItem>
                <SelectItem value="green">Verde</SelectItem>
                <SelectItem value="red">Vermelho</SelectItem>
                <SelectItem value="yellow">Amarelo</SelectItem>
                <SelectItem value="purple">Roxo</SelectItem>
                <SelectItem value="gray">Cinza</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="create_if_missing" 
              checked={config.createIfMissing !== false}
              onCheckedChange={(checked) => updateConfig('createIfMissing', checked)}
            />
            <Label 
              htmlFor="create_if_missing" 
              className="text-sm text-white cursor-pointer"
            >
              Criar tag se não existir
            </Label>
          </div>
        </div>
      );
      
    case 'assign_user':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assignment-type" className="text-white">Método de Atribuição</Label>
            <Select 
              value={config.assignmentType || 'specific'} 
              onValueChange={(value) => updateConfig('assignmentType', value)}
            >
              <SelectTrigger id="assignment-type" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o método" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="specific">Usuário específico</SelectItem>
                <SelectItem value="round_robin">Distribuição rotativa</SelectItem>
                <SelectItem value="balanced">Carga balanceada</SelectItem>
                <SelectItem value="random">Aleatório</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {config.assignmentType === 'specific' && (
            <div className="space-y-2">
              <Label htmlFor="assigned_user" className="text-white">Usuário</Label>
              <Select 
                value={config.assignedUser || 'none'} 
                onValueChange={(value) => updateConfig('assignedUser', value)}
              >
                <SelectTrigger id="assigned_user" className="bg-[#202027] border-vendah-purple/40 text-white">
                  <SelectValue placeholder="Selecione o usuário" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-vendah-purple/30">
                  <SelectItem value="user1">João Silva</SelectItem>
                  <SelectItem value="user2">Maria Santos</SelectItem>
                  <SelectItem value="user3">Pedro Oliveira</SelectItem>
                  <SelectItem value="none">Selecione um usuário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {config.assignmentType !== 'specific' && (
            <div className="space-y-2">
              <Label htmlFor="user_group" className="text-white">Grupo de Usuários</Label>
              <Select 
                value={config.userGroup || 'all'} 
                onValueChange={(value) => updateConfig('userGroup', value)}
              >
                <SelectTrigger id="user_group" className="bg-[#202027] border-vendah-purple/40 text-white">
                  <SelectValue placeholder="Selecione o grupo" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-vendah-purple/30">
                  <SelectItem value="all">Todos os usuários</SelectItem>
                  <SelectItem value="sales">Equipe de Vendas</SelectItem>
                  <SelectItem value="support">Equipe de Suporte</SelectItem>
                  <SelectItem value="admin">Administradores</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="assignment-reason" className="text-white">Motivo da Atribuição</Label>
            <Input 
              id="assignment-reason" 
              placeholder="Ex: Distribuição de leads" 
              value={config.reason || ''} 
              onChange={(e) => updateConfig('reason', e.target.value)}
              className="bg-[#202027] border-vendah-purple/40 text-white"
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="notify_user" 
              checked={config.notifyUser || false}
              onCheckedChange={(checked) => updateConfig('notifyUser', checked)}
            />
            <Label 
              htmlFor="notify_user" 
              className="text-sm text-white cursor-pointer"
            >
              Notificar usuário sobre a atribuição
            </Label>
          </div>
        </div>
      );
      
    case 'send_notification':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notification-type" className="text-white">Tipo de Notificação</Label>
            <Select 
              value={config.notificationType || 'info'} 
              onValueChange={(value) => updateConfig('notificationType', value)}
            >
              <SelectTrigger id="notification-type" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="info">Informação</SelectItem>
                <SelectItem value="warning">Aviso</SelectItem>
                <SelectItem value="alert">Alerta</SelectItem>
                <SelectItem value="success">Sucesso</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notification-title" className="text-white">Título</Label>
            <Input 
              id="notification-title" 
              placeholder="Ex: Novo lead criado" 
              value={config.title || ''} 
              onChange={(e) => updateConfig('title', e.target.value)}
              className="bg-[#202027] border-vendah-purple/40 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notification-message" className="text-white">Mensagem</Label>
            <Textarea 
              id="notification-message" 
              placeholder="Ex: Um novo lead foi criado e precisa da sua atenção."
              value={config.message || ''} 
              onChange={(e) => updateConfig('message', e.target.value)}
              className="min-h-[60px] bg-[#202027] border-vendah-purple/40 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notification-recipients" className="text-white">Destinatários</Label>
            <Select 
              value={config.recipients || 'all'} 
              onValueChange={(value) => updateConfig('recipients', value)}
            >
              <SelectTrigger id="notification-recipients" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione os destinatários" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="all">Todos os usuários</SelectItem>
                <SelectItem value="lead_owner">Proprietário do lead</SelectItem>
                <SelectItem value="sales">Equipe de vendas</SelectItem>
                <SelectItem value="admin">Administradores</SelectItem>
                <SelectItem value="specific">Usuário específico</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {config.recipients === 'specific' && (
            <div className="space-y-2 pl-6 border-l-2 border-vendah-purple/30">
              <Label htmlFor="specific-user" className="text-white">Usuário Específico</Label>
              <Select 
                value={config.specificUser || 'none'} 
                onValueChange={(value) => updateConfig('specificUser', value)}
              >
                <SelectTrigger id="specific-user" className="bg-[#202027] border-vendah-purple/40 text-white">
                  <SelectValue placeholder="Selecione o usuário" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-vendah-purple/30">
                  <SelectItem value="user1">João Silva</SelectItem>
                  <SelectItem value="user2">Maria Santos</SelectItem>
                  <SelectItem value="user3">Pedro Oliveira</SelectItem>
                  <SelectItem value="none">Selecione um usuário</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="include_link" 
              checked={config.includeLink || false}
              onCheckedChange={(checked) => updateConfig('includeLink', checked)}
            />
            <Label 
              htmlFor="include_link" 
              className="text-sm text-white cursor-pointer"
            >
              Incluir link para o lead
            </Label>
          </div>
          
          <div className="flex items-center space-x-2 pt-1">
            <Switch 
              id="priority_high" 
              checked={config.highPriority || false}
              onCheckedChange={(checked) => updateConfig('highPriority', checked)}
            />
            <Label 
              htmlFor="priority_high" 
              className="text-sm text-white cursor-pointer"
            >
              Prioridade alta
            </Label>
          </div>
        </div>
      );
      
    default:
      return (
        <div className="space-y-2">
          <Label className="text-white">Ação</Label>
          <p className="text-sm text-muted-foreground">
            Configure os detalhes desta ação.
          </p>
        </div>
      );
  }
};
