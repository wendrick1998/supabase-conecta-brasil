
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Fingerprint, X } from 'lucide-react';
import useBiometricAuth from '@/hooks/useBiometricAuth';
import useHapticFeedback from '@/hooks/useHapticFeedback';

interface BiometricPromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  onCancel: () => void;
}

const BiometricPrompt: React.FC<BiometricPromptProps> = ({
  open,
  onOpenChange,
  onSuccess,
  onCancel
}) => {
  const { authenticate, authenticating } = useBiometricAuth();
  const haptic = useHapticFeedback();

  const handleAuthenticate = async () => {
    haptic.tap();
    const success = await authenticate();
    
    if (success) {
      haptic.success();
      onSuccess();
    } else {
      haptic.error();
    }
  };

  const handleCancel = () => {
    haptic.tap();
    onCancel();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Autenticação Biométrica</DialogTitle>
          <DialogDescription>
            Use sua biometria para autenticar rapidamente
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-6 space-y-4">
          <div className="bg-vendah-purple/10 p-5 rounded-full">
            <Fingerprint size={64} className="text-vendah-purple" />
          </div>
          
          <p className="text-center text-sm text-text-muted">
            Toque no botão abaixo para usar seu{' '}
            <span className="font-medium text-vendah-purple">
              FaceID / TouchID
            </span>{' '}
            para verificar sua identidade.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row sm:justify-center gap-2 mt-2">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            className="order-2 sm:order-1"
            disabled={authenticating}
          >
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          
          <Button 
            onClick={handleAuthenticate}
            className="bg-gradient-to-r from-vendah-purple to-vendah-blue hover:opacity-90 order-1 sm:order-2"
            disabled={authenticating}
          >
            <Fingerprint className="mr-2 h-4 w-4" />
            {authenticating ? 'Autenticando...' : 'Usar Biometria'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BiometricPrompt;
