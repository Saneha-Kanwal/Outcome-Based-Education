/**
 * User service for OBE System
 * API calls for user management endpoints
 */

import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const userService = {
  /**
   * Get list of users (Admin only)
   */
  getUsers: async (params = {}) => {
    const response = await api.get(API_ENDPOINTS.USERS.LIST, { params });
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUser: async (id) => {
    const response = await api.get(API_ENDPOINTS.USERS.GET(id));
    return response.data;
  },

  /**
   * Create user (Admin only)
   */
  createUser: async (userData) => {
    const response = await api.post(API_ENDPOINTS.USERS.CREATE, userData);
    return response.data;
  },

  /**
   * Update user
   */
  updateUser: async (id, updates) => {
    const response = await api.put(API_ENDPOINTS.USERS.UPDATE(id), updates);
    return response.data;
  },

  /**
   * Delete user (Admin only)
   */
  deleteUser: async (id) => {
    const response = await api.delete(API_ENDPOINTS.USERS.DELETE(id));
    return response.data;
  },

  /**
   * Get user profile
   */
  getProfile: async (id) => {
    const response = await api.get(API_ENDPOINTS.USERS.PROFILE(id));
    return response.data;
  },
};

