
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReactNode, createContext, useContext, useState } from "react";

interface ConfirmDialogOptions {
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
}

export async function confirm(options: ConfirmDialogOptions): Promise<boolean> {
  return new Promise((resolve) => {
    const dialog = document.createElement('div');
    dialog.className = 'confirm-dialog-container';
    document.body.appendChild(dialog);

    const handleConfirm = () => {
      document.body.removeChild(dialog);
      resolve(true);
    };

    const handleCancel = () => {
      document.body.removeChild(dialog);
      resolve(false);
    };

    const dialogContent = (
      <AlertDialog open={true}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options.title}</AlertDialogTitle>
            <AlertDialogDescription>{options.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>
              {options.cancelText || "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>
              {options.confirmText || "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );

    // @ts-ignore - This is a quick fix to render React element
    import('react-dom/client').then(({ createRoot }) => {
      const root = createRoot(dialog);
      root.render(dialogContent);
    });
  });
}
