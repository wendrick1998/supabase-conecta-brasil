
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BlockType } from '@/types/automation';

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
