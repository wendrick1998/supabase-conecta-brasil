
import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { X } from 'lucide-react';
import { ptBR } from 'date-fns/locale';

interface DateRangeFilterProps {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  setDateRange: (range: { from: Date | undefined; to: Date | undefined }) => void;
  onDateRangeChange: (range: { from: Date; to: Date } | null) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ 
  dateRange, 
  setDateRange, 
  onDateRangeChange 
}) => {
  const handleClearDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
    onDateRangeChange(null);
  };

  return (
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
  );
};

export default DateRangeFilter;
