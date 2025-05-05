
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { BlockType } from '@/types/automation';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface ConditionBlockConfigProps {
  blockType: BlockType;
  config: Record<string, any>;
  updateConfig: (key: string, value: any) => void;
}

export const ConditionBlockConfig: React.FC<ConditionBlockConfigProps> = ({ 
  blockType,
  config,
  updateConfig
}) => {
  switch (blockType) {
    case 'lead_status':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status-field" className="text-white">Campo</Label>
            <Select 
              value={config.field || 'status'} 
              onValueChange={(value) => updateConfig('field', value)}
            >
              <SelectTrigger id="status-field" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o campo" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="status">Status</SelectItem>
                <SelectItem value="source">Origem</SelectItem>
                <SelectItem value="score">Pontuação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status-operator" className="text-white">Operador</Label>
            <Select 
              value={config.operator || 'equals'} 
              onValueChange={(value) => updateConfig('operator', value)}
            >
              <SelectTrigger id="status-operator" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o operador" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="equals">É igual a</SelectItem>
                <SelectItem value="notEqual">É diferente de</SelectItem>
                <SelectItem value="contains">Contém</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status-value" className="text-white">Valor</Label>
            <Input 
              id="status-value" 
              placeholder="Ex: Novo, Qualificado" 
              value={config.value || ''} 
              onChange={(e) => updateConfig('value', e.target.value)}
              className="bg-[#202027] border-vendah-purple/40 text-white"
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="case_sensitive" 
              checked={config.caseSensitive || false}
              onCheckedChange={(checked) => updateConfig('caseSensitive', checked)}
            />
            <Label 
              htmlFor="case_sensitive" 
              className="text-sm text-white cursor-pointer"
            >
              Diferenciar maiúsculas e minúsculas
            </Label>
          </div>
        </div>
      );
      
    case 'lead_source':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="source-operator" className="text-white">Operador</Label>
            <Select 
              value={config.operator || 'equals'} 
              onValueChange={(value) => updateConfig('operator', value)}
            >
              <SelectTrigger id="source-operator" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o operador" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="equals">É igual a</SelectItem>
                <SelectItem value="notEqual">É diferente de</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="source" className="text-white">Origem</Label>
            <Select 
              value={config.value || 'none'} 
              onValueChange={(value) => updateConfig('value', value)}
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
                <SelectItem value="none">Selecione uma origem</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label className="text-white">Origem é rastreável?</Label>
            <RadioGroup 
              value={config.trackable || 'any'} 
              onValueChange={(value) => updateConfig('trackable', value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="trackable-yes" className="text-vendah-purple" />
                <Label htmlFor="trackable-yes" className="text-sm text-white cursor-pointer">Sim</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="trackable-no" className="text-vendah-purple" />
                <Label htmlFor="trackable-no" className="text-sm text-white cursor-pointer">Não</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="any" id="trackable-any" className="text-vendah-purple" />
                <Label htmlFor="trackable-any" className="text-sm text-white cursor-pointer">Indiferente</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      );
      
    case 'value_greater':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="value-field" className="text-white">Campo</Label>
            <Select 
              value={config.field || 'valor'} 
              onValueChange={(value) => updateConfig('field', value)}
            >
              <SelectTrigger id="value-field" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o campo" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="valor">Valor</SelectItem>
                <SelectItem value="score">Pontuação</SelectItem>
                <SelectItem value="idade">Idade</SelectItem>
                <SelectItem value="oportunidades">Número de oportunidades</SelectItem>
                <SelectItem value="interacoes">Número de interações</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="value-operator" className="text-white">Operador</Label>
            <Select 
              value={config.operator || 'greater'} 
              onValueChange={(value) => updateConfig('operator', value)}
            >
              <SelectTrigger id="value-operator" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o operador" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="greater">Maior que</SelectItem>
                <SelectItem value="less">Menor que</SelectItem>
                <SelectItem value="greaterEqual">Maior ou igual a</SelectItem>
                <SelectItem value="lessEqual">Menor ou igual a</SelectItem>
                <SelectItem value="equal">Igual a</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="value-number" className="text-white">Valor</Label>
            <Input 
              id="value-number" 
              type="number"
              placeholder="Ex: 1000" 
              value={config.value || ''} 
              onChange={(e) => updateConfig('value', e.target.value)}
              className="bg-[#202027] border-vendah-purple/40 text-white"
            />
          </div>
          
          {(config.field === 'valor' || config.field === 'score') && (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox 
                id="enable_threshold" 
                checked={config.enableThreshold || false}
                onCheckedChange={(checked) => updateConfig('enableThreshold', checked)}
              />
              <Label 
                htmlFor="enable_threshold" 
                className="text-sm text-white cursor-pointer"
              >
                Definir limites de alerta
              </Label>
            </div>
          )}
          
          {config.enableThreshold && (
            <div className="space-y-2 pl-6 border-l-2 border-vendah-purple/30">
              <Label htmlFor="threshold" className="text-white">Valor do limite</Label>
              <Input 
                id="threshold" 
                type="number"
                placeholder="Ex: 500" 
                value={config.threshold || ''} 
                onChange={(e) => updateConfig('threshold', e.target.value)}
                className="bg-[#202027] border-vendah-purple/40 text-white"
              />
            </div>
          )}
        </div>
      );
      
    case 'has_tag':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tag-operator" className="text-white">Operador</Label>
            <Select 
              value={config.operator || 'has'} 
              onValueChange={(value) => updateConfig('operator', value)}
            >
              <SelectTrigger id="tag-operator" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o operador" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="has">Possui a tag</SelectItem>
                <SelectItem value="hasNot">Não possui a tag</SelectItem>
                <SelectItem value="hasAny">Possui qualquer uma das tags</SelectItem>
                <SelectItem value="hasAll">Possui todas as tags</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="tags" className="text-white">Tags</Label>
            <Input 
              id="tags" 
              placeholder="Ex: vip, interessado, novo" 
              value={config.tags || ''} 
              onChange={(e) => updateConfig('tags', e.target.value)}
              className="bg-[#202027] border-vendah-purple/40 text-white"
            />
            <p className="text-xs text-gray-400">Separe múltiplas tags com vírgula</p>
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch 
              id="create_if_missing" 
              checked={config.createIfMissing || false}
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
      
    case 'date_condition':
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="date-field" className="text-white">Campo de Data</Label>
            <Select 
              value={config.field || 'created_at'} 
              onValueChange={(value) => updateConfig('field', value)}
            >
              <SelectTrigger id="date-field" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o campo" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="created_at">Data de criação</SelectItem>
                <SelectItem value="updated_at">Data de atualização</SelectItem>
                <SelectItem value="last_contact">Último contato</SelectItem>
                <SelectItem value="next_action">Próxima ação</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="date-operator" className="text-white">Operador</Label>
            <Select 
              value={config.operator || 'before'} 
              onValueChange={(value) => updateConfig('operator', value)}
            >
              <SelectTrigger id="date-operator" className="bg-[#202027] border-vendah-purple/40 text-white">
                <SelectValue placeholder="Selecione o operador" />
              </SelectTrigger>
              <SelectContent className="bg-surface border-vendah-purple/30">
                <SelectItem value="before">Antes de</SelectItem>
                <SelectItem value="after">Depois de</SelectItem>
                <SelectItem value="on">Na data</SelectItem>
                <SelectItem value="notOn">Não na data</SelectItem>
                <SelectItem value="olderThan">Mais antigo que</SelectItem>
                <SelectItem value="newerThan">Mais recente que</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {['before', 'after', 'on', 'notOn'].includes(config.operator || '') ? (
            <div className="space-y-2">
              <Label htmlFor="date-value" className="text-white">Data</Label>
              <Input 
                id="date-value" 
                type="date"
                value={config.date || ''} 
                onChange={(e) => updateConfig('date', e.target.value)}
                className="bg-[#202027] border-vendah-purple/40 text-white"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="number-value" className="text-white">Valor</Label>
                <Input 
                  id="number-value" 
                  type="number"
                  min="1"
                  placeholder="Ex: 30" 
                  value={config.value || ''} 
                  onChange={(e) => updateConfig('value', e.target.value)}
                  className="bg-[#202027] border-vendah-purple/40 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-white">Unidade</Label>
                <Select 
                  value={config.unit || 'days'} 
                  onValueChange={(value) => updateConfig('unit', value)}
                >
                  <SelectTrigger id="unit" className="bg-[#202027] border-vendah-purple/40 text-white">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-surface border-vendah-purple/30">
                    <SelectItem value="hours">Horas</SelectItem>
                    <SelectItem value="days">Dias</SelectItem>
                    <SelectItem value="weeks">Semanas</SelectItem>
                    <SelectItem value="months">Meses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          
          <div className="flex items-center space-x-2 pt-2">
            <Checkbox 
              id="from_now" 
              checked={config.fromNow || false}
              onCheckedChange={(checked) => updateConfig('fromNow', checked)}
              disabled={!['olderThan', 'newerThan'].includes(config.operator || '')}
            />
            <Label 
              htmlFor="from_now" 
              className={`text-sm cursor-pointer ${['olderThan', 'newerThan'].includes(config.operator || '') ? 'text-white' : 'text-gray-500'}`}
            >
              Calcular a partir de agora
            </Label>
          </div>
        </div>
      );
      
    default:
      return (
        <div className="space-y-2">
          <Label className="text-white">Condição</Label>
          <p className="text-sm text-muted-foreground">
            Este bloco será executado apenas se a condição for verdadeira.
          </p>
        </div>
      );
  }
};
