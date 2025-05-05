
import React from 'react';
import { Loader2 } from "lucide-react";

const LoadingPreview: React.FC = () => {
  return (
    <div className="flex items-center justify-center mb-4">
      <Loader2 className="h-5 w-5 animate-spin mr-2" />
      <span>Gravando...</span>
    </div>
  );
};

export default LoadingPreview;
