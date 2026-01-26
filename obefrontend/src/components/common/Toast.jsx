/**
 * Toast notification component for OBE System
 * Lightweight alternative to third-party libraries.
 */

import { useEffect, memo } from 'react';
import './Toast.css';

const Toast = memo(({ message, type = 'info', duration = 4000, onClose }) => {
  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [message, duration, onClose]);

  if (!message) {
    return null;
  }

  return (
    <div className={`toast toast-${type}`} role="alert" aria-live="assertive">
      <span className="toast-message">{message}</span>
      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Dismiss notification"
      >
        ×
      </button>
    </div>
  );
});

Toast.displayName = 'Toast';

export default Toast;

