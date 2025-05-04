
import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ConfirmOptions {
  title?: string;
  description?: string;
  cancelText?: string;
  confirmText?: string;
}

/**
 * Exibe um diálogo de confirmação e retorna uma Promise que resolve com true se o usuário confirmar
 * ou false se cancelar.
 */
export const confirm = ({
  title = 'Confirmar',
  description = 'Tem certeza de que deseja continuar?',
  cancelText = 'Cancelar',
  confirmText = 'Confirmar',
}: ConfirmOptions = {}): Promise<boolean> => {
  return new Promise((resolve) => {
    // Create container element
    const container = document.createElement('div');
    document.body.appendChild(container);
    
    const root = createRoot(container);
    
    // Function to clean up the DOM after dialog closes
    const cleanup = () => {
      root.unmount();
      document.body.removeChild(container);
    };
    
    // Handler functions for user actions
    const handleCancel = () => {
      cleanup();
      resolve(false);
    };
    
    const handleConfirm = () => {
      cleanup();
      resolve(true);
    };
    
    // Create a simple component that uses the AlertDialog
    const ConfirmDialog = () => {
      const [open, setOpen] = React.useState(true);
      
      const handleOpenChange = (open: boolean) => {
        if (!open) {
          handleCancel();
        }
        setOpen(open);
      };
      
      return (
        <AlertDialog open={open} onOpenChange={handleOpenChange}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{title}</AlertDialogTitle>
              <AlertDialogDescription>{description}</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>{confirmText}</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      );
    };
    
    // Render the dialog component
    root.render(<ConfirmDialog />);
  });
};
