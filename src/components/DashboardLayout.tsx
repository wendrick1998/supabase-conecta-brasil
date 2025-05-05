
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Inbox, BarChart, Users, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserAccountNav } from "./UserAccountNav";

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex bg-gradient-radial">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-20 md:w-64 bg-surface border-r border-vendah-purple/20 py-6 flex flex-col items-center md:items-start z-10">
        {/* Logo */}
        <div className="mb-8 px-4">
          <div className="h-24">
            <img 
              src="/lovable-uploads/02517599-ec7d-4486-a1f3-a3c80647cbda.png" 
              alt="Vendah+" 
              className="h-full animate-subtle-glow"
            />
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col items-center md:items-start space-y-6 w-full px-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink 
                  to="/leads" 
                  className={({ isActive }) => 
                    `flex items-center space-x-3 ${isActive ? 'text-vendah-neon' : 'text-text-muted hover:text-white'} transition-colors`
                  }
                >
                  <Users size={24} />
                  <span className="hidden md:inline">Leads</span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="md:hidden">
                Leads
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink 
                  to="/pipeline" 
                  className={({ isActive }) => 
                    `flex items-center space-x-3 ${isActive ? 'text-vendah-neon' : 'text-text-muted hover:text-white'} transition-colors`
                  }
                >
                  <BarChart size={24} />
                  <span className="hidden md:inline">Pipeline</span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="md:hidden">
                Pipeline
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink 
                  to="/conversations" 
                  className={({ isActive }) => 
                    `flex items-center space-x-3 ${isActive ? 'text-vendah-neon' : 'text-text-muted hover:text-white'} transition-colors`
                  }
                >
                  <Inbox size={24} />
                  <span className="hidden md:inline">Conversas</span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="md:hidden">
                Conversas
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink 
                  to="/automacoes" 
                  className={({ isActive }) => 
                    `flex items-center space-x-3 ${isActive ? 'text-vendah-neon' : 'text-text-muted hover:text-white'} transition-colors`
                  }
                >
                  <Zap size={24} />
                  <span className="hidden md:inline">Automações</span>
                </NavLink>
              </TooltipTrigger>
              <TooltipContent side="right" className="md:hidden">
                Automações
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-20 md:ml-64">
        {/* Header with user account */}
        <header className="h-16 bg-surface border-b border-vendah-purple/20 px-6 flex items-center justify-end">
          <UserAccountNav />
        </header>

        {/* Page content */}
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
