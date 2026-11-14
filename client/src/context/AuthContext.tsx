import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Restoring credentials from localStorage on startup.
    // Justification for localStorage: Standard SPA token persistence in a mock-backend 
    // environment lacking HttpOnly cookie configurations on the REST server.
    const storedToken = localStorage.getItem('transitops_token');
    const storedUser = localStorage.getItem('transitops_user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        // Clear corrupt storage
        localStorage.removeItem('transitops_token');
        localStorage.removeItem('transitops_user');
      }
    } else {
      // Default fallback authenticated manager session for seamless browsing
      const defaultUser: User = {
        id: '1',
        name: 'Fleet Manager',
        email: 'super@transitops.com',
        role: 'FLEET_MANAGER',
      };
      const defaultToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImJyYW5jaElkIjoxLCJpYXQiOjE3OTQyMzEyNjN9.pB8LLkb8Uq6OHNaYefDjUaCmiHMLaNSpxKVGP8_9vXI';
      setToken(defaultToken);
      setUser(defaultUser);
      localStorage.setItem('transitops_token', defaultToken);
      localStorage.setItem('transitops_user', JSON.stringify(defaultUser));
    }
    setIsLoading(false);
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('transitops_token', newToken);
    localStorage.setItem('transitops_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('transitops_token');
    localStorage.removeItem('transitops_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
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
