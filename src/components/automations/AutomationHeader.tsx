
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Play, X, History } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AutomationHeaderProps {
  automationName: string;
  setAutomationName: (name: string) => void;
  onSave: () => void;
  onTest: () => void;
  onCancel: () => void;
  onShowVersionHistory?: () => void;
  currentVersion?: number;
  hasVersionHistory?: boolean;
}

export const AutomationHeader: React.FC<AutomationHeaderProps> = ({
  automationName,
  setAutomationName,
  onSave,
  onTest,
  onCancel,
  onShowVersionHistory,
  currentVersion,
  hasVersionHistory = false
}) => {
  return (
    <div className="border-b px-4 py-4 flex flex-wrap justify-between items-center gap-4 bg-zinc-900">
      <div className="flex items-center gap-2">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold">{automationName}</h1>
          <p className="text-muted-foreground text-sm">Construtor visual de automação</p>
        </div>
        
        {hasVersionHistory && currentVersion !== undefined && (
          <div className="ml-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center text-xs"
              onClick={onShowVersionHistory}
            >
              <History className="h-3.5 w-3.5 mr-1" />
              v{currentVersion}
            </Button>
          </div>
        )}
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
    </div>
  );
};
