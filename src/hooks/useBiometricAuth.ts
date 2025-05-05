
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { isIOS } from '@/pwaFeatures';

// Type definition for biometric authentication status
type BiometricStatus = 'available' | 'unavailable' | 'unknown';

// Hook for biometric authentication
const useBiometricAuth = () => {
  const [biometricAvailable, setBiometricAvailable] = useState<BiometricStatus>('unknown');
  const [authenticating, setAuthenticating] = useState(false);

  // Check biometric availability on mount
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  // Check if biometric authentication is available
  const checkBiometricAvailability = async () => {
    try {
      // We can use PublicKeyCredential API as a way to detect if the device
      // supports biometric authentication
      if (window.PublicKeyCredential && 
          PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setBiometricAvailable(available ? 'available' : 'unavailable');
      } else {
        setBiometricAvailable('unavailable');
      }
    } catch (error) {
      console.error('Error checking biometric availability:', error);
      setBiometricAvailable('unavailable');
    }
  };

  // Authenticate with biometrics - returns success status
  const authenticate = async (): Promise<boolean> => {
    // If biometrics aren't available, return false
    if (biometricAvailable !== 'available') {
      toast.error('Autenticação biométrica não disponível neste dispositivo');
      return false;
    }

    setAuthenticating(true);

    try {
      // Create a simple credential to verify user presence
      // This will trigger TouchID/FaceID on devices that support it
      const publicKey = {
        challenge: new Uint8Array([1, 2, 3, 4]),
        rp: { name: 'Vendah+' },
        user: {
          id: new Uint8Array([1, 2, 3, 4]), 
          name: 'vendah-user',
          displayName: 'Usuário Vendah+'
        },
        pubKeyCredParams: [{ type: 'public-key', alg: -7 }],
        timeout: 60000,
        authenticatorSelection: {
          authenticatorAttachment: 'platform',
          userVerification: 'required' 
        }
      };

      // Attempt to create a credential (triggers biometric)
      await navigator.credentials.create({ publicKey });
      
      setAuthenticating(false);
      toast.success('Autenticação biométrica concluída');
      return true;
    } catch (error) {
      console.error('Error using biometric auth:', error);
      
      // Custom message for user cancel
      if (error instanceof DOMException && error.name === 'NotAllowedError') {
        toast.error('Autenticação biométrica cancelada pelo usuário');
      } else {
        toast.error('Falha na autenticação biométrica');
      }
      
      setAuthenticating(false);
      return false;
    }
  };

  return {
    biometricAvailable,
    authenticating,
    authenticate,
    checkBiometricAvailability
  };
};

export default useBiometricAuth;
