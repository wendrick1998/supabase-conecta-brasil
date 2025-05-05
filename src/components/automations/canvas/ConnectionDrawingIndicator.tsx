
import React from 'react';

interface ConnectionDrawingIndicatorProps {
  isVisible: boolean;
}

export const ConnectionDrawingIndicator: React.FC<ConnectionDrawingIndicatorProps> = ({
  isVisible
}) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-0 left-0 right-0 bg-indigo-600 text-white py-1 text-center text-sm">
      Clique em outro bloco para conectar ou no canvas para cancelar
    </div>
  );
};
