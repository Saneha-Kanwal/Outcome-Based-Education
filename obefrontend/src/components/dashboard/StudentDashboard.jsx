/**
 * Student Dashboard component for OBE System
 * Main dashboard for students
 */

import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useState, useEffect } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import Navbar from '../common/Navbar';
import Loading from '../common/Loading';
import api from '../../services/api';
import './Dashboard.css';

const StudentDashboard = memo(() => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    courses: 0,
    results: 0,
    outcomeAverage: null,
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
    if (!user?.id) {
      setStats(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      setStats(prev => ({ ...prev, loading: true }));
      
      // Fetch courses count
      const coursesResponse = await api.get(`/courses/students/${user.id}`);
      const courses = Array.isArray(coursesResponse.data) ? coursesResponse.data : [];
      
      // Fetch results count if user ID is available
      let resultsCount = 0;
      let outcomeAverage = null;
      try {
        const resultsResponse = await api.get(`/results/students/${user.id}/results`);
        const resultsData = resultsResponse.data;
        if (Array.isArray(resultsData)) {
          resultsCount = resultsData.length;
          const valid = resultsData.filter((item) => typeof item.percentage === 'number');
          if (valid.length) {
            const total = valid.reduce((sum, item) => sum + item.percentage, 0);
            outcomeAverage = Math.round(total / valid.length);
          }
        } else if (resultsData?.results && Array.isArray(resultsData.results)) {
          resultsCount = resultsData.results.length;
        }
      } catch (err) {
        console.error('Error fetching results:', err);
        // Don't show error for dashboard stats, just use 0
      }

      setStats({
        courses: courses.length,
        results: resultsCount,
        outcomeAverage,
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
      <div className="dashboard student-dashboard">
        <div className="dashboard-header">
          <h1>Student Dashboard</h1>
          <p>Welcome, {user?.first_name} {user?.last_name}</p>
        </div>

      <div className="dashboard-content">
        <div className="dashboard-grid">
          <Card title="My Courses" description="View your enrolled courses">
            {stats.loading ? (
              <p>Loading...</p>
            ) : (
              <p>Enrolled Courses: {stats.courses}</p>
            )}
            <Button
              variant="primary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigation('/student/courses');
              }}
              style={{ marginTop: '1rem', width: '100%' }}
            >
              View Courses
            </Button>
          </Card>

          <Card title="Results" description="View your assessment results">
            {stats.loading ? (
              <p>Loading...</p>
            ) : (
              <p>Recent Results: {stats.results}</p>
            )}
            <Button
              variant="primary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigation('/student/results');
              }}
              style={{ marginTop: '1rem', width: '100%' }}
            >
              View Results
            </Button>
          </Card>

          <Card title="Progress" description="Track your learning outcomes">
            <p>
              Outcome Achievement:{' '}
              {stats.loading
                ? 'Loading...'
                : stats.outcomeAverage !== null
                  ? `${stats.outcomeAverage}%`
                  : '--'}
            </p>
            <Button
              variant="primary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleNavigation('/student/progress');
              }}
              style={{ marginTop: '1rem', width: '100%' }}
            >
              View Progress
            </Button>
          </Card>
        </div>
      </div>
      </div>
    </>
  );
});

StudentDashboard.displayName = 'StudentDashboard';

export default StudentDashboard;

