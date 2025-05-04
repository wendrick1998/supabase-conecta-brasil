
import React from 'react';
import { BlockType } from '@/types/automation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface AutomationBlockConfigProps {
  blockType: BlockType;
}

export const AutomationBlockConfig: React.FC<AutomationBlockConfigProps> = ({ blockType }) => {
  // Render different forms based on block type
  switch (blockType) {
    case 'new_lead':
      return (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Quando um novo lead é criado</Label>
            <p className="text-sm text-muted-foreground">
              Esta automação será executada sempre que um novo lead for criado no sistema.
            </p>
          </div>
        </div>
      );
      
    case 'send_message':
      return (
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="message">Mensagem</Label>
            <Input id="message" placeholder="Olá, {nome}! Bem-vindo à nossa empresa." />
          </div>
          <div className="space-y-2">
            <Label htmlFor="channel">Canal</Label>
            <Select defaultValue="whatsapp">
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
        </div>
      );
      
    // Add more configuration forms for other block types
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
