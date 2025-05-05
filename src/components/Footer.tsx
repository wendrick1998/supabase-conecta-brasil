
import React from 'react';
import { Link } from 'react-router-dom';

interface FooterProps {
  minimal?: boolean;
}

const Footer: React.FC<FooterProps> = ({ minimal = false }) => {
  if (minimal) {
    return (
      <footer className="py-4 border-t border-vendah-purple/10 bg-surface/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <p className="text-center text-text-muted text-sm">
            © 2025 Vendah+. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-surface py-12 border-t border-vendah-purple/20 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-vendah-purple/30 to-vendah-neon/20"></div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="mb-4">
              <img 
                src="/lovable-uploads/02517599-ec7d-4486-a1f3-a3c80647cbda.png" 
                alt="Vendah+" 
                className="h-12" 
              />
            </div>
            <p className="text-text-muted">
              Impulsione seu negócio com a plataforma que conecta, 
              gerencia e converte leads em clientes satisfeitos.
            </p>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Recursos</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-text-muted hover:text-vendah-neon transition-colors">Leads</Link></li>
              <li><Link to="#" className="text-text-muted hover:text-vendah-neon transition-colors">Pipeline</Link></li>
              <li><Link to="#" className="text-text-muted hover:text-vendah-neon transition-colors">Conversas</Link></li>
              <li><Link to="#" className="text-text-muted hover:text-vendah-neon transition-colors">Automações</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Suporte</h3>
            <ul className="space-y-2">
              <li><Link to="#" className="text-text-muted hover:text-vendah-neon transition-colors">Ajuda</Link></li>
              <li><Link to="#" className="text-text-muted hover:text-vendah-neon transition-colors">Documentação</Link></li>
              <li><Link to="#" className="text-text-muted hover:text-vendah-neon transition-colors">Contato</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-4 border-t border-vendah-purple/20">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-text-muted text-sm">
              © 2025 Vendah+. Todos os direitos reservados.
            </p>
            
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link to="#" className="text-text-muted hover:text-vendah-neon transition-colors">
                Termos de Uso
              </Link>
              <Link to="#" className="text-text-muted hover:text-vendah-neon transition-colors">
                Privacidade
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
