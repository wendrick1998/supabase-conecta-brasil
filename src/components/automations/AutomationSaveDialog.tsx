
import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface AutomationSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (description: string) => void;
  isSaving: boolean;
}

export const AutomationSaveDialog: React.FC<AutomationSaveDialogProps> = ({
  open,
  onOpenChange,
  onSave,
  isSaving
}) => {
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(description);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-surface border-vendah-purple/20 rounded-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-white">
            <Save className="mr-2 h-5 w-5" />
            Salvar Automação
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="description">Descrição das alterações (opcional)</Label>
              <Textarea
                id="description"
                placeholder="Descreva as alterações feitas nesta versão..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none h-24"
              />
              <p className="text-sm text-muted-foreground">
                Uma boa descrição ajuda a entender as alterações quando for necessário revisar ou restaurar versões anteriores.
              </p>
            </div>
          </div>
          
          <DialogFooter className="pt-4 mt-4 border-t border-vendah-purple/20">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              disabled={isSaving}
              className="bg-pink-500 hover:bg-pink-600"
            >
              {isSaving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
