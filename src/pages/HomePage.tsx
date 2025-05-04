
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, LayoutList, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const HomePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-white flex flex-col justify-center items-center p-8 lg:p-16">
      <div className="max-w-4xl w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col items-center lg:items-start mb-10 lg:mb-0 lg:w-1/2">
            <div className="text-center lg:text-left mb-8">
              <div className="mb-6 flex justify-center lg:justify-start">
                <span className="font-bold text-3xl text-blue-700">ResolveClick</span>
              </div>
              <h1 className="text-2xl lg:text-4xl font-semibold text-blue-700 mb-4">
                Conecte. Gerencie. Venda.
              </h1>
              <p className="text-gray-600 text-base mb-8">
                CRM moderno para equipes de vendas eficientes.
              </p>
            </div>

            <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 lg:space-x-4 w-full lg:w-auto">
              {user ? (
                <Button
                  className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 w-full lg:w-auto"
                  asChild
                >
                  <Link to="/dashboard">Ir para Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button
                    className="bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 w-full lg:w-auto"
                    asChild
                  >
                    <Link to="/auth?tab=login">Login</Link>
                  </Button>
                  <Button
                    className="bg-pink-500 text-white py-3 px-6 rounded-md hover:bg-pink-600 w-full lg:w-auto"
                    asChild
                  >
                    <Link to="/auth?tab=signup">Cadastro</Link>
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="lg:w-1/2">
            <div className="bg-gray-50 rounded-lg p-6 shadow-lg">
              <img
                src="/placeholder.svg"
                alt="CRM Dashboard"
                className="w-full h-auto rounded"
              />
            </div>
          </div>
        </div>

        <div className="mt-16 border-t pt-8">
          <h3 className="text-center text-gray-700 mb-6 text-lg font-medium">
            Principais recursos
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Users className="h-7 w-7 text-blue-700" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Gestão de Leads</h4>
              <p className="text-center text-gray-600 text-sm">
                Organize e acompanhe seus leads de forma eficiente
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-pink-100 flex items-center justify-center mb-4">
                <LayoutList className="h-7 w-7 text-pink-700" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Pipeline de Vendas</h4>
              <p className="text-center text-gray-600 text-sm">
                Visualize todo o processo de vendas em um único lugar
              </p>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
                <MessageSquare className="h-7 w-7 text-indigo-700" />
              </div>
              <h4 className="font-medium text-gray-800 mb-2">Mensagens</h4>
              <p className="text-center text-gray-600 text-sm">
                Comunique-se com clientes diretamente pela plataforma
              </p>
            </div>
          </div>
        </div>

        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>© 2024 ResolveClick. Todos os direitos reservados.</p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;
