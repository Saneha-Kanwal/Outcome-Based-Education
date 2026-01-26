/**
 * Google OAuth Callback page
 * Handles the redirect from backend after Google OAuth
 */

import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../../components/common/Loading';

const GoogleOAuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loginWithGoogle } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      const accessToken = searchParams.get('access_token');
      const refreshToken = searchParams.get('refresh_token');
      const userEncoded = searchParams.get('user');
      const error = searchParams.get('error');
      const code = searchParams.get('code');

      // If we have tokens from backend redirect, store them
      if (accessToken && refreshToken) {
        try {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          if (userEncoded) {
            try {
              const base64 = userEncoded.replace(/-/g, '+').replace(/_/g, '/');
              const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
              const decodedUser = JSON.parse(atob(padded));
              if (decodedUser?.id) {
                localStorage.setItem('user', JSON.stringify(decodedUser));
              }
            } catch (userErr) {
              console.warn('Failed to decode user payload from Google OAuth redirect:', userErr);
            }
          }
          
          // Fetch user data using the token
          // For now, redirect to dashboard - the auth context will load user data
          navigate('/dashboard', { replace: true });
        } catch (err) {
          console.error('Error handling OAuth callback:', err);
          navigate('/login?error=oauth_failed', { replace: true });
        }
      } 
      // If we have a code, send it to backend
      else if (code) {
        try {
          const result = await loginWithGoogle(code);
          if (result.success) {
            const role = result.user?.role?.name || result.user?.role;
            if (role === 'Admin') {
              navigate('/admin/dashboard', { replace: true });
            } else if (role === 'Teacher') {
              navigate('/teacher/dashboard', { replace: true });
            } else {
              navigate('/student/dashboard', { replace: true });
            }
          } else {
            navigate('/login?error=' + encodeURIComponent(result.error || 'oauth_failed'), { replace: true });
          }
        } catch (err) {
          console.error('Error in Google OAuth callback:', err);
          navigate('/login?error=oauth_failed', { replace: true });
        }
      }
      // If there's an error
      else if (error) {
        navigate('/login?error=' + encodeURIComponent(error), { replace: true });
      }
      // No valid parameters
      else {
        navigate('/login?error=invalid_callback', { replace: true });
      }
    };

    handleCallback();
  }, [searchParams, navigate, loginWithGoogle]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center' }}>
        <Loading message="Completing Google authentication..." />
      </div>
    </div>
  );
};

export default GoogleOAuthCallback;

