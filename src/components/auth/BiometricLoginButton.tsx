
import React from 'react';
import { Button } from "@/components/ui/button";
import { Fingerprint } from "lucide-react";
import { toast } from "sonner";
import useBiometricAuth from '@/hooks/useBiometricAuth';
import useHapticFeedback from '@/hooks/useHapticFeedback';

interface BiometricLoginButtonProps {
  onSuccessfulAuth?: () => void;
  className?: string;
}

const BiometricLoginButton: React.FC<BiometricLoginButtonProps> = ({ 
  onSuccessfulAuth,
  className = ""
}) => {
  const { biometricAvailable, authenticate, authenticating } = useBiometricAuth();
  const haptic = useHapticFeedback();
  
  const handleBiometricLogin = async () => {
    haptic.tap();
    
    if (biometricAvailable !== 'available') {
      toast.error("Autenticação biométrica não disponível neste dispositivo");
      return;
    }
    
    const success = await authenticate();
    
    if (success) {
      haptic.success();
      if (onSuccessfulAuth) {
        onSuccessfulAuth();
      }
    } else {
      haptic.error();
    }
  };
  
  // Don't render if biometrics aren't available
  if (biometricAvailable === 'unavailable') {
    return null;
  }
  
  return (
    <Button
      type="button"
      variant="outline"
      className={`flex items-center justify-center ${className}`}
      onClick={handleBiometricLogin}
      disabled={authenticating || biometricAvailable === 'unknown'}
    >
      <Fingerprint className="mr-2 h-4 w-4" />
      {authenticating 
        ? "Autenticando..." 
        : biometricAvailable === 'unknown'
          ? "Verificando disponibilidade..."
          : "Entrar com Biometria"
      }
    </Button>
  );
};

export default BiometricLoginButton;
