
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, X, User, Bell, Camera } from 'lucide-react';
import Logo from '@/components/Logo';

const TopNavigation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearch(false);
    }
  };

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
            <Logo />
            
            <div className="flex items-center gap-2">
              {user && !user.isPremium && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="mr-2 text-snapstar-purple border-snapstar-purple hover:bg-snapstar-purple hover:text-white"
                >
                  <Link to="/upgrade">Upgrade</Link>
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowSearch(true)}
                className="h-9 w-9"
              >
                <SearchIcon className="h-5 w-5" />
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default TopNavigation;
