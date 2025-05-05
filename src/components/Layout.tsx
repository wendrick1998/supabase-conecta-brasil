
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout: React.FC = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar currentPath={location.pathname} />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer minimal={true} />
    </div>
  );
};

export default Layout;
