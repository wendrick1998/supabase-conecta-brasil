
import React from 'react';
import { Tag } from '@/types/lead';
import { Badge } from '@/components/ui/badge';

interface LeadTagProps {
  tag: Tag;
  size?: 'sm' | 'md' | 'lg';
}

export const LeadTag: React.FC<LeadTagProps> = ({ tag, size = 'md' }) => {
  // Tamanho da fonte baseado na prop size
  const sizeClasses = {
    sm: 'text-xs py-0 px-1.5',
    md: 'text-sm py-0.5 px-2',
    lg: 'text-base py-1 px-2.5'
  };
  
  // Enhance tag contrast by darkening or lightening as needed
  const enhancedColor = tag.cor;
  const textColor = isLightColor(tag.cor) ? '#000000' : '#ffffff';
  
  return (
    <Badge 
      style={{ 
        backgroundColor: `${enhancedColor}40`, // 25% opacity
        color: textColor,
        borderColor: `${enhancedColor}80` // 50% opacity border
      }}
      className={`mr-1 mb-1 ${sizeClasses[size]} border`}
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
