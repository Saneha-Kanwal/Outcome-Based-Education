/**
 * Input component for OBE System
 * Reusable input field with validation states
 */

import './Input.css';

const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  disabled = false,
  className = '',
  ...props
}) => {
  const inputId = name || `input-${Math.random().toString(36).substr(2, 9)}`;
  const inputClasses = `input ${error ? 'input-error' : ''} ${className}`.trim();

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={inputClasses}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
};

export default Input;

