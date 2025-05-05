
import React from 'react';

interface FooterProps {
  minimal?: boolean;
}

const Footer: React.FC<FooterProps> = ({ minimal = false }) => {
  return (
    <footer className={`bg-surface py-4 text-center border-t border-vendah-purple/20 ${minimal ? 'mt-auto' : ''}`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-center mb-2">
          {!minimal && (
            <img 
              src="/lovable-uploads/02517599-ec7d-4486-a1f3-a3c80647cbda.png" 
              alt="Vendah+" 
              className="h-20 opacity-30"
            />
          )}
        </div>
        <p className="text-xs text-text-muted">
          © 2025 Vendah+. O lado humano da performance.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
