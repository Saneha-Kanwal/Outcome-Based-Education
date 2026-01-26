import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import api from '../../services/api';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'info', timestamp: null });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, timestamp: Date.now() });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, message: '' }));
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [courseResp, assessmentsResp] = await Promise.allSettled([
        api.get(`/courses/${id}`),
        api.get(`/courses/${id}/assessments`),
      ]);

      if (courseResp.status === 'fulfilled') {
        setCourse(courseResp.value.data);
      } else {
        throw courseResp.reason;
      }

      if (assessmentsResp.status === 'fulfilled') {
        const list = Array.isArray(assessmentsResp.value.data) ? assessmentsResp.value.data : [];
        setAssessments(list);
      } else {
        throw assessmentsResp.reason;
      }
    } catch (err) {
      console.error('Error loading course details:', err);
      let message = err.response?.data?.detail || err.response?.data?.message || 'Failed to load course details.';
      if (err.response?.status === 403) {
        message = 'Access denied. You must be enrolled in this course to view its assessments.';
      } else if (err.response?.status === 401) {
        message = 'Your session has expired. Please log in again.';
      }
      setError(message);
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="student-course-detail">
          <div className="page-header">
            <Button onClick={() => navigate('/student/courses')} variant="secondary">
              Back to Courses
            </Button>
          </div>
          <Loading message="Loading course information..." />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="student-course-detail">
          <div className="page-header">
            <Button onClick={() => navigate('/student/courses')} variant="secondary">
              Back to Courses
            </Button>
          </div>
          <ErrorMessage message={error} />
        </div>
        <Toast key={toast.timestamp} message={toast.message} type={toast.type} onClose={hideToast} />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="student-course-detail">
        <div className="page-header">
          <h1>{course?.name}</h1>
          <Button onClick={() => navigate('/student/courses')} variant="secondary">
            Back to Courses
          </Button>
        </div>

        <section className="course-summary">
          <Card>
            <p><strong>Code:</strong> {course?.code}</p>
            <p><strong>Credits:</strong> {course?.credits ?? 'N/A'}</p>
            <p><strong>Description:</strong> {course?.description ?? 'No description provided.'}</p>
          </Card>
        </section>

        <section className="course-assessments">
          <h2>Assessments</h2>
          {assessments.length === 0 ? (
            <Card>
              <p>No assessments have been published for this course yet.</p>
            </Card>
          ) : (
            <div className="assessments-grid">
              {assessments.map((assessment) => (
                <Card key={assessment.id} title={assessment.name} description={assessment.description}>
                  <p><strong>Type:</strong> {assessment.type}</p>
                  <p><strong>Weight:</strong> {assessment.weight}%</p>
                  <p><strong>Max Score:</strong> {assessment.max_score}</p>
                  <p>
                    <strong>Due Date:</strong>{' '}
                    {assessment.due_date ? new Date(assessment.due_date).toLocaleString() : 'Not set'}
                  </p>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
      <Toast key={toast.timestamp} message={toast.message} type={toast.type} onClose={hideToast} />
    </>
  );
};

export default CourseDetail;

