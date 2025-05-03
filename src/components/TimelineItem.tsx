
import React from 'react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Interacao, Nota } from '@/types/lead';
import { MessageCircle, Phone, ArrowRight, FileText } from 'lucide-react';

interface TimelineItemProps {
  item: Interacao | Nota;
  type: 'interacao' | 'nota';
}

const TimelineItem: React.FC<TimelineItemProps> = ({ item, type }) => {
  const getIcon = () => {
    if (type === 'nota') {
      return <FileText className="h-5 w-5 text-blue-500" />;
    }

    // Para interações
    const interacao = item as Interacao;
    switch (interacao.tipo) {
      case 'mensagem':
        return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'chamada':
        return <Phone className="h-5 w-5 text-purple-500" />;
      case 'mudanca_estagio':
        return <ArrowRight className="h-5 w-5 text-orange-500" />;
      default:
        return <MessageCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTitle = () => {
    if (type === 'nota') {
      return 'Nota';
    }

    const interacao = item as Interacao;
    switch (interacao.tipo) {
      case 'mensagem':
        return 'Mensagem';
      case 'chamada':
        return 'Chamada';
      case 'mudanca_estagio':
        return 'Mudança de Estágio';
      default:
        return 'Interação';
    }
  };

  const getDate = () => {
    const date = parseISO(item.criado_em);
    return format(date, "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
  };

  return (
    <div className="flex mb-4">
      <div className="mr-3 flex flex-col items-center">
        <div className="flex h-8 w-8 items-center justify-center rounded-full border bg-background">
          {getIcon()}
        </div>
        <div className="flex-1 w-0.5 bg-border mt-2"></div>
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <h4 className="text-sm font-medium">{getTitle()}</h4>
          <span className="ml-auto text-xs text-muted-foreground">{getDate()}</span>
        </div>
        <div className="rounded-md border p-3 bg-muted/30">
          <div className="text-sm">{item.conteudo}</div>
        </div>
      </div>
    </div>
  );
};

export default TimelineItem;
