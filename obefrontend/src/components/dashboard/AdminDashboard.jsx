/**
 * Admin Dashboard component for OBE System
 * Main dashboard for administrators
 */

import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Navbar from '../common/Navbar';
import api from '../../services/api';
import './Dashboard.css';

const AdminDashboard = memo(() => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    plos: 0,
    clos: 0,
    loading: true
  });

  useEffect(() => {
    // Only fetch if user is available
    // Use user.id as dependency to prevent infinite loops
    if (user?.id) {
      fetchDashboardStats();
    } else {
      setStats(prev => ({ ...prev, loading: false }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only depend on user.id, not the whole user object

  const fetchDashboardStats = async () => {
    try {
      // Fetch users count
      const usersResponse = await api.get('/users');
      let usersCount = 0;
      if (usersResponse.data) {
        if (Array.isArray(usersResponse.data)) {
          usersCount = usersResponse.data.length;
        } else if (usersResponse.data.users && Array.isArray(usersResponse.data.users)) {
          usersCount = usersResponse.data.users.length;
        } else if (usersResponse.data.total !== undefined) {
          usersCount = usersResponse.data.total;
        }
      }

      // Fetch courses count
      const coursesResponse = await api.get('/courses');
      let coursesCount = 0;
      if (coursesResponse.data) {
        if (Array.isArray(coursesResponse.data)) {
          coursesCount = coursesResponse.data.length;
        } else if (coursesResponse.data.courses && Array.isArray(coursesResponse.data.courses)) {
          coursesCount = coursesResponse.data.courses.length;
        } else if (coursesResponse.data.total !== undefined) {
          coursesCount = coursesResponse.data.total;
        }
      }

      // Fetch PLOs count
      let plosCount = 0;
      try {
        const plosResponse = await api.get('/plos');
        if (plosResponse.data) {
          if (Array.isArray(plosResponse.data)) {
            plosCount = plosResponse.data.length;
          } else if (plosResponse.data.total !== undefined) {
            plosCount = plosResponse.data.total;
          }
        }
      } catch (err) {
        console.error('Error fetching PLOs:', err);
      }

      setStats({
        users: usersCount,
        courses: coursesCount,
        plos: plosCount,
        clos: 0, // Will be fetched per course
        loading: false
      });
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const handleNavigation = useCallback((path) => {
    console.log('Navigating to:', path);
    navigate(path);
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div className="dashboard admin-dashboard">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Welcome, {user?.first_name} {user?.last_name}</p>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-grid">
            <Card title="Users" description="Manage system users and roles">
              {stats.loading ? (
                <p>Loading...</p>
              ) : (
                <p>Total Users: {stats.users}</p>
              )}
              <Button
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNavigation('/admin/users');
                }}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                Manage Users
              </Button>
            </Card>

            <Card title="Courses" description="Manage courses and assignments">
              {stats.loading ? (
                <p>Loading...</p>
              ) : (
                <p>Total Courses: {stats.courses}</p>
              )}
              <Button
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNavigation('/admin/courses');
                }}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                Manage Courses
              </Button>
            </Card>

            <Card title="Outcomes" description="Manage PLOs and CLOs">
              {stats.loading ? (
                <p>Loading...</p>
              ) : (
                <p>PLOs: {stats.plos} | CLOs: {stats.clos}</p>
              )}
              <Button
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNavigation('/admin/outcomes');
                }}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                Manage Outcomes
              </Button>
            </Card>

            <Card title="Analytics" description="View system analytics and reports">
              <p>Reports and Analytics</p>
              <Button
                variant="primary"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleNavigation('/admin/analytics');
                }}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                View Analytics
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
});

AdminDashboard.displayName = 'AdminDashboard';

export default AdminDashboard;

