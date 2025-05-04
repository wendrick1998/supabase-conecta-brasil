
import { Button } from '@/components/ui/button';
import { Send, Loader2 } from 'lucide-react';

interface SendButtonProps {
  onClick: () => void;
  disabled: boolean;
  isLoading: boolean;
}

const SendButton = ({ onClick, disabled, isLoading }: SendButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className="bg-blue-600 hover:bg-blue-700"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
      ) : (
        <Send className="h-4 w-4 mr-2" />
      )}
      Enviar
    </Button>
  );
};

export default SendButton;
