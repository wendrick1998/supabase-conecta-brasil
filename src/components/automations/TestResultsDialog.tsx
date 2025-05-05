
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, XCircle, Clock, AlertTriangle, Award, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Block } from '@/types/automation';
import { getBlockInfo } from '@/utils/automationUtils';

interface TestResult {
  blockId: string;
  status: 'success' | 'error' | 'pending';
  message: string;
}

interface TestSummary {
  success: boolean;
  message: string;
  details: string[];
}

interface TestResultsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blocks: Block[];
  testResults: TestResult[];
  testSummary: TestSummary | null;
  isTestRunning: boolean;
  onRetest: () => void;
}

export const TestResultsDialog: React.FC<TestResultsDialogProps> = ({
  open,
  onOpenChange,
  blocks,
  testResults,
  testSummary,
  isTestRunning,
  onRetest,
}) => {
  // Função para renderizar o ícone de status
  const renderStatusIcon = (status: 'success' | 'error' | 'pending') => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500 animate-pulse" />;
    }
  };

  // Função para obter o bloco pelo ID
  const getBlockById = (id: string): Block | undefined => {
    return blocks.find(block => block.id === id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-surface border-vendah-purple/20 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center gap-2">
            {isTestRunning ? (
              <>
                <Clock className="h-5 w-5 text-amber-500 animate-pulse" />
                Executando Teste
              </>
            ) : testSummary ? (
              testSummary.success ? (
                <>
                  <Award className="h-5 w-5 text-green-500" />
                  Teste Concluído com Sucesso
                </>
              ) : (
                <>
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Teste Concluído com Avisos
                </>
              )
            ) : (
              <>
                <BarChart className="h-5 w-5 text-vendah-purple" />
                Resultados do Teste
              </>
            )}
          </DialogTitle>
          {testSummary && (
            <DialogDescription className="text-white/80">
              {testSummary.message}
            </DialogDescription>
          )}
        </DialogHeader>

        <ScrollArea className="h-[400px] mt-4 p-4 border rounded-md bg-[#09071c]">
          {testResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Clock className="h-8 w-8 text-vendah-purple animate-pulse mb-2" />
              <p className="text-white/80 text-center">
                Aguardando início do teste...
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {testResults.map((result) => {
                const block = getBlockById(result.blockId);
                if (!block) return null;

                const blockInfo = getBlockInfo(block.type);

                return (
                  <div
                    key={result.blockId}
                    className={`p-4 rounded-md border ${
                      result.status === 'success'
                        ? 'bg-green-900/20 border-green-700/50'
                        : result.status === 'error'
                        ? 'bg-red-900/20 border-red-700/50'
                        : 'bg-amber-900/20 border-amber-700/50'
                    } transition-all`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">{renderStatusIcon(result.status)}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {blockInfo.icon}
                          <span className="font-medium text-white">
                            {blockInfo.name}
                          </span>
                        </div>
                        <p className="text-sm text-white/80">{result.message}</p>
                      </div>
                    </div>
                  </div>
                );
              })}

              {testSummary && (
                <div className="mt-6 pt-4 border-t border-vendah-purple/20">
                  <h4 className="font-medium text-white mb-2">Resumo do teste:</h4>
                  <ul className="space-y-1">
                    {testSummary.details.map((detail, index) => (
                      <li key={index} className="text-sm text-white/70">
                        • {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        <div className="flex justify-end gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-vendah-purple/30 text-white"
          >
            Fechar
          </Button>
          <Button
            onClick={onRetest}
            disabled={isTestRunning}
            className="bg-vendah-purple hover:bg-vendah-purple/90 text-white"
          >
            {isTestRunning ? "Executando..." : "Executar Novamente"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
