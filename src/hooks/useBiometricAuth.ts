
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { isIOS } from '@/pwa/deviceDetection';
import { hapticFeedback } from '@/utils/deviceUtils';

interface BiometricAuthResult {
  isSupported: boolean;
  isEnrolled: boolean;
  authenticate: () => Promise<boolean>;
  biometricAvailable: boolean;
  authenticating: boolean;
}

const useBiometricAuth = (): BiometricAuthResult => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [biometricAvailable, setBiometricAvailable] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      if (isIOS()) {
        setIsSupported(false);
        setIsEnrolled(false);
        setBiometricAvailable(false);
        return;
      }

      if (typeof window.PublicKeyCredential !== 'undefined' &&
          window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
        try {
          const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setIsSupported(available);
          setBiometricAvailable(available);
        } catch (error) {
          console.error('Error checking biometric support:', error);
          setIsSupported(false);
          setBiometricAvailable(false);
        }
      } else {
        setIsSupported(false);
        setBiometricAvailable(false);
      }
    };

    checkBiometricSupport();
  }, []);

  const authenticate = async (): Promise<boolean> => {
    if (!isSupported) {
      toast.error('Biometria não suportada neste dispositivo.');
      return false;
    }

    try {
      setAuthenticating(true);
      hapticFeedback();
      const credential = await navigator.credentials.get({
        mediation: 'conditional',
        publicKey: {
          challenge: new Uint8Array(32),
          timeout: 60000,
          rpId: window.location.hostname,
          allowCredentials: [],
          userVerification: 'required',
        },
      });

      if (credential) {
        toast.success('Autenticação biométrica realizada com sucesso!');
        return true;
      } else {
        toast.error('Falha na autenticação biométrica.');
        return false;
      }
    } catch (error: any) {
      console.error('Erro durante a autenticação biométrica:', error);
      toast.error(`Erro na autenticação: ${error.message}`);
      return false;
    } finally {
      setAuthenticating(false);
    }
  };

  return {
    isSupported,
    isEnrolled,
    authenticate,
    biometricAvailable,
    authenticating
  };
};

export default useBiometricAuth;
