
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  username: string;
  avatarUrl?: string;
  isPremium: boolean;
  isAdmin: boolean;
  submissionsThisWeek: number;
  maxSubmissionsPerWeek: number;
  createdAt: Date;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, dateOfBirth: Date, acceptTerms: boolean) => Promise<void>;
  signOut: () => void;
  isValidAge: (dateOfBirth: Date) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data for demonstration
const mockUsers = [
  {
    id: '1',
    email: 'admin@snapstar.com',
    password: 'admin123',
    username: 'AdminUser',
    avatarUrl: '/placeholder.svg',
    isPremium: true,
    isAdmin: true,
    submissionsThisWeek: 0,
    maxSubmissionsPerWeek: 999,
    createdAt: new Date('2023-01-01')
  },
  {
    id: '2',
    email: 'user@example.com',
    password: 'password123',
    username: 'RegularUser',
    avatarUrl: '/placeholder.svg',
    isPremium: false,
    isAdmin: false,
    submissionsThisWeek: 1,
    maxSubmissionsPerWeek: 3,
    createdAt: new Date('2023-02-15')
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('snapstar_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          createdAt: new Date(parsedUser.createdAt)
        });
      } catch (error) {
        console.error('Failed to parse stored user:', error);
        localStorage.removeItem('snapstar_user');
      }
    }
    setIsLoading(false);
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
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid email or password');
      }
      
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('snapstar_user', JSON.stringify(userWithoutPassword));
      toast.success('Signed in successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, username: string, dateOfBirth: Date, acceptTerms: boolean) => {
    setIsLoading(true);
    
    try {
      // Check if email is already in use
      if (mockUsers.some(u => u.email === email)) {
        throw new Error('Email already in use');
      }
      
      // Validate age
      if (!isValidAge(dateOfBirth)) {
        throw new Error('You must be at least 12 years old to register');
      }
      
      // Validate terms acceptance
      if (!acceptTerms) {
        throw new Error('You must accept the Terms and Conditions');
      }
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newUser: User = {
        id: `${mockUsers.length + 1}`,
        email,
        username,
        avatarUrl: '/placeholder.svg',
        isPremium: false,
        isAdmin: false,
        submissionsThisWeek: 0,
        maxSubmissionsPerWeek: 3,
        createdAt: new Date()
      };
      
      setUser(newUser);
      localStorage.setItem('snapstar_user', JSON.stringify(newUser));
      toast.success('Account created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('snapstar_user');
    toast.info('Signed out');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading,
      signIn,
      signUp,
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
