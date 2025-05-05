
import React from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface FormButtonsProps {
  isSubmitting: boolean;
  isEditing: boolean;
}

const FormButtons: React.FC<FormButtonsProps> = ({ isSubmitting, isEditing }) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-end space-x-2 pt-4">
      <Button 
        type="button" 
        variant="outline"
        onClick={() => navigate('/leads')}
        disabled={isSubmitting}
      >
        Cancelar
      </Button>
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {isEditing ? 'Salvar Alterações' : 'Criar Lead'}
      </Button>
    </div>
  );
};

export default FormButtons;
