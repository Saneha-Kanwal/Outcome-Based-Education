/**
 * Student Results page
 * Displays assessment results for the student
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
import './Results.css';

const formatDateTime = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
};

const calculateGrade = (percentage) => {
  if (percentage === null || percentage === undefined) return 'N/A';
  if (percentage >= 90) return 'A';
  if (percentage >= 80) return 'B';
  if (percentage >= 70) return 'C';
  if (percentage >= 60) return 'D';
  return 'F';
};

const Results = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchResults();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only depend on user.id to prevent infinite loops

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError('');
      
      if (!user?.id) {
        setError('User ID not available');
        setLoading(false);
        return;
      }
      
      const response = await api.get(`/results/students/${user.id}/results`);
      const payload = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.results)
          ? response.data.results
          : [];

      // Sort by latest updated/created descending
      payload.sort((a, b) => {
        const timeA = new Date(a.updated_at || a.created_at || 0).getTime();
        const timeB = new Date(b.updated_at || b.created_at || 0).getTime();
        return timeB - timeA;
      });

      setResults(payload);
    } catch (err) {
      console.error('Error fetching results:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || err.message || 'Failed to load results';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const overallAverage = useMemo(() => {
    if (!results.length) return null;
    const valid = results.filter((r) => typeof r.percentage === 'number');
    if (!valid.length) return null;
    const total = valid.reduce((sum, r) => sum + r.percentage, 0);
    return Math.round(total / valid.length);
  }, [results]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="student-page">
          <div className="page-header">
            <h1>My Results</h1>
            <Button onClick={() => navigate('/student/dashboard')}>Back to Dashboard</Button>
          </div>
          <Loading message="Loading results..." />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="student-page results-page">
        <div className="page-header">
          <h1>My Results</h1>
          <Button onClick={() => navigate('/student/dashboard')}>Back to Dashboard</Button>
        </div>

        {error && <ErrorMessage message={error} />}

        <div className="results-summary">
          <Card>
            <div className="summary-grid">
              <div>
                <p className="summary-label">Total Assessments</p>
                <p className="summary-value">{results.length}</p>
              </div>
              <div>
                <p className="summary-label">Overall Average</p>
                <p className="summary-value">
                  {overallAverage !== null ? `${overallAverage}%` : '--'}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <div className="results-content">
          {results.length === 0 ? (
            <Card>
              <p>No results available yet.</p>
            </Card>
          ) : (
            <div className="results-list">
              {results.map((result) => {
                const percentage = typeof result.percentage === 'number'
                  ? Math.round(result.percentage)
                  : null;
                const grade = calculateGrade(percentage);

                return (
                  <Card
                    key={result.id}
                    title={result.assessment_name || 'Assessment'}
                    subtitle={result.assessment_type ? `${result.assessment_type}` : undefined}
                  >
                    <div className="result-info">
                      <p><strong>Course:</strong> {result.course_name || 'N/A'} ({result.course_code || 'N/A'})</p>
                      <p><strong>CLO:</strong> {result.clo_code || result.clo_id}</p>
                      <p><strong>Score:</strong> {result.score ?? '--'} / {result.max_score ?? '--'}</p>
                      <p><strong>Percentage:</strong> {percentage !== null ? `${percentage}%` : 'N/A'}</p>
                      <p><strong>Grade:</strong> {grade}</p>
                      <p><strong>Recorded:</strong> {formatDateTime(result.updated_at || result.created_at)}</p>
                      {result.assessment_due_date && (
                        <p><strong>Assessment Due:</strong> {formatDateTime(result.assessment_due_date)}</p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Results;

