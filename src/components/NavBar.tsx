
import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { UserAccountNav } from './UserAccountNav';
import { useAuth } from '@/contexts/AuthContext';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center">
        {/* Logo */}
        <div className="mr-4 flex">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="text-lg font-bold text-blue-700">ResolveClick</span>
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
          <SheetContent side="left">
            <div className="flex flex-col space-y-4 px-2 py-6">
              <Button
                variant="ghost"
                className="flex w-full justify-start"
                onClick={() => handleNavigation('/dashboard')}
              >
                Dashboard
              </Button>
              <Button
                variant="ghost"
                className="flex w-full justify-start"
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
                `px-3 py-2 rounded-md ${isActive ? 'bg-muted' : 'hover:bg-muted/50'}`
              }
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/leads"
              className={({ isActive }) =>
                `px-3 py-2 rounded-md ${isActive ? 'bg-muted' : 'hover:bg-muted/50'}`
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
      </div>
    </header>
  );
};

export default NavBar;
