/**
 * useProtectedRoute hook - protect routes based on authentication and roles
 */

import { useEffect, useRef, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export const useProtectedRoute = (requiredRole = null) => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);
  const redirectTimeoutRef = useRef(null);
  const lastPathRef = useRef(location.pathname);

  // Helper to get user role
  const getUserRole = (userData) => {
    if (!userData) {
      console.log('getUserRole: No userData');
      return 'Student';
    }
    
    console.log('getUserRole - userData:', userData);
    console.log('getUserRole - userData.role:', userData.role);
    console.log('getUserRole - userData.role_id:', userData.role_id);
    
    let role = null;
    if (userData.role) {
      if (typeof userData.role === 'string') {
        role = userData.role;
        console.log('getUserRole - role is string:', role);
      } else if (userData.role && typeof userData.role === 'object' && userData.role.name) {
        role = userData.role.name;
        console.log('getUserRole - role from object.name:', role);
      }
    }
    if (!role && userData.role_id) {
      const roleMap = { 1: 'Admin', 2: 'Teacher', 3: 'Student' };
      role = roleMap[userData.role_id];
      console.log('getUserRole - role from role_id:', role, 'role_id:', userData.role_id);
    }
    
    const normalizedRole = role && typeof role === 'string' 
      ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() 
      : 'Student';
    
    console.log('getUserRole - Final normalized role:', normalizedRole);
    return normalizedRole;
  };

  // Memoize user role to prevent recalculation
  const userRole = useMemo(() => {
    if (!user) return 'Student';
    return getUserRole(user);
  }, [user?.id, user?.role?.name, user?.role_id]);

  // Memoize role checks
  const normalizedUserRole = useMemo(
    () => (userRole ? userRole.toLowerCase() : ''),
    [userRole]
  );

  const roleChecks = useMemo(
    () => ({
      isAdmin: normalizedUserRole === 'admin',
      isTeacher: normalizedUserRole === 'teacher',
      isStudent: normalizedUserRole === 'student',
    }),
    [normalizedUserRole]
  );

  useEffect(() => {
    // Only reset if path actually changed
    if (lastPathRef.current !== location.pathname) {
      hasRedirected.current = false;
      lastPathRef.current = location.pathname;
    }
    
    // Clear any pending redirects
    if (redirectTimeoutRef.current) {
      cancelAnimationFrame(redirectTimeoutRef.current);
      redirectTimeoutRef.current = null;
    }
  }, [location.pathname]);

  useEffect(() => {
    // Don't do anything while loading
    if (loading) return;

    // Prevent multiple redirects
    if (hasRedirected.current) return;

    // Check authentication
    if (!isAuthenticated) {
      hasRedirected.current = true;
      redirectTimeoutRef.current = requestAnimationFrame(() => {
        navigate('/login', { replace: true });
      });
      return;
    }

    // Check role if required
    if (requiredRole) {
      const normalizedRequiredRole = requiredRole.toLowerCase();
      const hasRequiredRole = normalizedRequiredRole === normalizedUserRole;
      if (!hasRequiredRole) {
        hasRedirected.current = true;
        redirectTimeoutRef.current = requestAnimationFrame(() => {
          // Redirect to appropriate dashboard based on user's role
          if (roleChecks.isAdmin) {
            navigate('/admin/dashboard', { replace: true });
          } else if (roleChecks.isTeacher) {
            navigate('/teacher/dashboard', { replace: true });
          } else if (roleChecks.isStudent) {
            navigate('/student/dashboard', { replace: true });
          } else {
            navigate('/login', { replace: true });
          }
        });
      }
    }

    // Cleanup function
    return () => {
      if (redirectTimeoutRef.current) {
        cancelAnimationFrame(redirectTimeoutRef.current);
        redirectTimeoutRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isAuthenticated,
    loading,
    requiredRole,
    normalizedUserRole,
    roleChecks.isAdmin,
    roleChecks.isTeacher,
    roleChecks.isStudent,
  ]);

  return { isAuthenticated, loading };
};


