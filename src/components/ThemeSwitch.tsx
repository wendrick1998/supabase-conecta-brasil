
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// This is a placeholder component since we're already using dark mode by default
// In a future update, we could implement actual theme switching functionality
const ThemeSwitch: React.FC = () => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-vendah-purple/10 hover:text-vendah-neon btn-press"
            aria-label="Alternar tema"
          >
            <Moon className="h-5 w-5" />
            <span className="sr-only">Alternar tema</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Modo escuro ativado (padrão)</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ThemeSwitch;
