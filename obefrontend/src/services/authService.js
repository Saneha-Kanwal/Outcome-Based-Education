/**
 * Authentication service for OBE System
 * API calls for authentication endpoints
 */

import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

export const authService = {
  /**
   * Register a new user
   */
  register: async (email, password, first_name, last_name) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, {
      email,
      password,
      first_name,
      last_name,
    });
    return response.data;
  },

  /**
   * Login with email and password
   */
  login: async (email, password) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password,
    });
    return response.data;
  },

  /**
   * Google OAuth login
   */
  googleLogin: async (code) => {
    const response = await api.post(API_ENDPOINTS.AUTH.GOOGLE, { code });
    return response.data;
  },

  /**
   * Request OTP code
   */
  requestOTP: async (email) => {
    const response = await api.post(API_ENDPOINTS.AUTH.OTP_REQUEST, { email });
    return response.data;
  },

  /**
   * Verify OTP and login
   */
  verifyOTP: async (email, code) => {
    const response = await api.post(API_ENDPOINTS.AUTH.OTP_VERIFY, {
      email,
      code,
    });
    return response.data;
  },

  /**
   * Refresh access token
   */
  refreshToken: async (refresh_token) => {
    const response = await api.post(API_ENDPOINTS.AUTH.REFRESH, {
      refresh_token,
    });
    return response.data;
  },

  /**
   * Logout
   */
  logout: async () => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },
};

