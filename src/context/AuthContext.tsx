import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import type { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('velora_admin_token'));
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('velora_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Verify session on initial load
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('velora_admin_token');
      if (!storedToken) {
        setUser(null);
        setToken(null);
        setLoading(false);
        return;
      }

      try {
        const res = await authService.getMe();
        if (res && res.success && res.user) {
          if (res.user.role !== 'admin') {
            throw new Error('Unauthorized role');
          }
          setUser(res.user);
          localStorage.setItem('velora_admin_user', JSON.stringify(res.user));
        } else {
          throw new Error('Failed to fetch user');
        }
      } catch (err) {
        localStorage.removeItem('velora_admin_token');
        localStorage.removeItem('velora_admin_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await authService.login(email, password);
      if (!res.success || !res.token || !res.user) {
        throw new Error(res.message || 'Login failed');
      }

      if (res.user.role !== 'admin') {
        throw new Error('Access denied: You do not have administrator permissions.');
      }

      localStorage.setItem('velora_admin_token', res.token);
      localStorage.setItem('velora_admin_user', JSON.stringify(res.user));
      setToken(res.token);
      setUser(res.user);
      showToast('Welcome back, Administrator!', 'success');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Invalid administrator credentials';
      showToast(msg, 'error');
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('velora_admin_token');
    localStorage.removeItem('velora_admin_user');
    setUser(null);
    setToken(null);
    showToast('Logged out of Admin Portal successfully', 'info');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user && user.role === 'admin',
        loading,
        login,
        logout,
        toast,
        showToast
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
