import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Play, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
interface AutomationHeaderProps {
  automationName: string;
  setAutomationName: (name: string) => void;
  onSave: () => void;
  onTest: () => void;
  onCancel: () => void;
}
export const AutomationHeader: React.FC<AutomationHeaderProps> = ({
  automationName,
  setAutomationName,
  onSave,
  onTest,
  onCancel
}) => {
  return <div className="border-b px-4 py-4 flex flex-wrap justify-between items-center gap-4 bg-zinc-900">
      <div>
        <h1 className="text-xl md:text-2xl font-semibold">{automationName}</h1>
        <p className="text-muted-foreground text-sm">Construtor visual de automação</p>
      </div>
      
      <div className="flex items-center gap-2">
        <Button onClick={onTest} className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-2">
          <Play className="mr-2 h-4 w-4" />
          Testar
        </Button>
        <Button onClick={onSave} className="bg-pink-500 hover:bg-pink-600 text-white rounded-md px-6 py-2">
          <Save className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Salvar</span>
        </Button>
        <Button onClick={onCancel} variant="ghost" className="text-gray-600 hover:text-gray-800 hover:underline">
          <X className="mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Cancelar</span>
        </Button>
      </div>
    </div>;
};