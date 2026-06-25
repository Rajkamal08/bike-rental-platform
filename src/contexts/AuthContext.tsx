import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import api from '../utils/api';
interface User {
  id: string;
  phone: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  loading: boolean;
  sendOtp: (phone: string) => Promise<string>;
  verifyOtp: (sessionId: string, otp: string, phone: string) => Promise<User>;
  completeProfile: (
    phone: string,
    firstName: string,
    lastName: string,
    email: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (updatedUser: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAuth = async () => {
      setLoading(true);
      const storedToken = await AsyncStorage.getItem('authToken');
      if (storedToken) {
        setToken(storedToken);
        try {
          // Use api instance which has correct baseURL
          const response = await api.get('auth/verify-token', {
            headers: { Authorization: `Bearer ${storedToken}` },
          });
          setUser(response.data.user);
          setIsAuthenticated(true);
        } catch (err) {
          // Silent failure on initial load is better than red screen
          // Token is likely expired or user was deleted from DB
          console.log('Session expired or invalid token on initial load');
          await logout();
        }
      }
      setLoading(false);
    };
    loadAuth();
  }, []);

  // Set up interceptor to handle 401 errors globally
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      response => response,
      async (error: any) => {
        if (error.response && error.response.status === 401) {
          await logout();
        }
        return Promise.reject(error);
      },
    );

    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, []);

  const logout = async (): Promise<void> => {
    await AsyncStorage.removeItem('authToken');
    setIsAuthenticated(false);
    setUser(null);
    setToken(null);
  };

  const sendOtp = async (phone: string) => {
    const response = await api.post('auth/send-otp', { phone });
    return response.data.sessionId;
  };

  const verifyOtp = async (sessionId: string, otp: string, phone: string) => {
    const response = await api.post('auth/verify-otp', {
      sessionId,
      otp,
      phone,
    });

    const { token: newToken, user: userData } = response.data;
    if (newToken) {
      await AsyncStorage.setItem('authToken', newToken);
      setToken(newToken);
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      throw new Error('Token not received from server');
    }
    return userData;
  };

  const completeProfile = async (
    phone: string,
    firstName: string,
    lastName: string,
    email: string,
  ) => {
    const response = await api.post('auth/complete-profile', {
      phone,
      firstName,
      lastName,
      email,
    });

    setUser(response.data.user);
  };

  const updateUser = (updatedUser: Partial<User>) => {
    setUser(prev => (prev ? { ...prev, ...updatedUser } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        token,
        loading,
        sendOtp,
        verifyOtp,
        logout,
        completeProfile,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
