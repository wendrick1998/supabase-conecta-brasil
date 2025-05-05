
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Canal, EstagioPipeline } from '@/types/lead';

interface LeadsTableFiltersProps {
  canais: Canal[];
  estagios: EstagioPipeline[];
  filtroCanal: string | null;
  filtroEstagio: string | null;
  onCanalChange: (value: string) => void;
  onEstagioChange: (value: string) => void;
}

const LeadsTableFilters: React.FC<LeadsTableFiltersProps> = ({
  canais,
  estagios,
  filtroCanal,
  filtroEstagio,
  onCanalChange,
  onEstagioChange
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-64">
        <Select
          value={filtroCanal || "all-channels"}
          onValueChange={(value) => onCanalChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por canal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-channels">Todos os canais</SelectItem>
            {canais.map((canal) => (
              <SelectItem key={canal.id} value={canal.id}>
                {canal.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="w-full sm:w-64">
        <Select
          value={filtroEstagio || "all-stages"}
          onValueChange={(value) => onEstagioChange(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filtrar por estágio" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-stages">Todos os estágios</SelectItem>
            {estagios.map((estagio) => (
              <SelectItem key={estagio.id} value={estagio.id}>
                {estagio.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default LeadsTableFilters;
