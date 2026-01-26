/**
 * useRole hook - check user roles and permissions
 */

import { useMemo, useCallback } from 'react';
import { useAuth } from './useAuth';
import { ROLES } from '../utils/constants';
import { hasRole, hasAnyRole } from '../utils/helpers';

export const useRole = () => {
  const { user } = useAuth();

  // Memoize role checks to prevent unnecessary recalculations
  // Use a stable key based on user ID and role to prevent infinite loops
  const userRoleKey = user ? `${user.id}-${user.role?.name || user.role || user.role_id || 'none'}` : null;
  
  const roleChecks = useMemo(() => {
    if (!user) {
      return {
        isAdmin: false,
        isTeacher: false,
        isStudent: false,
      };
    }
    
    // Handle different role structures
    let userRole = null;
    if (user.role) {
      if (typeof user.role === 'string') {
        userRole = user.role;
      } else if (user.role.name) {
        userRole = user.role.name;
      } else if (user.role_id) {
        // Fallback: check role_id if role object is missing
        const roleMap = { 1: 'Admin', 2: 'Teacher', 3: 'Student' };
        userRole = roleMap[user.role_id];
      }
    } else if (user.role_id) {
      // Direct role_id check
      const roleMap = { 1: 'Admin', 2: 'Teacher', 3: 'Student' };
      userRole = roleMap[user.role_id];
    }
    
    return {
      isAdmin: userRole === ROLES.ADMIN,
      isTeacher: userRole === ROLES.TEACHER,
      isStudent: userRole === ROLES.STUDENT,
    };
  }, [userRoleKey]);

  const hasAnyOfRoles = useCallback((roles) => {
    return hasAnyRole(user, roles);
  }, [user?.id, user?.role?.name, user?.role, user?.role_id]);

  return {
    user,
    ...roleChecks,
    hasAnyOfRoles,
  };
};

