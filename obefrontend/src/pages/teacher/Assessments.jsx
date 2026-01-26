import { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './TeacherAssessments.css';

const DEFAULT_FORM = {
  id: null,
  name: '',
  type: 'Quiz',
  description: '',
  weight: '',
  maxScore: '',
  dueDate: '',
};

const TYPE_OPTIONS = ['Quiz', 'Assignment', 'Exam', 'Project'];

const TeacherAssessments = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(DEFAULT_FORM);
  const [toast, setToast] = useState({ message: '', type: 'info', timestamp: null });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, timestamp: Date.now() });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, message: '' }));
  }, []);

  const fetchCourses = useCallback(async () => {
    if (!user?.id) return;
    setLoadingCourses(true);
    try {
      const { data } = await api.get(`/teacher/${user.id}/courses`);
      const list = Array.isArray(data) ? data : [];
      setCourses(list);
      if (!selectedCourseId && list.length > 0) {
        setSelectedCourseId(String(list[0].id));
      }
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
      const message =
        error.response?.data?.detail || error.response?.data?.message || 'Failed to load courses.';
      showToast(message, 'error');
    } finally {
      setLoadingCourses(false);
    }
  }, [selectedCourseId, showToast, user?.id]);

  const fetchAssessments = useCallback(
    async (courseId) => {
      if (!courseId) {
        setAssessments([]);
        return;
      }
      setLoadingAssessments(true);
      try {
        const { data } = await api.get(`/courses/${courseId}/assessments`);
        setAssessments(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        const message =
          error.response?.data?.detail || error.response?.data?.message || 'Failed to load assessments.';
        showToast(message, 'error');
      } finally {
        setLoadingAssessments(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchAssessments(selectedCourseId);
    }
  }, [selectedCourseId, fetchAssessments]);

  const resetForm = useCallback(() => {
    setForm(DEFAULT_FORM);
  }, []);

  const handleCourseChange = useCallback((event) => {
    setSelectedCourseId(event.target.value);
    resetForm();
  }, [resetForm]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const validateForm = useCallback(() => {
    if (!form.name.trim()) {
      showToast('Assessment name is required.', 'warning');
      return false;
    }
    if (!form.weight || Number.isNaN(Number(form.weight))) {
      showToast('Weight must be a number.', 'warning');
      return false;
    }
    if (!form.maxScore || Number.isNaN(Number(form.maxScore))) {
      showToast('Max score must be a number.', 'warning');
      return false;
    }
    return true;
  }, [form.maxScore, form.name, form.weight, showToast]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!selectedCourseId) {
        showToast('Please select a course.', 'warning');
        return;
      }
      if (!validateForm()) {
        return;
      }

      const payload = {
        course_id: Number(selectedCourseId),
        name: form.name.trim(),
        type: form.type,
        description: form.description.trim() || null,
        weight: Number(form.weight),
        max_score: Number(form.maxScore),
        due_date: form.dueDate ? new Date(form.dueDate).toISOString() : null,
      };

      setSaving(true);
      try {
        if (form.id) {
          await api.put(`/assessments/${form.id}`, payload);
          showToast('Assessment updated successfully.', 'success');
        } else {
          await api.post('/assessments', payload);
          showToast('Assessment created successfully.', 'success');
        }
        resetForm();
        await fetchAssessments(selectedCourseId);
      } catch (error) {
        console.error('Error saving assessment:', error);
        const message =
          error.response?.data?.detail || error.response?.data?.message || 'Failed to save assessment.';
        showToast(message, 'error');
      } finally {
        setSaving(false);
      }
    },
    [fetchAssessments, form.description, form.id, form.maxScore, form.name, form.type, form.weight, form.dueDate, resetForm, selectedCourseId, showToast, validateForm]
  );

  const handleEdit = useCallback((assessment) => {
    setForm({
      id: assessment.id,
      name: assessment.name,
      type: assessment.type,
      description: assessment.description || '',
      weight: assessment.weight?.toString() ?? '',
      maxScore: assessment.max_score?.toString() ?? '',
      dueDate: assessment.due_date ? assessment.due_date.slice(0, 16) : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCancelEdit = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const headerTitle = useMemo(() => {
    if (!form.id) {
      return 'Create Assessment';
    }
    return `Edit Assessment`;
  }, [form.id]);

  return (
    <>
      <Navbar />
      <div className="teacher-assessments-page">
        <header className="teacher-assessments-header">
          <div>
            <h1>Manage Assessments</h1>
            <p>Create and update assessments for your assigned courses.</p>
          </div>
        </header>

        <main className="teacher-assessments-content">
          <section className="teacher-assessments-form">
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-top">
                <div className="form-field">
                  <label htmlFor="course-select">
                    Course <span className="required">*</span>
                  </label>
                  <select
                    id="course-select"
                    value={selectedCourseId}
                    onChange={handleCourseChange}
                    disabled={loadingCourses}
                    required
                  >
                    <option value="">Select course</option>
                    {courses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} — {course.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-header">
                <h2>{headerTitle}</h2>
                <p>{form.id ? 'Update the assessment details and save changes.' : 'Fill in the details to add a new assessment.'}</p>
              </div>

              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="name">
                    Name <span className="required">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Midterm Exam"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="type">
                    Type <span className="required">*</span>
                  </label>
                  <select id="type" name="type" value={form.type} onChange={handleInputChange} required>
                    {TYPE_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="weight">
                    Weight (%) <span className="required">*</span>
                  </label>
                  <input
                    id="weight"
                    name="weight"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={form.weight}
                    onChange={handleInputChange}
                    placeholder="e.g. 20"
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="maxScore">
                    Maximum Score <span className="required">*</span>
                  </label>
                  <input
                    id="maxScore"
                    name="maxScore"
                    type="number"
                    min="0"
                    step="0.1"
                    value={form.maxScore}
                    onChange={handleInputChange}
                    placeholder="e.g. 100"
                    required
                  />
                </div>

                <div className="form-field full-width">
                  <label htmlFor="dueDate">Due Date</label>
                  <input
                    id="dueDate"
                    name="dueDate"
                    type="datetime-local"
                    value={form.dueDate}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-field full-width">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleInputChange}
                    placeholder="Add instructions or details for this assessment."
                  />
                </div>
              </div>

              <div className="form-actions">
                {form.id && (
                  <Button type="button" variant="outline" onClick={handleCancelEdit} disabled={saving}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" variant="primary" loading={saving} disabled={!selectedCourseId}>
                  {form.id ? 'Update Assessment' : 'Create Assessment'}
                </Button>
              </div>
            </form>
          </section>

          <section className="teacher-assessments-table">
            <div className="table-header">
              <h2>Assessments</h2>
              {selectedCourseId && (
                <span className="table-subtitle">
                  {courses.find((course) => String(course.id) === String(selectedCourseId))?.name || ''}
                </span>
              )}
            </div>
            <div className="table-wrapper">
              {loadingAssessments ? (
                <div className="table-loading">
                  <Loading message="Loading assessments..." />
                </div>
              ) : assessments.length === 0 ? (
                <div className="empty-state">
                  <p>No assessments found for this course. Create one using the form above.</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Type</th>
                      <th>Weight (%)</th>
                      <th>Max Score</th>
                      <th>Due Date</th>
                      <th className="actions-column">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {assessments.map((assessment) => (
                      <tr key={assessment.id}>
                        <td>{assessment.name}</td>
                        <td>{assessment.type}</td>
                        <td>{assessment.weight}</td>
                        <td>{assessment.max_score}</td>
                        <td>
                          {assessment.due_date
                            ? new Date(assessment.due_date).toLocaleString()
                            : 'Not set'}
                        </td>
                        <td className="actions-column">
                          <Button
                            variant="outline"
                            onClick={() => handleEdit(assessment)}
                            className="table-action"
                          >
                            Edit
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        </main>
      </div>

      <Toast key={toast.timestamp} message={toast.message} type={toast.type} onClose={hideToast} />
    </>
  );
};

export default TeacherAssessments;

