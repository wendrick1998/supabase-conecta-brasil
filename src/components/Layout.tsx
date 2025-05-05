
import React, { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavBar from "./NavBar";
import Footer from "./Footer";
import useHapticFeedback from "@/hooks/useHapticFeedback";

const Layout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const haptic = useHapticFeedback();
  const isConversationsPage = location.pathname.startsWith('/conversations');
  
  // Add haptic feedback on navigation
  useEffect(() => {
    // Provide subtle feedback when navigating
    haptic.tap();
  }, [location.pathname, haptic]);

  // Setup swipe navigation for iOS-like experience
  useEffect(() => {
    let touchStartX = 0;
    let touchEndX = 0;
    
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      touchEndX = e.changedTouches[0].clientX;
      handleSwipe();
    };
    
    const handleSwipe = () => {
      // Detect horizontal swipe
      const swipeDistance = touchEndX - touchStartX;
      const SWIPE_THRESHOLD = 100; // Minimum swipe distance
      
      // Only process swipes near the edge of the screen (for back/forward navigation)
      const isLeftEdgeSwipe = touchStartX < 50 && swipeDistance > SWIPE_THRESHOLD;
      const isRightEdgeSwipe = touchStartX > window.innerWidth - 50 && swipeDistance < -SWIPE_THRESHOLD;
      
      if (isLeftEdgeSwipe) {
        // Swipe from left edge to right (go back)
        haptic.tap();
        navigate(-1);
      } else if (isRightEdgeSwipe) {
        // Swipe from right edge to left (go forward)
        haptic.tap();
        navigate(1);
      }
    };
    
    // Add event listeners for swipe detection
    document.addEventListener('touchstart', handleTouchStart, { passive: true });
    document.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      // Clean up event listeners
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [navigate, haptic]);

  return (
    <div className={`min-h-screen flex flex-col ${isConversationsPage ? 'bg-[#121212]' : 'bg-gradient-radial'}`}>
      <NavBar currentPath={location.pathname} />
      <main className={`flex-1 ${isConversationsPage ? 'container-fluid p-0' : 'container mx-auto px-4'} py-0`}>
        <Outlet />
      </main>
      {!isConversationsPage && <Footer minimal={true} />}
    </div>
  );
};

export default Layout;
