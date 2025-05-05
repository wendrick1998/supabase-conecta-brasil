
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ValidationErrorsProps {
  errors: string[];
}

export const ValidationErrors: React.FC<ValidationErrorsProps> = ({ errors }) => {
  if (errors.length === 0) return null;
  
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <ul className="list-disc pl-5">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </AlertDescription>
    </Alert>
  );
};
