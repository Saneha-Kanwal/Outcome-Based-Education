/**
 * Common helper functions for OBE System frontend.
 */

/**
 * Check if user has a specific role.
 * @param {Object} user - User object with role property
 * @param {string} role - Role to check
 * @returns {boolean} True if user has the role
 */
export const hasRole = (user, role) => {
  if (!user || !user.role) return false;
  return user.role.name === role || user.role === role;
};

/**
 * Check if user has any of the specified roles.
 * @param {Object} user - User object with role property
 * @param {string[]} roles - Array of roles to check
 * @returns {boolean} True if user has any of the roles
 */
export const hasAnyRole = (user, roles) => {
  if (!user || !user.role) return false;
  const userRole = user.role.name || user.role;
  return roles.includes(userRole);
};

/**
 * Get user's full name.
 * @param {Object} user - User object with first_name and last_name
 * @returns {string} Full name
 */
export const getFullName = (user) => {
  if (!user) return '';
  return `${user.first_name || ''} ${user.last_name || ''}`.trim();
};

/**
 * Debounce a function call.
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Deep clone an object.
 * @param {any} obj - Object to clone
 * @returns {any} Cloned object
 */
export const deepClone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if a value is empty (null, undefined, empty string, empty array, empty object).
 * @param {any} value - Value to check
 * @returns {boolean} True if value is empty
 */
export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Get error message from API error response.
 * @param {Error} error - Error object
 * @returns {string} Error message
 */
export const getErrorMessage = (error) => {
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

