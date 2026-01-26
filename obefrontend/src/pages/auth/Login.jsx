/**
 * Login page for OBE System
 * Supports multiple authentication methods
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../../components/auth/LoginForm';
import OTPForm from '../../components/auth/OTPForm';
import './Login.css';

// Helper function to get role from user object (same as in App.jsx)
const getUserRole = (user) => {
  if (!user) return 'Student';
  
  let role = null;
  if (user.role) {
    if (typeof user.role === 'string') {
      role = user.role;
    } else if (user.role && typeof user.role === 'object' && user.role.name) {
      role = user.role.name;
    }
  }
  
  // Fallback to role_id if role object is missing
  if (!role && user.role_id) {
    const roleMap = { 1: 'Admin', 2: 'Teacher', 3: 'Student' };
    role = roleMap[user.role_id];
  }
  
  // Normalize role name (handle case variations)
  return role && typeof role === 'string' 
    ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() 
    : 'Student';
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading, user } = useAuth();
  const [authMode, setAuthMode] = useState('login'); // 'login', 'otp', 'register'
  const hasRedirected = useRef(false);

  // Redirect if already authenticated
  useEffect(() => {
    // Reset redirect flag when component mounts or location changes
    hasRedirected.current = false;
  }, [location.pathname]);

  // Memoize role and redirect path to prevent recalculation
  const normalizedRole = useMemo(() => {
    if (!user) return 'Student';
    return getUserRole(user);
  }, [user?.id, user?.role?.name, user?.role_id]);

  const redirectPath = useMemo(() => {
    if (normalizedRole === 'Admin') {
      return '/admin/dashboard';
    } else if (normalizedRole === 'Teacher') {
      return '/teacher/dashboard';
    } else {
      return '/student/dashboard';
    }
  }, [normalizedRole]);

  const handleSuccess = useCallback((userData) => {
    // Wait a moment for auth state to update, then redirect
    setTimeout(() => {
      const role = getUserRole(userData);
      const path = role === 'Admin' ? '/admin/dashboard' 
        : role === 'Teacher' ? '/teacher/dashboard' 
        : '/student/dashboard';
      
      console.log('handleSuccess - User:', userData);
      console.log('handleSuccess - Role:', role);
      console.log('handleSuccess - Redirecting to:', path);
      
      navigate(path, { replace: true });
    }, 100);
  }, [navigate]);

  useEffect(() => {
    // Don't redirect if still loading or already redirected
    if (loading || hasRedirected.current) return;

    // Only redirect if authenticated and user data is available
    if (isAuthenticated && user) {
      hasRedirected.current = true;
      
      console.log('Login redirect - User:', user);
      console.log('Login redirect - Role:', normalizedRole);
      
      // Use requestAnimationFrame for smoother redirect
      const frameId = requestAnimationFrame(() => {
        console.log('Redirecting to', redirectPath);
        navigate(redirectPath, { replace: true });
      });

      return () => cancelAnimationFrame(frameId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, loading, user?.id, normalizedRole, redirectPath, navigate]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>
        </div>
      </div>
    );
  }

  // Don't render login form if already authenticated (will redirect)
  // But still render the container to avoid blank screen during redirect
  if (isAuthenticated) {
    return (
      <div className="login-page">
        <div className="login-container">
          <div style={{ textAlign: 'center', padding: '2rem' }}>Redirecting...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="login-page">
      <div className="login-container">
        {authMode === 'login' && (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToOTP={() => setAuthMode('otp')}
            onSwitchToRegister={() => navigate('/register')}
          />
        )}

        {authMode === 'otp' && (
          <OTPForm
            onSuccess={handleSuccess}
            onSwitchToLogin={() => setAuthMode('login')}
          />
        )}
      </div>
    </div>
  );
};

export default Login;

