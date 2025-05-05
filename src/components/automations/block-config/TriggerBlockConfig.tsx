
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BlockType } from '@/types/automation';
import { Switch } from '@/components/ui/switch';
import { FormInput } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

interface TriggerBlockConfigProps {
  blockType: BlockType;
  config: Record<string, any>;
  updateConfig: (key: string, value: any) => void;
}

export const TriggerBlockConfig: React.FC<TriggerBlockConfigProps> = ({ 
  blockType,
  config,
  updateConfig
}) => {
  switch (blockType) {
    case 'new_lead':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source" className="text-white">Canal de Origem</Label>
            <Select 
              value={config.source || 'none'} 
              onValueChange={(value) => updateConfig('source', value)}
            >
              <SelectTrigger id="source" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione a origem" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="website">Website</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="instagram">Instagram</SelectItem>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="none">Sem origem específica</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-white">Tags (opcional)</Label>
            <Input 
              id="tags" 
              placeholder="Ex: novo, website, interessado" 
              value={config.tags || ''} 
              onChange={(e) => updateConfig('tags', e.target.value)}
              className="bg-[#202027] border-vendah-purple/40 text-white"
            />
            <p className="text-xs text-gray-400">Separe múltiplas tags com vírgula</p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="notify_new_lead" 
              checked={config.notifyOnCreation || false}
              onCheckedChange={(checked) => updateConfig('notifyOnCreation', checked)}
            />
            <Label 
              htmlFor="notify_new_lead" 
              className="text-sm text-white cursor-pointer"
            >
              Notificar equipe na criação
            </Label>
          </div>
        </div>
      );
      
    case 'lead_moved':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fromStage" className="text-white">Estágio de Origem</Label>
            <Select 
              value={config.fromStage || 'any'} 
              onValueChange={(value) => updateConfig('fromStage', value)}
            >
              <SelectTrigger id="fromStage" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o estágio de origem" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="any">Qualquer estágio</SelectItem>
                <SelectItem value="novo">Novo</SelectItem>
                <SelectItem value="qualificado">Qualificado</SelectItem>
                <SelectItem value="proposta">Proposta</SelectItem>
                <SelectItem value="fechado">Fechado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="toStage" className="text-white">Estágio de Destino</Label>
            <Select 
              value={config.toStage || 'none'} 
              onValueChange={(value) => updateConfig('toStage', value)}
            >
              <SelectTrigger id="toStage" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o estágio de destino" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="qualificado">Qualificado</SelectItem>
                <SelectItem value="proposta">Proposta</SelectItem>
                <SelectItem value="fechado">Fechado</SelectItem>
                <SelectItem value="perdido">Perdido</SelectItem>
                <SelectItem value="none">Selecione um estágio</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="log_stage_change" 
              checked={config.logStageChange || false}
              onCheckedChange={(checked) => updateConfig('logStageChange', checked)}
            />
            <Label 
              htmlFor="log_stage_change" 
              className="text-sm text-white cursor-pointer"
            >
              Registrar mudança no histórico do lead
            </Label>
          </div>
        </div>
      );
      
    case 'message_received':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="channel" className="text-white">Canal</Label>
            <Select 
              value={config.channel || 'any'} 
              onValueChange={(value) => updateConfig('channel', value)}
            >
              <SelectTrigger id="channel" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o canal" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="sms">SMS</SelectItem>
                <SelectItem value="any">Qualquer canal</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="contains" className="text-white">Contém texto (opcional)</Label>
            <Input 
              id="contains" 
              placeholder="Ex: orçamento, preço" 
              value={config.contains || ''} 
              onChange={(e) => updateConfig('contains', e.target.value)}
              className="bg-[#202027] border-vendah-purple/40 text-white"
            />
            <p className="text-xs text-gray-400">Palavras-chave separadas por vírgula</p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="auto_reply" 
              checked={config.autoReply || false}
              onCheckedChange={(checked) => updateConfig('autoReply', checked)}
            />
            <Label 
              htmlFor="auto_reply" 
              className="text-sm text-white cursor-pointer"
            >
              Resposta automática
            </Label>
          </div>
          
          {config.autoReply && (
            <div className="space-y-2 pl-6 border-l-2 border-vendah-purple/30">
              <Label htmlFor="reply_message" className="text-white">Mensagem de resposta</Label>
              <Textarea 
                id="reply_message" 
                placeholder="Obrigado por sua mensagem. Responderemos em breve." 
                value={config.replyMessage || ''} 
                onChange={(e) => updateConfig('replyMessage', e.target.value)}
                className="bg-[#202027] border-vendah-purple/40 text-white min-h-[80px]"
              />
            </div>
          )}
        </div>
      );
      
    case 'form_submitted':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="form_id" className="text-white">Identificador do Formulário</Label>
            <Select 
              value={config.formId || 'any'} 
              onValueChange={(value) => updateConfig('formId', value)}
            >
              <SelectTrigger id="form_id" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o formulário" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="contact">Formulário de Contato</SelectItem>
                <SelectItem value="newsletter">Inscrição Newsletter</SelectItem>
                <SelectItem value="quote">Solicitação de Orçamento</SelectItem>
                <SelectItem value="any">Qualquer formulário</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white">Campos Obrigatórios</Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="req_name" 
                  checked={config.requiredName || false}
                  onCheckedChange={(checked) => updateConfig('requiredName', checked)}
                />
                <Label htmlFor="req_name" className="text-sm text-white cursor-pointer">Nome</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="req_email" 
                  checked={config.requiredEmail || false}
                  onCheckedChange={(checked) => updateConfig('requiredEmail', checked)}
                />
                <Label htmlFor="req_email" className="text-sm text-white cursor-pointer">Email</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="req_phone" 
                  checked={config.requiredPhone || false}
                  onCheckedChange={(checked) => updateConfig('requiredPhone', checked)}
                />
                <Label htmlFor="req_phone" className="text-sm text-white cursor-pointer">Telefone</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="req_company" 
                  checked={config.requiredCompany || false}
                  onCheckedChange={(checked) => updateConfig('requiredCompany', checked)}
                />
                <Label htmlFor="req_company" className="text-sm text-white cursor-pointer">Empresa</Label>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="create_lead" 
              checked={config.createLead !== false}
              onCheckedChange={(checked) => updateConfig('createLead', checked)}
            />
            <Label 
              htmlFor="create_lead" 
              className="text-sm text-white cursor-pointer"
            >
              Criar lead automaticamente
            </Label>
          </div>
        </div>
      );
    
    case 'schedule_triggered':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="frequency" className="text-white">Frequência</Label>
            <Select 
              value={config.frequency || 'daily'} 
              onValueChange={(value) => updateConfig('frequency', value)}
            >
              <SelectTrigger id="frequency" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione a frequência" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="daily">Diariamente</SelectItem>
                <SelectItem value="weekly">Semanalmente</SelectItem>
                <SelectItem value="monthly">Mensalmente</SelectItem>
                <SelectItem value="once">Uma vez</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {config.frequency === 'weekly' && (
            <div className="space-y-2">
              <Label htmlFor="weekday" className="text-white">Dia da Semana</Label>
              <Select 
                value={config.weekday || 'monday'} 
                onValueChange={(value) => updateConfig('weekday', value)}
              >
                <SelectTrigger id="weekday" className="bg-[#202027] border-vendah-purple/40 text-white">
                  <SelectValue placeholder="Selecione o dia" />
                </SelectTrigger>
                <SelectContent className="bg-surface border-vendah-purple/30">
                  <SelectItem value="monday">Segunda-feira</SelectItem>
                  <SelectItem value="tuesday">Terça-feira</SelectItem>
                  <SelectItem value="wednesday">Quarta-feira</SelectItem>
                  <SelectItem value="thursday">Quinta-feira</SelectItem>
                  <SelectItem value="friday">Sexta-feira</SelectItem>
                  <SelectItem value="saturday">Sábado</SelectItem>
                  <SelectItem value="sunday">Domingo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
          
          {config.frequency === 'monthly' && (
            <div className="space-y-2">
              <Label htmlFor="monthday" className="text-white">Dia do Mês</Label>
              <Input 
                id="monthday" 
                type="number"
                min="1"
                max="31"
                placeholder="1-31" 
                value={config.monthday || ''} 
                onChange={(e) => updateConfig('monthday', e.target.value)}
                className="bg-[#202027] border-vendah-purple/40 text-white"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="time" className="text-white">Horário</Label>
            <Input 
              id="time" 
              type="time"
              value={config.time || '08:00'} 
              onChange={(e) => updateConfig('time', e.target.value)}
              className="bg-[#202027] border-vendah-purple/40 text-white"
            />
          </div>
          
          {config.frequency === 'once' && (
            <div className="space-y-2">
              <Label htmlFor="date" className="text-white">Data</Label>
              <Input 
                id="date" 
                type="date"
                value={config.date || ''} 
                onChange={(e) => updateConfig('date', e.target.value)}
                className="bg-[#202027] border-vendah-purple/40 text-white"
              />
            </div>
          )}
        </div>
      );
      
    default:
      return (
        <div className="space-y-2">
          <Label className="text-white">Quando um gatilho for acionado</Label>
          <p className="text-sm text-muted-foreground">
            Este bloco será executado quando o evento ocorrer.
          </p>
        </div>
      );
  }
};
