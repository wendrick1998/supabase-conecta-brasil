
import { Link } from "react-router-dom";
import { Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  active?: boolean;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ to, active, icon, children }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
      active
        ? "bg-primary/10 text-primary hover:bg-primary/15"
        : "text-muted-foreground hover:text-foreground hover:bg-accent"
    )}
  >
    {icon}
    <span>{children}</span>
  </Link>
);

interface NavBarProps {
  currentPath: string;
}

const NavBar: React.FC<NavBarProps> = ({ currentPath }) => {
  return (
    <div className="border-b sticky top-0 z-30 bg-background">
      <div className="container flex h-16 items-center">
        <div className="mr-4">
          <Link to="/" className="font-bold text-xl">
            Conecta Brasil
          </Link>
        </div>
        <div className="flex items-center space-x-1">
          <NavItem 
            to="/leads" 
            active={currentPath.startsWith('/leads')} 
            icon={<Users className="h-4 w-4" />}
          >
            Leads
          </NavItem>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
