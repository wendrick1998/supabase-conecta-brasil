
import React from 'react';
import { Helmet } from 'react-helmet-async';

interface AuthLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
}

const AuthLayout = ({ children, pageTitle }: AuthLayoutProps) => {
  return (
    <>
      <Helmet>
        <title>Vendah+ - {pageTitle}</title>
      </Helmet>
      
      <div className="min-h-screen bg-bg flex flex-col justify-center items-center px-4 py-10 relative overflow-hidden">
        {/* Visual details - decorative elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-vendah-purple/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-vendah-neon/5 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-vendah-blue/5 rounded-full filter blur-2xl"></div>
        
        <div className="mb-8 flex flex-col items-center z-10">
          <img 
            src="/lovable-uploads/3decb854-1aac-4760-b4a6-6dd4e3fc318c.png" 
            alt="Vendah+"
            className="h-28 md:h-32 animate-subtle-glow" 
          />
        </div>
        
        <div className="z-10 w-full">
          {children}
        </div>
        
        <div className="mt-8 text-text-muted text-sm font-medium z-10">
          © 2025 Vendah+. Todos os direitos reservados.
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
