/**
 * Axios HTTP Client Instance with Interceptors for OBE System Frontend
 * 
 * This file creates a configured Axios instance for making API requests to the backend.
 * It includes request and response interceptors that automatically:
 * - Add JWT authentication tokens to all requests
 * - Handle token refresh when tokens expire
 * - Redirect to login page when authentication fails
 * 
 * What this file does:
 * 1. Creates an Axios instance with base URL configuration
 * 2. Adds request interceptor to attach JWT tokens to requests
 * 3. Adds response interceptor to handle 401 errors and refresh tokens
 * 4. Provides a single API client for the entire application
 * 
 * File: src/services/api.js
 * Author: OBE System Development Team
 */

// Import Axios library
// Axios is a popular HTTP client library for JavaScript
// It makes it easy to send HTTP requests and handle responses
// Features: automatic JSON parsing, request/response interceptors, error handling
import axios from 'axios';

// ============================================================================
// CREATE AXIOS INSTANCE
// ============================================================================

// Create a configured Axios instance for our API
// An instance allows us to set default configuration that applies to all requests
// This is better than using axios directly because we can customize it
const api = axios.create({
  // Base URL for all API requests
  // This is the root URL where our backend API is running
  // import.meta.env.VITE_API_BASE_URL reads from .env file (Vite-specific)
  // If not set in .env, it defaults to http://localhost:8000/api
  // Example: http://localhost:8000/api (development) or https://api.example.com/api (production)
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  
  // Default headers for all requests
  // Content-Type: application/json tells the server we're sending JSON data
  headers: {
    'Content-Type': 'application/json',  // Request body will be in JSON format
  },
});

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

// Add a request interceptor
// Interceptors are functions that run before requests are sent
// This allows us to modify requests before they go out
api.interceptors.request.use(
  // This function runs before EVERY API request
  // It receives the request configuration object
  (config) => {
    // Get the access token from localStorage
    // localStorage is browser storage that persists even after page refresh
    // We store the JWT token here after successful login
    const token = localStorage.getItem('accessToken');
    
    // Check if we have a token
    if (token) {
      // Add the token to the Authorization header
      // Format: "Bearer <token>" - this is the standard JWT format
      // The backend will read this header to authenticate the user
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Return the modified config object
    // This config will be used to make the actual HTTP request
    return config;
  },
  // Error handler for request interceptor
  // This runs if there's an error before the request is sent
  (error) => {
    // Reject the promise with the error
    // This will cause the request to fail immediately
    return Promise.reject(error);
  }
);

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

// Add a response interceptor
// Interceptors are functions that run after responses are received
// This allows us to handle errors globally, like expired tokens
api.interceptors.response.use(
  // Success handler - runs when request succeeds (status 200-299)
  // If request is successful, just return the response as-is
  (response) => response,
  
  // Error handler - runs when request fails (status 400+)
  // This is where we handle things like expired tokens
  async (error) => {
    // Store reference to the original request configuration
    // We'll need this to retry the request after refreshing the token
    const originalRequest = error.config;

    // Check if error is 401 (Unauthorized) and we haven't already tried to refresh
    // 401 means the token is invalid or expired
    // _retry is a custom flag to prevent infinite retry loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Mark that we're attempting to refresh
      // This prevents infinite loops if refresh also fails
      originalRequest._retry = true;

      try {
        // Get the refresh token from localStorage
        // Refresh tokens are long-lived and used to get new access tokens
        const refreshToken = localStorage.getItem('refreshToken');
        
        // Check if refresh token exists
        if (!refreshToken) {
          // If no refresh token, we can't refresh - user must login again
          throw new Error('No refresh token available');
        }

        // Attempt to refresh the access token
        // We use axios directly (not our api instance) to avoid infinite loops
        // This request doesn't need authentication since it uses the refresh token
        const response = await axios.post(
          // Construct the refresh endpoint URL
          // Use the same base URL from environment variable
          `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'}/auth/refresh`,
          // Send the refresh token in the request body
          {
            refresh_token: refreshToken,
          }
        );

        // Extract the new tokens from the response
        // The backend returns both a new access_token and optionally a new refresh_token
        const { access_token, refresh_token: newRefreshToken } = response.data;

        // Update tokens in localStorage
        // Store the new access token - this will be used for future requests
        localStorage.setItem('accessToken', access_token);
        
        // If backend provided a new refresh token, update it too
        // Some systems rotate refresh tokens for security
        if (newRefreshToken) {
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        // Retry the original request with the new token
        // Update the Authorization header with the new access token
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        // Retry the original request using our api instance
        // This will now succeed because we have a valid token
        return api(originalRequest);
        
      } catch (refreshError) {
        // If refresh failed, we can't recover
        // This means: refresh token expired, user needs to login again
        
        // Clear all authentication data from localStorage
        // Remove access token
        localStorage.removeItem('accessToken');
        // Remove refresh token
        localStorage.removeItem('refreshToken');
        // Remove user data
        localStorage.removeItem('user');
        
        // Redirect user to login page
        // window.location.href causes a full page reload
        // This ensures all state is cleared and user starts fresh
        window.location.href = '/login';
        
        // Reject the promise with the refresh error
        return Promise.reject(refreshError);
      }
    }

    // If error is not 401, or we already tried refreshing, just reject normally
    // Let the component handle other types of errors (404, 500, etc.)
    return Promise.reject(error);
  }
);

// ============================================================================
// EXPORT
// ============================================================================

// Export the configured api instance
// Other files can import this to make API requests:
//   import api from './services/api';
//   const response = await api.get('/users');
export default api;

// ============================================================================
// USAGE EXAMPLES
// ============================================================================
// 
// Example 1: GET request
//   const response = await api.get('/users');
//   const users = response.data;
//
// Example 2: POST request
//   const response = await api.post('/users', { name: 'John', email: 'john@example.com' });
//   const newUser = response.data;
//
// Example 3: PUT request
//   const response = await api.put('/users/1', { name: 'Jane' });
//
// Example 4: DELETE request
//   await api.delete('/users/1');
//
// Note: All requests automatically:
// - Include JWT token in Authorization header
// - Use the base URL from environment variable
// - Handle token refresh if token expires
// - Redirect to login if authentication fails
