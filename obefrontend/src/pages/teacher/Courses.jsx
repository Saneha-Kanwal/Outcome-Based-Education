import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './TeacherCourses.css';

const TeacherCourses = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info', timestamp: null });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, timestamp: Date.now() });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, message: '' }));
  }, []);

  const fetchCourses = useCallback(async () => {
    if (!user?.id) {
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get(`/teacher/${user.id}/courses`);
      setCourses(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
      showToast(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to load assigned courses.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [showToast, user?.id]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <>
      <Navbar />
      <div className="teacher-courses-page">
        <header className="teacher-courses-header">
          <div>
            <h1>My Assigned Courses</h1>
            <p>Courses that you are responsible for managing.</p>
          </div>
          <Button variant="secondary" onClick={() => navigate('/teacher/dashboard')}>
            Back to Dashboard
          </Button>
        </header>

        {loading ? (
          <div className="teacher-courses-loading">
            <Loading message="Loading courses..." />
          </div>
        ) : courses.length === 0 ? (
          <div className="teacher-courses-empty">
            <p>No courses have been assigned to you yet.</p>
          </div>
        ) : (
          <section className="teacher-courses-list">
            {courses.map((course) => (
              <article className="teacher-course-card" key={course.id}>
                <header>
                  <h2>
                    {course.code} • {course.name}
                  </h2>
                </header>
                {course.description && <p className="course-description">{course.description}</p>}
                <div className="course-meta">
                  {course.credits ? <span>{course.credits} credit hours</span> : <span>No credit info</span>}
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      <Toast key={toast.timestamp} message={toast.message} type={toast.type} onClose={hideToast} />
    </>
  );
};

export default TeacherCourses;

