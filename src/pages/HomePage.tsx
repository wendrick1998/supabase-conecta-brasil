
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, LayoutList, MessageSquare, BarChart, Zap, Award, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

const HomePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-dark-gradient text-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-12 lg:pt-20 pb-24">
        <nav className="flex justify-between items-center mb-20">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/02517599-ec7d-4486-a1f3-a3c80647cbda.png" 
              alt="Vendah+" 
              className="h-20 md:h-24"
            />
          </div>
          
          <div className="flex gap-4">
            {user ? (
              <Button 
                className="text-white hover:text-vendah-neon bg-transparent"
                variant="ghost"
                asChild
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button 
                  className="text-white hover:text-vendah-neon bg-transparent"
                  variant="ghost"
                  asChild
                >
                  <Link to="/auth?tab=login">Login</Link>
                </Button>
                <Button 
                  className="vendah-button"
                  asChild
                >
                  <Link to="/auth?tab=signup">Cadastro</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-1/2 space-y-6">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              <span className="vendah-gradient-text">Mais que um CRM.</span><br />
              Um motor de vendas.
            </h1>
            
            <p className="text-gray-300 text-lg mt-6 max-w-xl">
              Impulsione seu negócio com a plataforma que conecta, gerencia e converte leads em clientes satisfeitos.
            </p>
          </div>
          
          <div className="lg:w-1/2 flex justify-center animate-float">
            <div className="relative">
              <div className="absolute inset-0 bg-vendah-purple/20 blur-3xl rounded-full"></div>
              <div className="relative bg-vendah-black/50 border border-vendah-purple/30 backdrop-blur-sm p-4 rounded-xl shadow-2xl">
                <img
                  src="https://assets.website-files.com/642fc428f0c0b967b7a0bad3/649dabdaf8f4d6c9c9c22067_Dashboard%20CRM.webp"
                  alt="Vendah+ Dashboard"
                  className="w-full max-w-md rounded-lg shadow-lg"
                />
                <div className="absolute -top-3 -right-3 bg-vendah-neon text-vendah-black text-xs font-bold px-3 py-1 rounded-full shadow-neon">
                  NEW
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div className="bg-vendah-black py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              <span className="vendah-gradient-text">Recursos</span> Poderosos
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Ferramentas avançadas para impulsionar suas vendas e gerenciar seus clientes eficientemente
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="vendah-card group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-vendah-purple/20 flex items-center justify-center mb-4 
                              group-hover:shadow-neon transition-all duration-500">
                  <Users className="h-8 w-8 text-vendah-neon" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-white group-hover:text-vendah-neon transition-colors">
                  Gestão de Leads
                </h3>
                <p className="text-gray-400">
                  Organize e acompanhe seus leads de forma eficiente com ferramentas inteligentes
                </p>
              </CardContent>
            </Card>
            
            <Card className="vendah-card group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-vendah-purple/20 flex items-center justify-center mb-4
                              group-hover:shadow-neon transition-all duration-500">
                  <BarChart className="h-8 w-8 text-vendah-neon" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-white group-hover:text-vendah-neon transition-colors">
                  Pipeline de Vendas
                </h3>
                <p className="text-gray-400">
                  Visualize todo o processo de vendas com dashboards interativos e personalizáveis
                </p>
              </CardContent>
            </Card>
            
            <Card className="vendah-card group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-vendah-purple/20 flex items-center justify-center mb-4
                              group-hover:shadow-neon transition-all duration-500">
                  <MessageSquare className="h-8 w-8 text-vendah-neon" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-white group-hover:text-vendah-neon transition-colors">
                  Conversas Integradas
                </h3>
                <p className="text-gray-400">
                  Comunique-se com clientes diretamente pela plataforma sem trocar de ferramenta
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <Card className="vendah-card group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-vendah-purple/20 flex items-center justify-center mb-4
                              group-hover:shadow-neon transition-all duration-500">
                  <Zap className="h-8 w-8 text-vendah-neon" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-white group-hover:text-vendah-neon transition-colors">
                  Automações
                </h3>
                <p className="text-gray-400">
                  Crie fluxos de trabalho automatizados para aumentar a eficiência e diminuir tarefas repetitivas
                </p>
              </CardContent>
            </Card>
            
            <Card className="vendah-card group">
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-vendah-purple/20 flex items-center justify-center mb-4
                              group-hover:shadow-neon transition-all duration-500">
                  <Shield className="h-8 w-8 text-vendah-neon" />
                </div>
                <h3 className="font-bold text-xl mb-2 text-white group-hover:text-vendah-neon transition-colors">
                  Segurança Avançada
                </h3>
                <p className="text-gray-400">
                  Proteção de dados e conformidade com as regulamentações de privacidade
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20 bg-vendah-dark relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-vendah-purple to-vendah-neon"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Pronto para <span className="vendah-gradient-text">potencializar suas vendas</span>?
            </h2>
            <p className="text-gray-300 mb-8">
              Junte-se a milhares de empresas que estão transformando seus resultados com Vendah+
            </p>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-vendah-black py-10 border-t border-vendah-purple/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <img 
                src="/lovable-uploads/02517599-ec7d-4486-a1f3-a3c80647cbda.png" 
                alt="Vendah+" 
                className="h-16"
              />
            </div>
            <div className="text-gray-500 text-sm">
              © 2024 Vendah+. Todos os direitos reservados.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;

