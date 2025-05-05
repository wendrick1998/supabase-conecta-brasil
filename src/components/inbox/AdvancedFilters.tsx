
import React, { useState } from 'react';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Filter, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { InboxFilters } from '@/services/inboxService';
import { ptBR } from 'date-fns/locale';

interface AdvancedFiltersProps {
  activeFilters: InboxFilters;
  onChannelFilterChange: (channel: 'WhatsApp' | 'Instagram' | 'Facebook' | 'Email') => void;
  onStatusFilterChange: (status: 'Aberta' | 'Fechada') => void;
  onDateRangeChange: (range: { from: Date; to: Date } | null) => void;
  onPriorityChange: (priority: string) => void;
  onClearFilters: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  activeFilters,
  onChannelFilterChange,
  onStatusFilterChange,
  onDateRangeChange,
  onPriorityChange,
  onClearFilters
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: activeFilters.dateRange?.from,
    to: activeFilters.dateRange?.to
  });
  
  // Count active filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (activeFilters.canais && activeFilters.canais.length > 0) count += activeFilters.canais.length;
    if (activeFilters.status && activeFilters.status.length > 0) count += activeFilters.status.length;
    if (activeFilters.dateRange) count += 1;
    if (activeFilters.priority) count += 1;
    return count;
  };
  
  // Fix the DateRange handling
  const handleDateSelect = (date: Date | undefined) => {
    setDateRange(prev => {
      if (!prev.from) {
        return { from: date, to: undefined };
      } else if (prev.from && !prev.to && date && date > prev.from) {
        const newRange = { from: prev.from, to: date };
        onDateRangeChange(newRange.from && newRange.to ? newRange as { from: Date; to: Date } : null);
        return newRange;
      } else {
        return { from: date, to: undefined };
      }
    });
  };
  
  const handleClearDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
    onDateRangeChange(null);
  };
  
  const handleApplyFilters = () => {
    if (dateRange.from && dateRange.to) {
      onDateRangeChange(dateRange as { from: Date; to: Date });
    }
    setIsOpen(false);
  };
  
  return (
    <div className="flex items-center">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 gap-1 relative">
            <Filter className="h-4 w-4" />
            <span>Filtros</span>
            {getActiveFiltersCount() > 0 && (
              <Badge className="h-5 w-5 p-0 flex items-center justify-center rounded-full ml-1 text-[10px]">
                {getActiveFiltersCount()}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80" align="start">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-sm">Filtros Avançados</h3>
            {getActiveFiltersCount() > 0 && (
              <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={onClearFilters}>
                Limpar filtros
              </Button>
            )}
          </div>
          
          <Separator className="my-2" />
          
          <div className="space-y-4">
            {/* Canais */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Canais</Label>
              <div className="grid grid-cols-2 gap-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-whatsapp" 
                    checked={activeFilters.canais?.includes('WhatsApp')}
                    onCheckedChange={() => onChannelFilterChange('WhatsApp')}
                  />
                  <label htmlFor="filter-whatsapp" className="text-sm">WhatsApp</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-instagram" 
                    checked={activeFilters.canais?.includes('Instagram')}
                    onCheckedChange={() => onChannelFilterChange('Instagram')}
                  />
                  <label htmlFor="filter-instagram" className="text-sm">Instagram</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-facebook" 
                    checked={activeFilters.canais?.includes('Facebook')}
                    onCheckedChange={() => onChannelFilterChange('Facebook')}
                  />
                  <label htmlFor="filter-facebook" className="text-sm">Facebook</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-email" 
                    checked={activeFilters.canais?.includes('Email')}
                    onCheckedChange={() => onChannelFilterChange('Email')}
                  />
                  <label htmlFor="filter-email" className="text-sm">Email</label>
                </div>
              </div>
            </div>
            
            {/* Status */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Status</Label>
              <div className="flex space-x-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-aberta" 
                    checked={activeFilters.status?.includes('Aberta')}
                    onCheckedChange={() => onStatusFilterChange('Aberta')}
                  />
                  <label htmlFor="filter-aberta" className="text-sm">Abertas</label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="filter-fechada" 
                    checked={activeFilters.status?.includes('Fechada')}
                    onCheckedChange={() => onStatusFilterChange('Fechada')}
                  />
                  <label htmlFor="filter-fechada" className="text-sm">Fechadas</label>
                </div>
              </div>
            </div>
            
            {/* Prioridade */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Prioridade</Label>
              <Select
                value={activeFilters.priority || ""}
                onValueChange={onPriorityChange}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="Todas as prioridades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todas as prioridades</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Data Range */}
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium">Período</Label>
                {(dateRange.from || dateRange.to) && (
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
              
              <div className="border rounded-md p-3 mt-2">
                <Calendar
                  mode="range"
                  selected={{
                    from: dateRange.from,
                    to: dateRange.to
                  }}
                  onSelect={(range) => {
                    if (range) {
                      setDateRange({
                        from: range.from,
                        to: range.to
                      });
                      
                      if (range.from && range.to) {
                        onDateRangeChange({
                          from: range.from,
                          to: range.to
                        });
                      }
                    }
                  }}
                  locale={ptBR}
                  className="pointer-events-auto"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end mt-4">
            <Button size="sm" onClick={() => setIsOpen(false)}>
              Fechar
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default AdvancedFilters;
