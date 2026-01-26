/**
 * Authentication Context for OBE System
 * Provides global authentication state and methods
 */

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('accessToken');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          // Validate user object has required fields
          if (parsedUser && parsedUser.id && parsedUser.email) {
            // Only update if user changed to prevent unnecessary re-renders
            setUser(prevUser => {
              if (prevUser?.id === parsedUser.id && 
                  prevUser?.email === parsedUser.email) {
                return prevUser; // Return same reference if unchanged
              }
              return parsedUser;
            });
            setIsAuthenticated(true);
          } else {
            console.warn('Invalid user data in localStorage, clearing...');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error parsing stored user:', error);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
      // Always set loading to false after check
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, refresh_token, user: userData } = response.data;

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('user', JSON.stringify(userData));

      // Debug: Log the user data structure
      console.log('Login - Full userData from backend:', JSON.stringify(userData, null, 2));
      console.log('Login - userData.role:', userData.role);
      console.log('Login - userData.role?.name:', userData.role?.name);
      console.log('Login - userData.role_id:', userData.role_id);

      // Use functional update to prevent unnecessary re-renders
      setUser(prevUser => {
        if (prevUser?.id === userData.id && prevUser?.email === userData.email) {
          return prevUser; // Return same reference if unchanged
        }
        return userData;
      });
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      console.error('Error response:', error.response);
      
      // Extract error message from different possible response formats
      let errorMessage = 'Login failed';
      if (error.response?.data) {
        if (error.response.data.detail) {
          errorMessage = error.response.data.detail;
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }, []);

  const register = useCallback(async (email, password, first_name, last_name) => {
    try {
      const response = await api.post('/auth/register', {
        email,
        password,
        first_name,
        last_name,
      });
      const { access_token, refresh_token, user: userData } = response.data;

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(prevUser => {
        if (prevUser?.id === userData.id && prevUser?.email === userData.email) {
          return prevUser;
        }
        return userData;
      });
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  }, []);

  const loginWithGoogle = useCallback(async (code) => {
    try {
      const response = await api.post('/auth/google', { code });
      const { access_token, refresh_token, user: userData } = response.data;

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(prevUser => {
        if (prevUser?.id === userData.id && prevUser?.email === userData.email) {
          return prevUser;
        }
        return userData;
      });
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      console.error('Google OAuth error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Google authentication failed',
      };
    }
  }, []);

  const requestOTP = useCallback(async (email) => {
    try {
      const response = await api.post('/auth/otp/request', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('OTP request error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to send OTP',
      };
    }
  }, []);

  const verifyOTP = useCallback(async (email, code) => {
    try {
      const response = await api.post('/auth/otp/verify', { email, code });
      const { access_token, refresh_token, user: userData } = response.data;

      localStorage.setItem('accessToken', access_token);
      localStorage.setItem('refreshToken', refresh_token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(prevUser => {
        if (prevUser?.id === userData.id && prevUser?.email === userData.email) {
          return prevUser;
        }
        return userData;
      });
      setIsAuthenticated(true);
      return { success: true, user: userData };
    } catch (error) {
      console.error('OTP verification error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Invalid OTP code',
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await api.post('/auth/refresh', {
        refresh_token: refreshToken,
      });

      const { access_token, refresh_token: newRefreshToken } = response.data;
      localStorage.setItem('accessToken', access_token);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      return { success: true };
    } catch (error) {
      console.error('Token refresh error:', error);
      logout();
      return { success: false };
    }
  }, [logout]);

  const updateUserData = useCallback((updates) => {
    setUser((prevUser) => {
      if (!prevUser) return prevUser;
      const nextUser =
        typeof updates === 'function'
          ? updates(prevUser)
          : { ...prevUser, ...updates };
      localStorage.setItem('user', JSON.stringify(nextUser));
      return nextUser;
    });
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  // Use stable user ID instead of whole user object
  const userStableKey = user ? `${user.id}-${user.email}` : null;
  const value = useMemo(() => ({
    user,
    isAuthenticated,
    loading,
    login,
    register,
    loginWithGoogle,
    requestOTP,
    verifyOTP,
    logout,
    refreshToken,
    updateUserData,
  }), [userStableKey, isAuthenticated, loading, login, register, loginWithGoogle, requestOTP, verifyOTP, logout, refreshToken, updateUserData]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

