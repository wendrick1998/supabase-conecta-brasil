
import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BarChart, MessageSquare, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import Footer from '@/components/Footer';
import FeatureCard from '@/components/home/FeatureCard';

const HomePage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen bg-bg text-white relative overflow-hidden">
      {/* Visual details - decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-vendah-purple/10 rounded-full filter blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-vendah-neon/5 rounded-full filter blur-3xl translate-x-1/2 translate-y-1/2"></div>
      <div className="absolute top-1/3 right-10 w-64 h-64 bg-vendah-blue/5 rounded-full filter blur-2xl"></div>
      <div className="absolute bottom-1/4 left-10 w-48 h-48 bg-vendah-purple/5 rounded-full filter blur-xl"></div>
      
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-12 lg:pt-20 pb-24 relative z-10">
        <nav className="flex justify-between items-center mb-20">
          <div className="flex items-center">
            <img 
              src="/lovable-uploads/3decb854-1aac-4760-b4a6-6dd4e3fc318c.png" 
              alt="Vendah+" 
              className="h-28 md:h-32 animate-subtle-glow"
            />
          </div>
          
          <div className="flex gap-4">
            {user ? (
              <Button 
                variant="ghost"
                asChild
              >
                <Link to="/dashboard">Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost"
                  asChild
                >
                  <Link to="/auth?tab=login">Entrar</Link>
                </Button>
                <Button 
                  variant="accent"
                  asChild
                >
                  <Link to="/auth?tab=signup">Cadastrar</Link>
                </Button>
              </>
            )}
          </div>
        </nav>
        
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="lg:w-full space-y-6 text-center lg:text-left">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
              <span className="vendah-gradient-text">Mais que um CRM.</span><br />
              Um motor de vendas.
            </h1>
            
            <p className="text-text-muted text-lg mt-6 max-w-xl mx-auto lg:mx-0">
              Impulsione seu negócio com a plataforma que conecta, gerencia e converte leads em clientes satisfeitos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start">
              <Button 
                variant="accent"
                size="lg"
                asChild
              >
                <Link to="/auth?tab=signup">Começar agora</Link>
              </Button>
              
              <Button 
                variant="outline"
                size="lg"
                asChild
              >
                <Link to="#features">Ver recursos</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div id="features" className="bg-surface py-24 relative section-spacing">
        <div className="absolute left-1/4 top-0 w-72 h-72 bg-vendah-purple/5 rounded-full filter blur-2xl"></div>
        <div className="absolute right-1/4 bottom-1/2 w-64 h-64 bg-vendah-blue/5 rounded-full filter blur-2xl"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              <span className="vendah-gradient-text">Recursos</span> Poderosos
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              Ferramentas avançadas para impulsionar suas vendas e gerenciar seus clientes eficientemente
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={Users}
              title="Gestão de Leads"
              description="Organize e acompanhe seus leads de forma eficiente com ferramentas inteligentes"
            />
            
            <FeatureCard 
              icon={BarChart}
              title="Pipeline de Vendas"
              description="Visualize todo o processo de vendas com dashboards interativos e personalizáveis"
            />
            
            <FeatureCard 
              icon={MessageSquare}
              title="Conversas Integradas"
              description="Comunique-se com clientes diretamente pela plataforma sem trocar de ferramenta"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <FeatureCard 
              icon={Zap}
              title="Automações"
              description="Crie fluxos de trabalho automatizados para aumentar a eficiência e diminuir tarefas repetitivas"
            />
            
            <FeatureCard 
              icon={Shield}
              title="Segurança Avançada"
              description="Proteção de dados e conformidade com as regulamentações de privacidade"
            />
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20 bg-surface relative overflow-hidden section-spacing">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-vendah-purple to-vendah-neon"></div>
        <div className="absolute left-1/3 bottom-0 w-80 h-80 bg-vendah-neon/3 rounded-full filter blur-3xl"></div>
        <div className="absolute right-1/4 top-1/2 w-48 h-48 bg-vendah-purple/5 rounded-full filter blur-xl"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">
              Pronto para <span className="vendah-gradient-text">potencializar suas vendas</span>?
            </h2>
            <p className="text-text-muted mb-8">
              Junte-se a milhares de empresas que estão transformando seus resultados com Vendah+
            </p>
            
            <Button 
              variant="accent"
              size="lg"
              asChild
            >
              <Link to="/auth?tab=signup">Começar agora</Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
