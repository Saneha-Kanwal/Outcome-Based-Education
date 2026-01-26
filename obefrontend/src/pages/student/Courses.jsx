/**
 * Student Courses page
 * Displays enrolled courses for the student
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import ErrorMessage from '../../components/common/ErrorMessage';
import Navbar from '../../components/common/Navbar';
import Toast from '../../components/common/Toast';
import './Courses.css';

const Courses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [availableCourses, setAvailableCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionState, setActionState] = useState({ courseId: null, action: null });
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'info', timestamp: null });

  useEffect(() => {
    if (user?.id) {
      fetchCourses();
    }
  }, [user?.id]);

  const fetchCourses = async () => {
    try {
      const studentId = Number(user?.id);
      if (!Number.isInteger(studentId)) {
        console.warn('Student Courses: user.id is not a valid integer', user?.id);
        setError('Unable to determine student account. Please log out and log back in.');
        return;
      }
      setLoading(true);
      setError('');
      // Fetch courses where student is enrolled
      const [enrolledResp, availableResp] = await Promise.all([
        api.get(`/courses/students/${studentId}`),
        api.get('/courses/available'),
      ]);

      const enrolledData = Array.isArray(enrolledResp.data) ? enrolledResp.data : [];
      const availableData = Array.isArray(availableResp.data) ? availableResp.data : [];

      setEnrolledCourses(enrolledData);
      setAvailableCourses(availableData.filter((course) => !enrolledData.some((c) => c.id === course.id)));
    } catch (err) {
      console.error('Error fetching courses:', err);
      if (err.response?.status === 401) {
        setError('Your session has expired. Please log in again.');
        return;
      }
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || err.message || 'Failed to load courses';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEnroll = async (courseId) => {
    try {
      setActionState({ courseId, action: 'enroll' });
      await api.post(`/courses/${courseId}/enroll`);
      setToast({ message: 'Enrolled successfully!', type: 'success', timestamp: Date.now() });
      await fetchCourses();
    } catch (err) {
      console.error('Error enrolling in course:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || err.message || 'Failed to enroll in course.';
      setToast({ message: errorMessage, type: 'error', timestamp: Date.now() });
    } finally {
      setActionState({ courseId: null, action: null });
    }
  };

  const handleUnenroll = async (courseId) => {
    try {
      setActionState({ courseId, action: 'unenroll' });
      await api.delete(`/courses/${courseId}/enroll`);
      setToast({ message: 'Enrollment removed successfully.', type: 'success', timestamp: Date.now() });
      await fetchCourses();
    } catch (err) {
      console.error('Error removing enrollment:', err);
      const errorMessage = err.response?.data?.detail || err.response?.data?.error || err.message || 'Failed to remove enrollment.';
      setToast({ message: errorMessage, type: 'error', timestamp: Date.now() });
    } finally {
      setActionState({ courseId: null, action: null });
    }
  };

  if (loading) {
    return (
      <div className="student-page">
        <div className="page-header">
          <h1>My Courses</h1>
          <Button onClick={() => navigate('/student/dashboard')}>Back to Dashboard</Button>
        </div>
        <Loading message="Loading courses..." />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="student-page courses-page">
        <div className="page-header">
          <h1>My Courses</h1>
          <Button onClick={() => navigate('/student/dashboard')}>Back to Dashboard</Button>
        </div>

      {error && <ErrorMessage message={error} />}

      <div className="courses-content">
        <section>
          <h2>Enrolled Courses</h2>
          {enrolledCourses.length === 0 ? (
            <Card>
              <p>You are not enrolled in any courses yet.</p>
            </Card>
          ) : (
            <div className="courses-grid">
              {enrolledCourses.map((course) => (
                <Card key={course.id} title={course.name} description={course.description}>
                  <div className="course-info">
                    <p><strong>Code:</strong> {course.code}</p>
                    <p><strong>Credits:</strong> {course.credits}</p>
                    <p><strong>Status:</strong> {course.status}</p>
                  </div>
                  <div className="course-actions">
                    <div className="course-actions-row">
                      <Button
                        variant="primary"
                        onClick={() => navigate(`/student/courses/${course.id}`)}
                      >
                        View Assessments
                      </Button>
                      <Button
                        variant="outline"
                        loading={actionState.courseId === course.id && actionState.action === 'unenroll'}
                        onClick={() => handleUnenroll(course.id)}
                        disabled={actionState.courseId === course.id}
                      >
                        Unenroll
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2>Available Courses</h2>
          {availableCourses.length === 0 ? (
            <Card>
              <p>No additional courses available for enrollment.</p>
            </Card>
          ) : (
            <div className="courses-grid">
              {availableCourses.map((course) => (
                <Card key={course.id} title={course.name} description={course.description}>
                  <div className="course-info">
                    <p><strong>Code:</strong> {course.code}</p>
                    <p><strong>Credits:</strong> {course.credits}</p>
                  </div>
                  <div className="course-actions">
                    <Button
                      variant="primary"
                      loading={actionState.courseId === course.id && actionState.action === 'enroll'}
                      disabled={actionState.courseId === course.id}
                      onClick={() => handleEnroll(course.id)}
                    >
                      Enroll
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
    <Toast key={toast.timestamp} message={toast.message} type={toast.type} onClose={() => setToast((prev) => ({ ...prev, message: '' }))} />
    </>
  );
};

export default Courses;

