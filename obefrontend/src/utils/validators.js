/**
 * Form validation utilities for OBE System frontend.
 */

/**
 * Validate email format.
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength.
 * @param {string} password - Password to validate
 * @returns {Object} Validation result with isValid and message
 */
export const validatePassword = (password) => {
  if (!password) {
    return { isValid: false, message: 'Password is required' };
  }
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters' };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate OTP code format (6 digits).
 * @param {string} code - OTP code to validate
 * @returns {boolean} True if code is valid
 */
export const isValidOTP = (code) => {
  if (!code) return false;
  const otpRegex = /^\d{6}$/;
  return otpRegex.test(code);
};

/**
 * Validate required field.
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field
 * @returns {Object} Validation result
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate number range.
 * @param {number} value - Number to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {Object} Validation result
 */
export const validateRange = (value, min, max) => {
  const num = Number(value);
  if (isNaN(num)) {
    return { isValid: false, message: 'Must be a valid number' };
  }
  if (num < min || num > max) {
    return { isValid: false, message: `Must be between ${min} and ${max}` };
  }
  return { isValid: true, message: '' };
};

/**
 * Validate assessment weight (0-100).
 * @param {number} weight - Weight to validate
 * @returns {Object} Validation result
 */
export const validateWeight = (weight) => {
  return validateRange(weight, 0, 100);
};

/**
 * Validate score (0 to max_score).
 * @param {number} score - Score to validate
 * @param {number} maxScore - Maximum possible score
 * @returns {Object} Validation result
 */
export const validateScore = (score, maxScore) => {
  return validateRange(score, 0, maxScore);
};

