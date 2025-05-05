
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
      
      <div className="min-h-screen bg-dark-gradient flex flex-col justify-center items-center px-4 py-10">
        <div className="mb-10 flex flex-col items-center">
          <img 
            src="/lovable-uploads/02517599-ec7d-4486-a1f3-a3c80647cbda.png" 
            alt="Vendah+"
            className="h-32 mb-2" 
          />
        </div>
        
        {children}
        
        <div className="mt-8 text-gray-400 text-sm font-medium">
          © 2025 Vendah+. Todos os direitos reservados.
        </div>
      </div>
    </>
  );
};

export default AuthLayout;
