/**
 * Error message component for OBE System
 * Displays error messages with consistent styling
 */

import './ErrorMessage.css';

const ErrorMessage = ({ message, className = '' }) => {
  if (!message) return null;

  return (
    <div className={`error-message ${className}`.trim()}>
      <span className="error-icon">⚠</span>
      <span>{message}</span>
    </div>
  );
};

export default ErrorMessage;

