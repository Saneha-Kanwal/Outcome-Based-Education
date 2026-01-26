/**
 * Student Progress page
 * Displays learning outcome achievement progress
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Navbar from '../../components/common/Navbar';
import './Progress.css';

const Progress = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchProgress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only depend on user.id to prevent infinite loops

  const fetchProgress = async () => {
    try {
      setLoading(true);
      setError('');
      if (!user?.id) {
        setProgress([]);
        return;
      }

      // Fetch courses the student is enrolled in
      const coursesResponse = await api.get(`/courses/students/${user.id}`);
      const courses = Array.isArray(coursesResponse.data) ? coursesResponse.data : [];

      // Fetch all results for the student once
      const resultsResponse = await api.get(`/results/students/${user.id}/results`);
      const allResults = Array.isArray(resultsResponse.data)
        ? resultsResponse.data
        : Array.isArray(resultsResponse.data?.results)
          ? resultsResponse.data.results
          : [];

      // Calculate progress for each course
      const progressData = courses.map((course) => {
        const courseResults = allResults.filter((result) => result.course_id === course.id);

        const totalScore = courseResults.reduce((sum, r) => sum + (r.score ?? 0), 0);
        const maxScore = courseResults.reduce((sum, r) => sum + (r.max_score ?? 0), 0);
        const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
        const latestUpdate = courseResults.reduce((latest, r) => {
          const updated = new Date(r.updated_at || r.created_at || 0).getTime();
          return updated > latest ? updated : latest;
        }, 0);

        return {
          course,
          percentage,
          totalAssessments: courseResults.length,
          lastUpdated: latestUpdate ? new Date(latestUpdate) : null,
        };
      });

      setProgress(progressData);
    } catch (err) {
      console.error('Error fetching progress:', err);
      setError(err.response?.data?.error || 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  };

  const overallAverage = useMemo(() => {
    if (!progress.length) return null;
    const valid = progress.filter((p) => typeof p.percentage === 'number');
    if (!valid.length) return null;
    const total = valid.reduce((sum, item) => sum + item.percentage, 0);
    return Math.round(total / valid.length);
  }, [progress]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="student-page">
          <div className="page-header">
            <h1>My Progress</h1>
            <Button onClick={() => navigate('/student/dashboard')}>Back to Dashboard</Button>
          </div>
          <Loading message="Loading progress..." />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="student-page progress-page">
      <div className="page-header">
        <h1>My Progress</h1>
        <Button onClick={() => navigate('/student/dashboard')}>Back to Dashboard</Button>
      </div>

      {error && <ErrorMessage message={error} />}

      <div className="progress-summary">
        <Card>
          <div className="summary-grid">
            <div>
              <p className="summary-label">Courses Enrolled</p>
              <p className="summary-value">{progress.length}</p>
            </div>
            <div>
              <p className="summary-label">Average Achievement</p>
              <p className="summary-value">
                {overallAverage !== null ? `${overallAverage}%` : '--'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="progress-content">
        {progress.length === 0 ? (
          <Card>
            <p>No progress data available yet.</p>
          </Card>
        ) : (
          <div className="progress-list">
            {progress.map((item, index) => (
              <Card key={item.course?.id || index} title={item.course?.name || 'Course'}>
                <div className="progress-info">
                  <p><strong>Course Code:</strong> {item.course?.code || 'N/A'}</p>
                  <p><strong>Assessments Completed:</strong> {item.totalAssessments}</p>
                  {item.lastUpdated && (
                    <p><strong>Last Updated:</strong> {item.lastUpdated.toLocaleString()}</p>
                  )}
                  <div className="progress-bar-container">
                    <p><strong>Overall Progress:</strong> {item.percentage}%</p>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default Progress;

