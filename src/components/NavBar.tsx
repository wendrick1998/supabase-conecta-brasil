
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, BarChart, Users, Zap, Inbox, LayoutGrid, UserCog } from 'lucide-react';
import { UserAccountNav } from './UserAccountNav';
import { useAuth } from '@/contexts/AuthContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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

  const navigationItems = [
    { path: '/dashboard', label: 'Dashboard', icon: <LayoutGrid size={20} /> },
    { path: '/leads', label: 'Leads', icon: <Users size={20} /> },
    { path: '/pipeline', label: 'Pipeline', icon: <BarChart size={20} /> },
    { path: '/automacoes', label: 'Automações', icon: <Zap size={20} /> },
    { path: '/conversations', label: 'Conversas', icon: <Inbox size={20} /> },
    { path: '/channels', label: 'Canais', icon: <UserCog size={20} /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-vendah-purple/20 bg-bg/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center px-5 py-4 justify-between">
        {/* Logo */}
        <div className="flex">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/3decb854-1aac-4760-b4a6-6dd4e3fc318c.png" 
              alt="Vendah+" 
              className="h-10"
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
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  variant="ghost"
                  className="flex w-full justify-start text-white hover:text-vendah-neon hover:bg-vendah-purple/10"
                  onClick={() => handleNavigation(item.path)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Button>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
          <TooltipProvider>
            <nav className="flex items-center space-x-1 text-sm font-medium">
              {navigationItems.map((item) => (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `px-3 py-2 rounded-md flex items-center ${
                          isActive 
                            ? 'bg-vendah-neon/10 text-vendah-neon' 
                            : 'text-text-muted hover:bg-vendah-purple/10 hover:text-white'
                        }`
                      }
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </NavLink>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              ))}
            </nav>
          </TooltipProvider>
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
