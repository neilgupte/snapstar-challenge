
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Home, Images, Camera, User, LogIn } from 'lucide-react';

const TopNavigation = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Don't show navigation on auth pages
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  if (isAuthPage || !user) {
    return null;
  }

  return (
    <header className="border-b bg-background py-3 hidden md:block">
      <div className="container flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          SnapStar
        </Link>
        
        <nav className="flex items-center space-x-4">
          <Link 
            to="/" 
            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${location.pathname === '/' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
          >
            <Home className="h-4 w-4" />
            <span>Home</span>
          </Link>
          <Link 
            to="/explore" 
            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${location.pathname === '/explore' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
          >
            <Images className="h-4 w-4" />
            <span>Explore</span>
          </Link>
          <Link 
            to="/submit" 
            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${location.pathname === '/submit' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
          >
            <Camera className="h-4 w-4" />
            <span>Submit</span>
          </Link>
          <Link 
            to="/profile" 
            className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${location.pathname === '/profile' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
          >
            <User className="h-4 w-4" />
            <span>Profile</span>
          </Link>
          
          {user.isAdmin && (
            <Link 
              to="/admin" 
              className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${location.pathname === '/admin' ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}
            >
              <span>Admin</span>
            </Link>
          )}
          
          <Button asChild size="sm" variant="default">
            <Link to="/upgrade">Upgrade</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};

export default TopNavigation;
