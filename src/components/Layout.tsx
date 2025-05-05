
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";

const Layout: React.FC = () => {
  const location = useLocation();
  const isConversationsPage = location.pathname.startsWith('/conversations');

  return (
    <div className={`min-h-screen flex flex-col ${isConversationsPage ? 'bg-[#121212]' : 'bg-gradient-radial'}`}>
      <NavBar currentPath={location.pathname} />
      <main className={`flex-1 ${isConversationsPage ? '' : 'container mx-auto px-4'} py-6`}>
        <Outlet />
      </main>
      <Footer minimal={true} />
    </div>
  );
};

export default Layout;
