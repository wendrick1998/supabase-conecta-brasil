
import React, { useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface HistoryFiltersProps {
  selectedTypes: ('nota' | 'interacao' | 'mensagem')[];
  onTypeChange: (type: 'nota' | 'interacao' | 'mensagem') => void;
  dateRange: { from: Date | undefined; to: Date | undefined };
  onDateRangeChange: (range: { from: Date; to: Date } | null) => void;
  onClearFilters: () => void;
}

const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  selectedTypes,
  onTypeChange,
  dateRange,
  onDateRangeChange,
  onClearFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [localDateRange, setLocalDateRange] = useState(dateRange);
  
  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedTypes.length > 0 && selectedTypes.length < 3) count += selectedTypes.length;
    if (dateRange.from && dateRange.to) count += 1;
    return count;
  };
  
  const handleDateSelect = (range: { from: Date | undefined; to: Date | undefined } | undefined) => {
    setLocalDateRange(range || { from: undefined, to: undefined });
  };
  
  const handleClearDateRange = () => {
    setLocalDateRange({ from: undefined, to: undefined });
  };
  
  const handleApplyFilters = () => {
    if (localDateRange.from && localDateRange.to) {
      onDateRangeChange(localDateRange as { from: Date; to: Date });
    } else {
      onDateRangeChange(null);
    }
    setIsOpen(false);
  };
  
  return (
    <div className="flex items-center">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
            {getActiveFiltersCount() > 0 && (
              <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full ml-1 text-[10px]">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Filtros de Histórico</h3>
            {getActiveFiltersCount() > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-7 text-xs" 
                onClick={onClearFilters}
              >
                Limpar filtros
              </Button>
            )}
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-4">
            {/* Tipo de evento */}
            <div>
              <Label className="text-xs font-medium">Tipo de evento</Label>
              <div className="grid grid-cols-1 gap-2 mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-note"
                    checked={selectedTypes.includes('nota')}
                    onCheckedChange={() => onTypeChange('nota')}
                  />
                  <label htmlFor="filter-note" className="text-sm">Notas</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-interaction"
                    checked={selectedTypes.includes('interacao')}
                    onCheckedChange={() => onTypeChange('interacao')}
                  />
                  <label htmlFor="filter-interaction" className="text-sm">Interações</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-message"
                    checked={selectedTypes.includes('mensagem')}
                    onCheckedChange={() => onTypeChange('mensagem')}
                  />
                  <label htmlFor="filter-message" className="text-sm">Mensagens</label>
                </div>
              </div>
            </div>
            
            {/* Date Range */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Período</Label>
                {(localDateRange.from || localDateRange.to) && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 text-xs px-2" 
                    onClick={handleClearDateRange}
                  >
                    <X className="h-3 w-3 mr-1" /> Limpar
                  </Button>
                )}
              </div>
              <div className="mt-2 border rounded-md p-3">
                <Calendar
                  mode="range"
                  selected={localDateRange}
                  onSelect={handleDateSelect}
                  locale={ptBR}
                  className="rounded-md border"
                />
                {localDateRange.from && (
                  <div className="mt-2 text-sm">
                    <span>
                      {localDateRange.from && format(localDateRange.from, 'PPP', { locale: ptBR })}
                      {localDateRange.to ? ` - ${format(localDateRange.to, 'PPP', { locale: ptBR })}` : ''}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button size="sm" onClick={handleApplyFilters}>Aplicar Filtros</Button>
          </div>
        </PopoverContent>
      </Popover>
      
      {getActiveFiltersCount() > 0 && (
        <div className="ml-2 flex flex-wrap gap-1">
          {selectedTypes.length > 0 && selectedTypes.length < 3 && (
            <Badge variant="outline" className="text-xs h-6 flex gap-1 items-center">
              Tipos: {selectedTypes.join(', ')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onClearFilters()}
              />
            </Badge>
          )}
          
          {dateRange.from && dateRange.to && (
            <Badge variant="outline" className="text-xs h-6 flex gap-1 items-center">
              {format(dateRange.from, 'dd/MM')} - {format(dateRange.to, 'dd/MM')}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => onDateRangeChange(null)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default HistoryFilters;
