
import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Home, 
  Images, 
  Camera, 
  User, 
  LogIn, 
  Search as SearchIcon, 
  X 
} from 'lucide-react';

const TopNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Don't show navigation on auth pages
  const isAuthPage = location.pathname === '/signin' || location.pathname === '/signup';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
    }
  };

  if (isAuthPage || !user) {
    return null;
  }

  return (
    <header className="border-b bg-background py-3">
      <div className="container flex items-center justify-between">
        {showSearch ? (
          <form onSubmit={handleSearch} className="flex w-full items-center">
            <Input
              type="text"
              placeholder="Search contests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <Button type="submit" variant="ghost" size="icon" className="ml-1">
              <SearchIcon className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => setShowSearch(false)}
              className="ml-1"
            >
              <X className="h-5 w-5" />
            </Button>
          </form>
        ) : (
          <>
            <Link to="/" className="text-xl font-bold">
              SnapStar
            </Link>
            
            <nav className="hidden md:flex items-center space-x-4">
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
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSearch(true)}
                className="h-9 w-9"
              >
                <SearchIcon className="h-5 w-5" />
              </Button>
              <Button asChild size="sm" variant="default" className="hidden md:inline-flex">
                <Link to="/upgrade">Upgrade</Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default TopNavigation;
