
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
      
      <div className="min-h-screen bg-gradient-to-b from-[#221F26] to-[#2A2730] flex flex-col justify-center items-center px-4 py-10">
        <div className="mb-8 flex flex-col items-center">
          <div className="logo-container p-6 mb-2 flex items-center justify-center">
            <img 
              src="/lovable-uploads/02517599-ec7d-4486-a1f3-a3c80647cbda.png" 
              alt="Vendah+"
              className="h-40 md:h-44 drop-shadow-[0_0_15px_rgba(93,46,140,0.85)]" 
            />
          </div>
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
