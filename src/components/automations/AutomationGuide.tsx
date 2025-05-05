import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
interface GuideStep {
  title: string;
  description: string;
  target: string;
}
const GUIDE_STEPS: GuideStep[] = [{
  title: "Passo 1: Adicione um Gatilho",
  description: "Arraste um bloco de gatilho para a tela. Este será o evento que inicia sua automação.",
  target: "trigger-section"
}, {
  title: "Passo 2: Configure condições (opcional)",
  description: "Adicione condições para determinar quando sua automação deve ser executada.",
  target: "condition-section"
}, {
  title: "Passo 3: Adicione ações",
  description: "Arraste ações para definir o que acontece quando a automação é disparada.",
  target: "action-section"
}];
interface AutomationGuideProps {
  isFirstVisit?: boolean;
}
export const AutomationGuide: React.FC<AutomationGuideProps> = ({
  isFirstVisit = false
}) => {
  const [showGuide, setShowGuide] = useState(isFirstVisit);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const handleNextStep = () => {
    if (currentStep < GUIDE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowGuide(false);
    }
  };
  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  const renderBlockTypeTooltips = () => <div className="mb-4">
      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button variant="outline" className="mr-2 border-blue-300">
              Gatilho
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              Um gatilho é o evento que inicia a automação, como quando um lead é criado ou uma mensagem é recebida.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button variant="outline" className="mr-2 border-amber-300">
              Condição
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              As condições determinam se a automação continua executando com base em critérios específicos, como o valor de um campo.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <Button variant="outline" className="border-green-300">
              Ação
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs">
              As ações são tarefas executadas quando um gatilho é acionado, como enviar um email ou atualizar um registro.
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>;
  return <>
      {/* "Como funciona" button */}
      <div className="absolute top-4 right-4 z-10">
        <Button variant="outline" className="bg-white shadow-sm" onClick={() => setShowHelpDialog(true)}>
          Como funciona?
        </Button>
      </div>

      {/* Interactive guide overlay */}
      {showGuide && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <div className="p-6 rounded-lg shadow-lg max-w-md w-full bg-zinc-900">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{GUIDE_STEPS[currentStep].title}</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowGuide(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <p className="mb-6">{GUIDE_STEPS[currentStep].description}</p>
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={handlePrevStep} disabled={currentStep === 0}>
                Anterior
              </Button>
              
              <Button onClick={handleNextStep}>
                {currentStep === GUIDE_STEPS.length - 1 ? 'Começar' : 'Próximo'}
              </Button>
            </div>
          </div>
        </div>}

      {/* Help dialog */}
      <Dialog open={showHelpDialog} onOpenChange={setShowHelpDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Como funciona o construtor de automações</DialogTitle>
            <DialogDescription>
              Crie automações poderosas arrastando e conectando blocos no canvas.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <h3 className="font-medium mb-2">Tipos de blocos</h3>
            {renderBlockTypeTooltips()}
            
            <div className="space-y-4 mt-6">
              <div className="border-l-4 border-blue-400 pl-3 py-1">
                <h4 className="font-medium">1. Inicie com um gatilho</h4>
                <p className="text-gray-600 text-sm">
                  Todo fluxo deve começar com um gatilho que determina quando a automação será executada.
                  Exemplos: novo lead, mensagem recebida, etapa do funil alterada.
                </p>
              </div>
              
              <div className="border-l-4 border-amber-400 pl-3 py-1">
                <h4 className="font-medium">2. Adicione condições (opcional)</h4>
                <p className="text-gray-600 text-sm">
                  Use condições para criar lógicas como "SE o cliente é de São Paulo, ENTÃO...".
                  Você pode criar caminhos diferentes baseados em condições.
                </p>
              </div>
              
              <div className="border-l-4 border-green-400 pl-3 py-1">
                <h4 className="font-medium">3. Execute ações</h4>
                <p className="text-gray-600 text-sm">
                  Defina o que acontece quando o gatilho é acionado.
                  Exemplos: enviar mensagem, criar tarefa, atualizar campo.
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-md">
              <h4 className="font-medium mb-2">Dicas</h4>
              <ul className="list-disc pl-5 text-sm space-y-2">
                <li>Arraste blocos da barra lateral para o canvas</li>
                <li>Conecte os blocos clicando em um ponto de conexão e arrastando para outro</li>
                <li>Clique em um bloco para configurá-lo</li>
                <li>Use a visualização prévia para testar o fluxo antes de salvar</li>
              </ul>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => {
            setShowHelpDialog(false);
            setShowGuide(true);
            setCurrentStep(0);
          }}>
              Iniciar Guia Interativo
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>;
};
export default AutomationGuide;