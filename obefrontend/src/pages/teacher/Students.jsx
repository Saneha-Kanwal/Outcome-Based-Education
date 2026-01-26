import { useState, useEffect, useMemo, useCallback } from 'react';
import Navbar from '../../components/common/Navbar';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';
import Button from '../../components/common/Button';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './TeacherStudents.css';

const TeacherStudents = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortAsc, setSortAsc] = useState(true);
  const [toast, setToast] = useState({ message: '', type: 'info', timestamp: null });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, timestamp: Date.now() });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, message: '' }));
  }, []);

  const fetchStudents = useCallback(async () => {
    if (!user?.id) {
      setStudents([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get(`/results/teachers/${user.id}/students`);
      const list = Array.isArray(data) ? data : [];
      setStudents(list);
    } catch (error) {
      console.error('Error fetching teacher students:', error);
      showToast(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to load students.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [showToast, user?.id]);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const filteredStudents = useMemo(() => {
    const term = search.trim().toLowerCase();
    let list = [...students];
    if (term) {
      list = list.filter((student) => {
        const name = `${student.first_name} ${student.last_name}`.toLowerCase();
        const email = student.email?.toLowerCase() ?? '';
        const course = student.course_name?.toLowerCase() ?? '';
        return name.includes(term) || email.includes(term) || course.includes(term);
      });
    }
    return list.sort((a, b) => {
      const nameA = `${a.last_name} ${a.first_name}`.toLowerCase();
      const nameB = `${b.last_name} ${b.first_name}`.toLowerCase();
      return sortAsc ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
    });
  }, [search, sortAsc, students]);

  return (
    <>
      <Navbar />
      <div className="teacher-students-page">
        <header className="teacher-students-header">
          <h1>Students</h1>
          <p>Students enrolled in your courses.</p>
        </header>

        <main className="teacher-students-content">
          <div className="filters-bar">
            <input
              type="search"
              placeholder="Search by name, email, or course"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <Button
              variant="outline"
              onClick={() => setSortAsc((prev) => !prev)}
            >
              Sort: {sortAsc ? 'A → Z' : 'Z → A'}
            </Button>
            <Button variant="secondary" onClick={fetchStudents}>
              Refresh
            </Button>
          </div>

          {loading ? (
            <div className="centered">
              <Loading message="Loading students..." />
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="empty-state">
              <p>No students found.</p>
            </div>
          ) : (
            <div className="students-table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Course</th>
                    <th>Enrollment Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <tr key={`${student.id}-${student.course_id}`}>
                      <td>
                        {student.first_name} {student.last_name}
                      </td>
                      <td>{student.email}</td>
                      <td>
                        {student.course_code} — {student.course_name}
                      </td>
                      <td>
                        {student.enrollment_date
                          ? new Date(student.enrollment_date).toLocaleDateString()
                          : 'N/A'}
                      </td>
                      <td>{student.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      <Toast key={toast.timestamp} message={toast.message} type={toast.type} onClose={hideToast} />
    </>
  );
};

export default TeacherStudents;

