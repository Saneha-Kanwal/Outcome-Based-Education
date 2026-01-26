/**
 * Google OAuth button component for OBE System
 */

import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../common/Button';
import ErrorMessage from '../common/ErrorMessage';
import './GoogleOAuthButton.css';

const GoogleOAuthButton = ({ onSuccess }) => {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      // Get Google OAuth URL from backend or use environment variable
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      
      // Debug: Log environment variables
      console.log('Environment variables:', {
        VITE_GOOGLE_CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        VITE_API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
        allEnv: import.meta.env
      });
      
      if (!clientId || clientId === 'undefined' || clientId === '') {
        setError('Google OAuth is not configured. Please set VITE_GOOGLE_CLIENT_ID in your .env file and restart the dev server.');
        setLoading(false);
        return;
      }

      // Use backend redirect URI (must match Google Cloud Console configuration)
      // The redirect URI should be: http://localhost:8000/api/auth/google/callback
      // Make sure this EXACTLY matches what's in Google Cloud Console
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
      const redirectUri = `${apiBaseUrl}/auth/google/callback`;
      const scope = 'openid email profile';
      const responseType = 'code';

      // Build Google OAuth URL
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=${encodeURIComponent(responseType)}` +
        `&scope=${encodeURIComponent(scope)}` +
        `&access_type=offline` +
        `&prompt=consent`;

      console.log('=== Google OAuth Debug ===');
      console.log('Client ID:', clientId);
      console.log('API Base URL:', apiBaseUrl);
      console.log('Redirect URI:', redirectUri);
      console.log('Full Auth URL:', authUrl);
      console.log('========================');

      // Redirect to Google
      window.location.href = authUrl;
    } catch (err) {
      console.error('Google OAuth error:', err);
      setError('Failed to initiate Google login: ' + (err.message || 'Unknown error'));
      setLoading(false);
    }
  };

  // Handle OAuth callback (if code is in URL)
  const handleCallback = async (code) => {
    setLoading(true);
    const result = await loginWithGoogle(code);

    if (result.success) {
      onSuccess?.(result.user);
    } else {
      setError(result.error || 'Google authentication failed');
    }

    setLoading(false);
  };

  // Check if we're on the callback page
  if (window.location.pathname.includes('/auth/google/callback')) {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');

    if (code) {
      handleCallback(code);
      return <div>Authenticating with Google...</div>;
    }
  }

  return (
    <div className="google-oauth-button">
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="google-button"
      >
        <svg className="google-icon" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </Button>

      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default GoogleOAuthButton;

