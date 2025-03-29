
import React from 'react';
import { useLocation } from 'react-router-dom';
import BottomNavigation from './BottomNavigation';
import TopNavigation from './TopNavigation';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Don't show navigation on auth pages
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  return (
    <div className="flex min-h-screen flex-col">
      <TopNavigation />
      <main className="flex-1 pb-16">
        {children}
      </main>
      
      {/* Show bottom navigation regardless of auth state */}
      <BottomNavigation />
    </div>
  );
};

export default Layout;
