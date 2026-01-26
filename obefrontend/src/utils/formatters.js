/**
 * Formatting utilities for OBE System frontend.
 * Date, number, and string formatting functions.
 */

/**
 * Format a date to a readable string.
 * @param {Date|string} date - Date to format
 * @param {string} format - Format style ('short', 'long', 'datetime')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';

  const options = {
    short: { year: 'numeric', month: 'short', day: 'numeric' },
    long: { year: 'numeric', month: 'long', day: 'numeric' },
    datetime: { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' },
  };

  return d.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Format a number to a percentage.
 * @param {number} value - Number to format (0-100)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage string
 */
export const formatPercentage = (value, decimals = 1) => {
  if (value === null || value === undefined) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Format a number to a currency string.
 * @param {number} value - Number to format
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (value, currency = 'USD') => {
  if (value === null || value === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Format a number with thousand separators.
 * @param {number} value - Number to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (value) => {
  if (value === null || value === undefined) return '0';
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Format a grade letter from a percentage.
 * @param {number} percentage - Percentage score (0-100)
 * @returns {string} Grade letter (A, B, C, D, F)
 */
export const formatGrade = (percentage) => {
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

/**
 * Truncate a string to a maximum length.
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export const truncate = (str, maxLength = 50) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + '...';
};

