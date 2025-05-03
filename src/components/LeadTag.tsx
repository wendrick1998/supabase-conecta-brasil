
import React from 'react';
import { Tag } from '@/types/lead';
import { Badge } from '@/components/ui/badge';

interface LeadTagProps {
  tag: Tag;
}

export const LeadTag: React.FC<LeadTagProps> = ({ tag }) => {
  return (
    <Badge 
      style={{ 
        backgroundColor: tag.cor,
        color: isLightColor(tag.cor) ? '#000' : '#fff'
      }}
      className="mr-1 mb-1"
    >
      {tag.nome}
    </Badge>
  );
};

// Função para determinar se a cor de fundo é clara
function isLightColor(color: string): boolean {
  // Remover o # se presente
  const hex = color.replace('#', '');
  
  // Converter para RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calcular o brilho (YIQ equation)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Retornar true se a cor for clara (brilho > 128)
  return brightness > 128;
}

export default LeadTag;
