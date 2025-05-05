
import React from 'react';
import { Button } from '@/components/ui/button';
import { Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IdleButtonProps {
  buttonRef: React.RefObject<HTMLButtonElement>;
  size: 'sm' | 'md' | 'lg';
  className?: string;
  onClick: () => void;
}

const IdleButton: React.FC<IdleButtonProps> = ({
  buttonRef,
  size,
  className,
  onClick
}) => {
  // Button size classes
  const sizeClasses = {
    'sm': 'h-10 w-10',
    'md': 'h-12 w-12',
    'lg': 'h-16 w-16'
  };
  
  return (
    <Button
      ref={buttonRef}
      variant="outline"
      size="icon"
      className={cn(
        "border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-300", 
        sizeClasses[size], 
        className
      )}
      onClick={onClick}
    >
      <Mic className="h-5 w-5 text-gray-500" />
    </Button>
  );
};

export default IdleButton;
