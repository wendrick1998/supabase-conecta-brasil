
import React from 'react';

export const EmptyCanvasMessage: React.FC = () => {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
      <p className="mb-2 text-center">Arraste blocos do menu lateral para o canvas</p>
      <p className="mb-4 text-sm text-center">ou</p>
      <p className="text-center">Clique em "Ver Templates" para usar um fluxo pré-definido</p>
    </div>
  );
};
