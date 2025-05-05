import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { LayoutGrid, BarChart, Users, Zap, MessageCircle, Activity } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserAccountNav } from "./UserAccountNav";
const DashboardLayout: React.FC = () => {
  // Add location to highlight active route
  const location = useLocation();

  // Navigation items ordered by priority
  const navigationItems = [{
    path: "/dashboard",
    label: "Dashboard",
    icon: <LayoutGrid size={24} />
  }, {
    path: "/leads",
    label: "Leads",
    icon: <Users size={24} />
  }, {
    path: "/pipeline",
    label: "Pipeline",
    icon: <BarChart size={24} />
  }, {
    path: "/automacoes",
    label: "Automações",
    icon: <Zap size={24} />
  }, {
    path: "/conversations",
    label: "Conversas",
    icon: <MessageCircle size={24} />
  }, {
    path: "/pulse",
    label: "Pulse",
    icon: <Activity size={24} />
  }];

  // Helper to check if a path is active (including nested routes)
  const isPathActive = (path: string) => {
    if (path === "/dashboard" && location.pathname === "/dashboard") return true;
    return path !== "/dashboard" && location.pathname.startsWith(path);
  };
  const isConversationsPage = location.pathname.startsWith('/conversations');
  return <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-20 md:w-64 bg-gradient-to-b from-vendah-purple/20 to-vendah-blue/10 backdrop-blur-md border-r border-vendah-purple/20 py-6 flex flex-col items-center md:items-start z-10">
        {/* Logo */}
        <div className="mb-12 px-0 md:px-6">
          <div className="h-16 md:h-24 flex justify-center md:justify-start">
            <img alt="Vendah+" className="h-full animate-subtle-glow" src="/lovable-uploads/0abe81d7-e28c-47b7-b096-8d218e84bc64.png" />
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex flex-col items-center md:items-start space-y-5 w-full px-4">
          <TooltipProvider>
            {navigationItems.map(item => <Tooltip key={item.path}>
                <TooltipTrigger asChild>
                  <NavLink to={item.path} title={item.label} className={({
                isActive
              }) => `flex items-center space-x-3 py-3 px-4 rounded-lg w-full transition-all duration-300 ${isPathActive(item.path) ? 'text-vendah-neon bg-vendah-neon/10 shadow-neon-subtle' : 'text-text-muted hover:text-white hover:bg-vendah-purple/20'}`}>
                    <div className={`${isPathActive(item.path) ? 'text-vendah-neon' : 'text-text-muted'} transition-colors`}>
                      {item.icon}
                    </div>
                    <span className="hidden md:inline font-medium">{item.label}</span>
                  </NavLink>
                </TooltipTrigger>
                <TooltipContent side="right" className="md:hidden bg-surface/90 border-vendah-purple/20">
                  {item.label}
                </TooltipContent>
              </Tooltip>)}
          </TooltipProvider>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-20 md:ml-64 bg-zinc-950">
        {/* Header with user account */}
        <header className="h-16 bg-gradient-to-r from-vendah-purple/5 to-vendah-blue/5 backdrop-blur-md border-b border-vendah-purple/20 px-6 flex items-center justify-end shadow-sm">
          <UserAccountNav />
        </header>

        {/* Page content */}
        <div className={`${isConversationsPage ? 'p-0' : 'p-6'}`}>
          <Outlet />
        </div>
      </main>
    </div>;
};
export default DashboardLayout;