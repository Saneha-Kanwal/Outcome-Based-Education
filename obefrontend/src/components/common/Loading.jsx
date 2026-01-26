/**
 * Loading component for OBE System
 * Spinner and loading states
 */

import './Loading.css';

const Loading = ({ message = 'Loading...', fullScreen = false }) => {
  if (fullScreen) {
    return (
      <div className="loading-overlay">
        <div className="loading-content">
          <div className="spinner"></div>
          <p>{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loading-inline">
      <div className="spinner"></div>
      {message && <span>{message}</span>}
    </div>
  );
};

export default Loading;

