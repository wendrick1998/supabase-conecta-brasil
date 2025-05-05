
import React from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { ArrowLeft, History, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { ptBR } from 'date-fns/locale';

interface Version {
  id: string;
  version: number;
  created_at: string;
  user_name: string;
  description: string | null;
}

interface AutomationVersionHistoryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  automationId: string | undefined;
  currentVersion: number;
  onRestoreVersion: (versionId: string) => Promise<void>;
}

export const AutomationVersionHistory: React.FC<AutomationVersionHistoryProps> = ({
  open,
  onOpenChange,
  automationId,
  currentVersion,
  onRestoreVersion
}) => {
  const [versions, setVersions] = React.useState<Version[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isRestoring, setIsRestoring] = React.useState(false);

  React.useEffect(() => {
    if (open && automationId) {
      loadVersions();
    }
  }, [open, automationId]);

  const loadVersions = async () => {
    if (!automationId) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('automacoes_versoes')
        .select('*')
        .eq('automacao_id', automationId)
        .order('version', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setVersions(data || []);
    } catch (error) {
      console.error("Error loading versions:", error);
      toast.error("Não foi possível carregar o histórico de versões");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreVersion = async (versionId: string) => {
    setIsRestoring(true);
    try {
      await onRestoreVersion(versionId);
      onOpenChange(false);
      toast.success("Versão restaurada com sucesso");
    } catch (error) {
      console.error("Error restoring version:", error);
      toast.error("Não foi possível restaurar a versão");
    } finally {
      setIsRestoring(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-surface border-vendah-purple/20 rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            <History className="mr-2 h-5 w-5" />
            Histórico de Versões
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="h-[400px] pr-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vendah-purple mx-auto"></div>
                <p className="mt-2 text-sm text-muted-foreground">Carregando versões...</p>
              </div>
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-10">
              <History className="h-12 w-12 mx-auto text-gray-500 mb-2" />
              <p className="text-gray-400">Nenhuma versão encontrada</p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map((version) => (
                <div 
                  key={version.id}
                  className={`p-4 rounded-lg border ${version.version === currentVersion ? 
                    'border-vendah-purple bg-vendah-purple/10' : 
                    'border-gray-800 bg-gray-900/50'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center">
                        <span className="font-semibold">Versão {version.version}</span>
                        {version.version === currentVersion && (
                          <span className="ml-2 text-xs bg-vendah-purple/30 text-white px-2 py-0.5 rounded-full">
                            Atual
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">{formatDate(version.created_at)}</p>
                      {version.user_name && (
                        <p className="text-sm text-gray-400">por {version.user_name}</p>
                      )}
                    </div>
                    {version.version !== currentVersion && (
                      <Button
                        variant="outline" 
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => handleRestoreVersion(version.id)}
                        disabled={isRestoring}
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Restaurar
                      </Button>
                    )}
                  </div>
                  {version.description && (
                    <p className="text-sm mt-2 text-gray-300">{version.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
