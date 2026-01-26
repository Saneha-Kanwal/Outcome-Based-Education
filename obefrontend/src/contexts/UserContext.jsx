/**
 * User Context for OBE System
 * Provides user profile and permissions data
 */

import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const UserContext = createContext(null);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { user: authUser, isAuthenticated, updateUserData } = useAuth();
  const [userProfile, setUserProfile] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && authUser) {
      // Only update if user ID changed to prevent infinite loops
      if (!userProfile || userProfile.id !== authUser.id) {
        setUserProfile(authUser);
      }
      // Permissions would be loaded from API if needed
      // For now, derive from role
      setPermissions([]);
    } else {
      setUserProfile(null);
      setPermissions([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, authUser?.id]); // Only depend on user ID, not whole object

  const updateProfile = useCallback(async (updates) => {
    if (!userProfile) return { success: false, error: 'Not authenticated' };

    try {
      const response = await api.put(`/users/${userProfile.id}`, updates);
      const updatedUser = response.data;
      setUserProfile(updatedUser);
      updateUserData((prev) => ({
        ...prev,
        first_name: updatedUser.first_name,
        last_name: updatedUser.last_name,
      }));
      return { success: true, user: updatedUser };
    } catch (error) {
      console.error('Profile update error:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update profile',
      };
    }
  }, [userProfile, updateUserData]);

  const refreshProfile = useCallback(async () => {
    if (!userProfile) return;

    setLoading(true);
    try {
      const response = await api.get(`/users/${userProfile.id}/profile`);
      setUserProfile(response.data);
    } catch (error) {
      console.error('Profile refresh error:', error);
    } finally {
      setLoading(false);
    }
  }, [userProfile]);

  const value = useMemo(() => ({
    user: userProfile,
    permissions,
    loading,
    updateProfile,
    refreshProfile,
  }), [userProfile, permissions, loading, updateProfile, refreshProfile]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

