
import React from 'react';
import { Loader2, Mic, XCircle } from "lucide-react";

interface LoadingPreviewProps {
  isInitializing?: boolean;
  error?: string | null;
}

const LoadingPreview: React.FC<LoadingPreviewProps> = ({ 
  isInitializing = false,
  error = null
}) => {
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-5 bg-red-50 rounded-md mb-4 text-red-600">
        <XCircle className="h-8 w-8 mb-2" />
        <span className="text-sm font-medium text-center">Erro ao acessar dispositivo</span>
        <span className="text-xs mt-1 text-center">{error}</span>
      </div>
    );
  }
  
  if (isInitializing) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-blue-50 animate-pulse rounded-md mb-4">
        <Loader2 className="h-8 w-8 animate-spin mb-3 text-blue-600" />
        <span className="font-medium text-blue-700">Preparando dispositivos...</span>
        <span className="text-xs mt-2 text-blue-500">Aguarde enquanto acessamos seu microfone</span>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-4 bg-gray-50 rounded-md mb-4">
      <Mic className="h-5 w-5 animate-pulse mr-2 text-blue-600" />
      <span>Gravando...</span>
    </div>
  );
};

export default LoadingPreview;
