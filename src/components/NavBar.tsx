
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { UserAccountNav } from './UserAccountNav';
import { useAuth } from '@/contexts/AuthContext';

interface NavBarProps {
  currentPath?: string;
}

const NavBar: React.FC<NavBarProps> = ({ currentPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-vendah-purple/20 bg-bg/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center px-5 py-4 justify-between">
        {/* Logo */}
        <div className="flex">
          <Link to="/dashboard" className="flex items-center">
            <img 
              src="/lovable-uploads/02517599-ec7d-4486-a1f3-a3c80647cbda.png" 
              alt="Vendah+" 
              className="h-24"
            />
          </Link>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="bg-bg border-vendah-purple/20">
            <div className="flex flex-col space-y-4 px-2 py-6">
              <Button
                variant="ghost"
                className="flex w-full justify-start text-white hover:text-vendah-neon hover:bg-vendah-purple/10"
                onClick={() => handleNavigation('/dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="flex w-full justify-start text-white hover:text-vendah-neon hover:bg-vendah-purple/10"
                onClick={() => handleNavigation('/leads')}
              >
                Leads
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <nav className="flex items-center space-x-1 text-sm font-medium">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-white ${isActive ? 'bg-vendah-purple/20 text-vendah-neon' : 'hover:bg-vendah-purple/10 hover:text-vendah-neon'}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/leads"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md text-white ${isActive ? 'bg-vendah-purple/20 text-vendah-neon' : 'hover:bg-vendah-purple/10 hover:text-vendah-neon'}`
              }
            >
              Leads
            </NavLink>
          </nav>
        </div>

        {/* User Account Navigation */}
        {user && (
          <div className="ml-auto flex items-center">
            <UserAccountNav />
          </div>
        )}
        
        {/* Non-authenticated navigation */}
        {!user && (
          <div className="flex gap-4 text-sm font-medium">
            <Link to="/auth?tab=login" className="text-text-muted hover:text-white transition-colors">
              Entrar
            </Link>
            <Link to="/auth?tab=signup" className="bg-vendah-neon text-vendah-black px-4 py-2 rounded hover:brightness-110 transition-all">
              Cadastrar
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
