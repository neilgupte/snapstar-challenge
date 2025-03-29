
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Camera, Trophy, User, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Search, label: 'Explore' },
    { path: '/submit', icon: Camera, label: 'Submit' },
    { path: '/contests', icon: Trophy, label: 'Contests' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="flex h-16 items-center justify-around px-4">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex flex-col items-center justify-center h-full w-full transition-colors",
              location.pathname === item.path 
                ? "text-snapstar-purple"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon size={22} className={cn(
              "mb-1",
              location.pathname === item.path && "animate-pulse-star"
            )} />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default BottomNavigation;
