
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from "@/integrations/supabase/client";
import { toast } from 'sonner';

// Extend the User type to include the additional properties used throughout the application
interface ExtendedUser extends User {
  isAdmin?: boolean;
  username?: string;
  isPremium?: boolean;
  maxSubmissionsPerWeek?: number;
  avatarUrl?: string;
  createdAt?: string; // This will replace created_at when accessing the user object
}

interface AuthContextType {
  user: ExtendedUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  isValidAge: (dateOfBirth: Date) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session?.user) {
          // Extend the user object with the additional properties
          const extendedUser: ExtendedUser = {
            ...session.user,
            isAdmin: session.user.email === 'admin@snapstar.com', // Simple admin check based on email
            username: session.user.email?.split('@')[0] || 'user', // Default username from email
            isPremium: false, // Default non-premium
            maxSubmissionsPerWeek: 3, // Default submission limit
            avatarUrl: '', // Default empty avatar URL
            createdAt: session.user.created_at, // Map created_at to createdAt
          };
          setUser(extendedUser);
        } else {
          setUser(null);
        }
        setIsLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        // Extend the user object with the additional properties
        const extendedUser: ExtendedUser = {
          ...session.user,
          isAdmin: session.user.email === 'admin@snapstar.com', // Simple admin check based on email
          username: session.user.email?.split('@')[0] || 'user', // Default username from email
          isPremium: false, // Default non-premium
          maxSubmissionsPerWeek: 3, // Default submission limit
          avatarUrl: '', // Default empty avatar URL
          createdAt: session.user.created_at, // Map created_at to createdAt
        };
        setUser(extendedUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const isValidAge = (dateOfBirth: Date): boolean => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 12;
  };

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      toast.success('Signed in successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast.info('Signed out');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading,
      signIn,
      signOut,
      isValidAge
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
