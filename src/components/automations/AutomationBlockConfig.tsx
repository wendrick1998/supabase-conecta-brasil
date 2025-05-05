
import React, { useState, useEffect } from 'react';
import { BlockType, BlockCategory } from '@/types/automation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { AlertCircle, PlusCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface AutomationBlockConfigProps {
  blockType: BlockType;
  blockCategory: BlockCategory;
  initialConfig?: Record<string, any>;
  onUpdateConfig?: (config: Record<string, any>) => void;
}

export const AutomationBlockConfig: React.FC<AutomationBlockConfigProps> = ({ 
  blockType,
  blockCategory,
  initialConfig = {},
  onUpdateConfig
}) => {
  const [config, setConfig] = useState<Record<string, any>>(initialConfig);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Update local config when props change
  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const updateConfig = (key: string, value: any) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    if (onUpdateConfig) {
      onUpdateConfig(newConfig);
    }
  };

  const validateConfig = (): boolean => {
    const errors: string[] = [];
    
    // Common validation based on block type
    switch (blockType) {
      case 'send_message':
        if (!config.channel) errors.push("Selecione um canal");
        if (!config.message) errors.push("Digite uma mensagem");
        break;
      case 'create_task':
        if (!config.description) errors.push("Descrição é obrigatória");
        break;
      case 'move_pipeline':
        if (!config.stage) errors.push("Selecione um estágio");
        break;
      case 'lead_status':
        if (!config.value) errors.push("Valor é obrigatório");
        break;
    }
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Render common fields for trigger blocks
  const renderTriggerFields = () => {
    switch (blockType) {
      case 'new_lead':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="source">Canal de Origem</Label>
              <Select 
                value={config.source || ''} 
                onValueChange={(value) => updateConfig('source', value)}
              >
                <SelectTrigger id="source">
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">Tags (opcional)</Label>
              <Input 
                id="tags" 
                placeholder="Ex: novo, website, interessado" 
                value={config.tags || ''} 
                onChange={(e) => updateConfig('tags', e.target.value)}
              />
              <p className="text-xs text-gray-500">Separe múltiplas tags com vírgula</p>
            </div>
          </div>
        );
        
      case 'lead_moved':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fromStage">Estágio de Origem</Label>
              <Select 
                value={config.fromStage || ''} 
                onValueChange={(value) => updateConfig('fromStage', value)}
              >
                <SelectTrigger id="fromStage">
                  <SelectValue placeholder="Selecione o estágio de origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Qualquer estágio</SelectItem>
                  <SelectItem value="novo">Novo</SelectItem>
                  <SelectItem value="qualificado">Qualificado</SelectItem>
                  <SelectItem value="proposta">Proposta</SelectItem>
                  <SelectItem value="fechado">Fechado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="toStage">Estágio de Destino</Label>
              <Select 
                value={config.toStage || ''} 
                onValueChange={(value) => updateConfig('toStage', value)}
              >
                <SelectTrigger id="toStage">
                  <SelectValue placeholder="Selecione o estágio de destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="qualificado">Qualificado</SelectItem>
                  <SelectItem value="proposta">Proposta</SelectItem>
                  <SelectItem value="fechado">Fechado</SelectItem>
                  <SelectItem value="perdido">Perdido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'message_received':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="channel">Canal</Label>
              <Select 
                value={config.channel || ''} 
                onValueChange={(value) => updateConfig('channel', value)}
              >
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
            
            <div className="space-y-2">
              <Label htmlFor="contains">Contém texto (opcional)</Label>
              <Input 
                id="contains" 
                placeholder="Ex: orçamento, preço" 
                value={config.contains || ''} 
                onChange={(e) => updateConfig('contains', e.target.value)}
              />
              <p className="text-xs text-gray-500">Palavras-chave separadas por vírgula</p>
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-2">
            <Label>Quando um gatilho for acionado</Label>
            <p className="text-sm text-muted-foreground">
              Este bloco será executado quando o evento ocorrer.
            </p>
          </div>
        );
    }
  };

  // Render common fields for condition blocks
  const renderConditionFields = () => {
    switch (blockType) {
      case 'lead_status':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="status-field">Campo</Label>
              <Select 
                value={config.field || 'status'} 
                onValueChange={(value) => updateConfig('field', value)}
              >
                <SelectTrigger id="status-field">
                  <SelectValue placeholder="Selecione o campo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="status">Status</SelectItem>
                  <SelectItem value="source">Origem</SelectItem>
                  <SelectItem value="score">Pontuação</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status-operator">Operador</Label>
              <Select 
                value={config.operator || '='} 
                onValueChange={(value) => updateConfig('operator', value)}
              >
                <SelectTrigger id="status-operator">
                  <SelectValue placeholder="Selecione o operador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="=">É igual a</SelectItem>
                  <SelectItem value="!=">É diferente de</SelectItem>
                  <SelectItem value="contains">Contém</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status-value">Valor</Label>
              <Input 
                id="status-value" 
                placeholder="Ex: Novo, Qualificado" 
                value={config.value || ''} 
                onChange={(e) => updateConfig('value', e.target.value)}
              />
            </div>
          </div>
        );
        
      case 'lead_source':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="source-operator">Operador</Label>
              <Select 
                value={config.operator || '='} 
                onValueChange={(value) => updateConfig('operator', value)}
              >
                <SelectTrigger id="source-operator">
                  <SelectValue placeholder="Selecione o operador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="=">É igual a</SelectItem>
                  <SelectItem value="!=">É diferente de</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="source">Origem</Label>
              <Select 
                value={config.value || ''} 
                onValueChange={(value) => updateConfig('value', value)}
              >
                <SelectTrigger id="source">
                  <SelectValue placeholder="Selecione a origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="website">Website</SelectItem>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        );
        
      case 'value_greater':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="value-field">Campo</Label>
              <Select 
                value={config.field || 'valor'} 
                onValueChange={(value) => updateConfig('field', value)}
              >
                <SelectTrigger id="value-field">
                  <SelectValue placeholder="Selecione o campo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="valor">Valor</SelectItem>
                  <SelectItem value="score">Pontuação</SelectItem>
                  <SelectItem value="idade">Idade</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value-operator">Operador</Label>
              <Select 
                value={config.operator || '>'} 
                onValueChange={(value) => updateConfig('operator', value)}
              >
                <SelectTrigger id="value-operator">
                  <SelectValue placeholder="Selecione o operador" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value=">">Maior que</SelectItem>
                  <SelectItem value="<">Menor que</SelectItem>
                  <SelectItem value=">=">Maior ou igual a</SelectItem>
                  <SelectItem value="<=">Menor ou igual a</SelectItem>
                  <SelectItem value="=">Igual a</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value-number">Valor</Label>
              <Input 
                id="value-number" 
                type="number"
                placeholder="Ex: 1000" 
                value={config.value || ''} 
                onChange={(e) => updateConfig('value', e.target.value)}
              />
            </div>
          </div>
        );
        
      default:
        return (
          <div className="space-y-2">
            <Label>Condição</Label>
            <p className="text-sm text-muted-foreground">
              Este bloco será executado apenas se a condição for verdadeira.
            </p>
          </div>
        );
    }
  };

  // Render common fields for action blocks
  const renderActionFields = () => {
    switch (blockType) {
      case 'send_message':
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="message-channel">Canal</Label>
              <Select 
                value={config.channel || ''} 
                onValueChange={(value) => updateConfig('channel', value)}
              >
                <SelectTrigger id="message-channel">
                  <SelectValue placeholder="Selecione o canal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="whatsapp">WhatsApp</SelectItem>
                  <SelectItem value="email">E-mail</SelectItem>
                  <SelectItem value="sms">SMS</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="template">Template (opcional)</Label>
              <Select 
                value={config.template || ''} 
                onValueChange={(value) => updateConfig('template', value)}
              >
                <SelectTrigger id="template">
                  <SelectValue placeholder="Selecione um template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="boas-vindas">Boas-vindas</SelectItem>
                  <SelectItem value="agradecimento">Agradecimento</SelectItem>
                  <SelectItem value="lembrete">Lembrete</SelectItem>
                  <SelectItem value="proposta">Proposta</SelectItem>
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
                value={config.assignee || ''} 
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
                value={config.stage || ''} 
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

  // Show validation errors if any
  const renderValidationErrors = () => {
    if (validationErrors.length === 0) return null;
    
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <ul className="list-disc pl-5">
            {validationErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </AlertDescription>
      </Alert>
    );
  };

  // Render fields based on block category
  const renderConfigFields = () => {
    switch (blockCategory) {
      case 'trigger':
        return renderTriggerFields();
      case 'condition':
        return renderConditionFields();
      case 'action':
        return renderActionFields();
      default:
        return (
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Configuração para este tipo de bloco
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-4 py-4">
      {renderConfigFields()}
      {renderValidationErrors()}
    </div>
  );
};
