
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar currentPath={location.pathname} />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
