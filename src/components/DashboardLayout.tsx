
import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { LayoutGrid, BarChart, Users, Zap, Inbox, Activity } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserAccountNav } from "./UserAccountNav";

const DashboardLayout: React.FC = () => {
  // Navigation items ordered by priority
  const navigationItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutGrid size={24} /> },
    { path: "/leads", label: "Leads", icon: <Users size={24} /> },
    { path: "/pipeline", label: "Pipeline", icon: <BarChart size={24} /> },
    { path: "/automacoes", label: "Automações", icon: <Zap size={24} /> },
    { path: "/conversations", label: "Conversas", icon: <Inbox size={24} /> },
    { path: "/pulse", label: "Pulse", icon: <Activity size={24} /> },
  ];

  return (
    <div className="min-h-screen flex bg-gradient-radial">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-20 md:w-64 bg-surface/90 backdrop-blur-md border-r border-vendah-purple/20 py-6 flex flex-col items-center md:items-start z-10">
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
            {navigationItems.map((item) => (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <NavLink 
                    to={item.path}
                    title={item.label}
                    className={({ isActive }) => 
                      `flex items-center space-x-3 hover-glow btn-press ${
                        isActive 
                          ? 'text-vendah-neon bg-vendah-neon/10'
                          : 'text-text-muted hover:text-white'
                      } transition-colors`
                    }
                  >
                    {item.icon}
                    <span className="hidden md:inline">{item.label}</span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="md:hidden">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-20 md:ml-64">
        {/* Header with user account */}
        <header className="h-16 bg-surface/90 backdrop-blur-md border-b border-vendah-purple/20 px-6 flex items-center justify-end shadow-sm">
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
