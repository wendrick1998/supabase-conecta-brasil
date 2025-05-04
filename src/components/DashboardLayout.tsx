
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Inbox, BarChart, Users, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserAccountNav } from "./UserAccountNav";

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-20 md:w-64 bg-white border-r py-6 flex flex-col items-center md:items-start z-10">
        {/* Logo */}
        <div className="mb-8 px-4">
          <span className="text-xl font-bold text-blue-700">ResolveClick</span>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col items-center md:items-start space-y-6 w-full px-4">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <NavLink 
                  to="/leads" 
                  className={({ isActive }) => 
                    `flex items-center space-x-3 ${isActive ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'} transition-colors`
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
                    `flex items-center space-x-3 ${isActive ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'} transition-colors`
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
                    `flex items-center space-x-3 ${isActive ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'} transition-colors`
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
                    `flex items-center space-x-3 ${isActive ? 'text-blue-700' : 'text-gray-600 hover:text-blue-700'} transition-colors`
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
        <header className="h-16 bg-white border-b px-6 flex items-center justify-end">
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
