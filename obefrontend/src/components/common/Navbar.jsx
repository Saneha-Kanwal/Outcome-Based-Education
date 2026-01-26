/**
 * Navigation bar component for OBE System
 * Provides logout and navigation options
 */

import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';
import './Navbar.css';

const Navbar = memo(() => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login', { replace: true });
  }, [logout, navigate]);

  const getDashboardPath = useCallback(() => {
    if (!user?.role) return '/dashboard';
    const role = user.role?.name || user.role;
    if (role === 'Admin') return '/admin/dashboard';
    if (role === 'Teacher') return '/teacher/dashboard';
    return '/student/dashboard';
  }, [user?.role?.name, user?.role]);

  if (!isAuthenticated) {
    return null;
  }

  const role = user?.role?.name || user.role || 'User';

  const handleBrandClick = useCallback(() => {
    navigate(getDashboardPath());
  }, [navigate, getDashboardPath]);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" onClick={handleBrandClick} style={{ cursor: 'pointer' }}>
          <h2>
            <span>OBE</span> System
          </h2>
          <p className="navbar-tagline">Outcome Based Education Platform</p>
        </div>
        <div className="navbar-menu">
          <div className="navbar-user">
            <span className="user-name">
              {user?.first_name} {user?.last_name}
            </span>
            <span className="user-role">({role})</span>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </nav>
  );
});

Navbar.displayName = 'Navbar';

export default Navbar;

