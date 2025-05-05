
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlockType } from '@/types/automation';

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
              value={config.operator || 'equals'} 
              onValueChange={(value) => updateConfig('operator', value)}
            >
              <SelectTrigger id="status-operator">
                <SelectValue placeholder="Selecione o operador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">É igual a</SelectItem>
                <SelectItem value="notEqual">É diferente de</SelectItem>
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
              value={config.operator || 'equals'} 
              onValueChange={(value) => updateConfig('operator', value)}
            >
              <SelectTrigger id="source-operator">
                <SelectValue placeholder="Selecione o operador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equals">É igual a</SelectItem>
                <SelectItem value="notEqual">É diferente de</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="source">Origem</Label>
            <Select 
              value={config.value || 'none'} 
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
                <SelectItem value="none">Selecione uma origem</SelectItem>
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
              value={config.operator || 'greater'} 
              onValueChange={(value) => updateConfig('operator', value)}
            >
              <SelectTrigger id="value-operator">
                <SelectValue placeholder="Selecione o operador" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="greater">Maior que</SelectItem>
                <SelectItem value="less">Menor que</SelectItem>
                <SelectItem value="greaterEqual">Maior ou igual a</SelectItem>
                <SelectItem value="lessEqual">Menor ou igual a</SelectItem>
                <SelectItem value="equal">Igual a</SelectItem>
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
