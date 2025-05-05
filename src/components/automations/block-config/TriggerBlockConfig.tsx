
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
