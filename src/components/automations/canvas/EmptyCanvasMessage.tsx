
import React, { useState, useEffect } from 'react';
import { ArrowDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export const EmptyCanvasMessage: React.FC = () => {
  const [visible, setVisible] = useState(false);
  
  // Animation to fade in the message after a short delay
  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);
  
  // Define animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center"
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div className="text-center max-w-md p-6 rounded-lg">
        <motion.div variants={itemVariants} className="mb-6">
          <div className={cn(
            "h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto",
            "border-2 border-dashed border-blue-300"
          )}>
            <ArrowDown className="text-blue-700 h-6 w-6" />
          </div>
        </motion.div>
        
        <motion.p variants={itemVariants} className="mb-4 text-lg font-medium text-gray-700">
          Arraste blocos do menu lateral para o canvas
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex items-center justify-center mb-4">
          <div className="h-px bg-gray-200 w-16" />
          <p className="mx-3 text-sm text-gray-400">ou</p>
          <div className="h-px bg-gray-200 w-16" />
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <button
            className="py-2 px-4 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors duration-200"
            onClick={() => {
              // This would trigger showing templates in the parent component
              const event = new CustomEvent('showTemplates');
              window.dispatchEvent(event);
            }}
          >
            Ver Templates
          </button>
          <p className="mt-2 text-sm text-gray-400">
            para usar um fluxo pré-definido
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};
