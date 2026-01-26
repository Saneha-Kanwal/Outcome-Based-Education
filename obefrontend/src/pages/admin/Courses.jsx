import { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';
import api from '../../services/api';
import './AdminCourses.css';

const INITIAL_FORM_STATE = {
  code: '',
  name: '',
  description: '',
  credits: '',
};

const PER_PAGE = 10;

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: PER_PAGE,
    total_pages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [formErrors, setFormErrors] = useState({});
  const [editingCourseId, setEditingCourseId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [toast, setToast] = useState({ message: '', type: 'info', timestamp: null });
  const [teachers, setTeachers] = useState([]);
  const [loadingTeachers, setLoadingTeachers] = useState(true);
  const [assignmentCourses, setAssignmentCourses] = useState([]);
  const [assignmentForm, setAssignmentForm] = useState({
    teacherId: '',
    courseIds: [],
  });
  const [assigning, setAssigning] = useState(false);

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, timestamp: Date.now() });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, message: '' }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setFormErrors({});
    setEditingCourseId(null);
  }, []);

  const validateForm = useCallback(() => {
    const errors = {};

    if (!formData.code.trim()) {
      errors.code = 'Course code is required';
    } else if (formData.code.length < 2) {
      errors.code = 'Course code must be at least 2 characters';
    }

    if (!formData.name.trim()) {
      errors.name = 'Course name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Course name must be at least 3 characters';
    }

    if (formData.description && formData.description.length > 500) {
      errors.description = 'Description cannot exceed 500 characters';
    }

    if (formData.credits !== '' && formData.credits !== null) {
      const creditsValue = Number(formData.credits);
      if (Number.isNaN(creditsValue)) {
        errors.credits = 'Credits must be a number';
      } else if (creditsValue < 1 || creditsValue > 10) {
        errors.credits = 'Credits must be between 1 and 10';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  const fetchCourses = useCallback(
    async (page = 1, search = '') => {
      setLoading(true);
      try {
        const params = { page, per_page: PER_PAGE };
        if (search) {
          params.search = search;
        }

        const { data } = await api.get('/courses', { params });

        const payload = Array.isArray(data)
          ? {
              courses: data,
              total: data.length,
              page: 1,
              per_page: data.length,
              total_pages: 1,
            }
          : data;

        setCourses(payload.courses || []);

        setPagination({
          total: payload.total ?? payload.courses?.length ?? 0,
          page: payload.page ?? page,
          per_page: payload.per_page ?? PER_PAGE,
          total_pages: payload.total_pages ?? 1,
        });
      } catch (error) {
        console.error('Error fetching courses:', error);
        const message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to load courses';
        showToast(message, 'error');
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  const fetchTeachers = useCallback(async () => {
    setLoadingTeachers(true);
    try {
      const { data } = await api.get('/users', {
        params: { role: 'Teacher', page: 1, per_page: 100 },
      });
      const teacherList = Array.isArray(data?.users) ? data.users : [];
      setTeachers(teacherList);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      showToast(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to load teachers',
        'error'
      );
    } finally {
      setLoadingTeachers(false);
    }
  }, [showToast]);

  const fetchAssignmentCourses = useCallback(async () => {
    try {
      const { data } = await api.get('/courses', {
        params: { page: 1, per_page: 100 },
      });
      const payload = Array.isArray(data) ? { courses: data } : data;
      setAssignmentCourses(payload.courses || []);
    } catch (error) {
      console.error('Error fetching courses for assignment:', error);
      showToast(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to load courses list',
        'error'
      );
    }
  }, [showToast]);

  useEffect(() => {
    const handler = window.setTimeout(() => {
      setDebouncedSearch(searchTerm.trim());
    }, 400);

    return () => {
      window.clearTimeout(handler);
    };
  }, [searchTerm]);

  useEffect(() => {
    fetchCourses(1, debouncedSearch);
  }, [debouncedSearch, fetchCourses]);

  useEffect(() => {
    fetchTeachers();
    fetchAssignmentCourses();
  }, [fetchTeachers, fetchAssignmentCourses]);

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'credits' ? value.replace(/[^\d]/g, '') : value,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();

      if (!validateForm()) {
        showToast('Please fix the validation errors before submitting.', 'warning');
        return;
      }

      setSubmitting(true);

      const payload = {
        code: formData.code.trim(),
        name: formData.name.trim(),
        description: formData.description.trim() || null,
        credits:
          formData.credits === '' || formData.credits === null
            ? null
            : Number(formData.credits),
      };

      try {
        if (editingCourseId) {
          await api.put(`/courses/${editingCourseId}`, payload);
          showToast('Course updated successfully.', 'success');
          await fetchCourses(pagination.page, debouncedSearch);
          await fetchAssignmentCourses();
        } else {
          await api.post('/courses', payload);
          showToast('Course created successfully.', 'success');
          await fetchCourses(1, debouncedSearch);
          await fetchAssignmentCourses();
        }

        resetForm();
      } catch (error) {
        console.error('Error saving course:', error);
        const message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to save course';
        showToast(message, 'error');
      } finally {
        setSubmitting(false);
      }
    },
    [
      validateForm,
      formData,
      editingCourseId,
      fetchCourses,
      pagination.page,
      debouncedSearch,
      resetForm,
      showToast,
      fetchAssignmentCourses,
    ]
  );

  const handleAssignmentTeacherChange = useCallback((event) => {
    const { value } = event.target;
    setAssignmentForm((prev) => ({
      ...prev,
      teacherId: value,
    }));
  }, []);

  const handleAssignmentCoursesChange = useCallback((event) => {
    const values = Array.from(event.target.selectedOptions).map((option) => Number(option.value));
    setAssignmentForm((prev) => ({
      ...prev,
      courseIds: values,
    }));
  }, []);

  const handleAssignCourses = useCallback(
    async (event) => {
      event.preventDefault();
      if (!assignmentForm.teacherId) {
        showToast('Please select a teacher.', 'warning');
        return;
      }
      if (assignmentForm.courseIds.length === 0) {
        showToast('Select at least one course to assign.', 'warning');
        return;
      }

      setAssigning(true);
      try {
        const payload = {
          teacher_id: Number(assignmentForm.teacherId),
          course_ids: assignmentForm.courseIds,
        };
        const { data } = await api.post('/teacher-courses/assign', payload);

        const assignedCount = data?.assigned_count ?? assignmentForm.courseIds.length;
        const skippedCount = data?.skipped_count ?? 0;
        const message =
          skippedCount > 0
            ? `Assigned ${assignedCount} course(s). ${skippedCount} already assigned.`
            : `Successfully assigned ${assignedCount} course(s).`;
        showToast(message, 'success');
        setAssignmentForm({ teacherId: '', courseIds: [] });
      } catch (error) {
        console.error('Error assigning courses:', error);
        showToast(
          error.response?.data?.detail || error.response?.data?.message || 'Failed to assign courses.',
          'error'
        );
      } finally {
        setAssigning(false);
        fetchAssignmentCourses();
      }
    },
    [assignmentForm, fetchAssignmentCourses, showToast]
  );

  const handleEditCourse = useCallback((course) => {
    setEditingCourseId(course.id);
    setFormData({
      code: course.code || '',
      name: course.name || '',
      description: course.description || '',
      credits: course.credits ?? '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCancelEdit = useCallback(() => {
    resetForm();
  }, [resetForm]);

  const handleDeleteCourse = useCallback(
    async (courseId) => {
      const confirmed = window.confirm('Are you sure you want to delete this course?');
      if (!confirmed) {
        return;
      }

      try {
        await api.delete(`/courses/${courseId}`);
        showToast('Course deleted successfully.', 'success');

        if (editingCourseId === courseId) {
          resetForm();
        }

        const isLastItemOnPage = courses.length === 1;
        const nextPage =
          isLastItemOnPage && pagination.page > 1 ? pagination.page - 1 : pagination.page;

        await fetchCourses(nextPage, debouncedSearch);
        await fetchAssignmentCourses();
      } catch (error) {
        console.error('Error deleting course:', error);
        const message =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          'Failed to delete course';
        showToast(message, 'error');
      }
    },
    [
      courses.length,
      pagination.page,
      fetchCourses,
      debouncedSearch,
      editingCourseId,
      resetForm,
      showToast,
      fetchAssignmentCourses,
    ]
  );

  const handlePageChange = useCallback(
    (direction) => {
      const nextPage = pagination.page + direction;
      if (nextPage < 1 || nextPage > pagination.total_pages) {
        return;
      }
      fetchCourses(nextPage, debouncedSearch);
    },
    [pagination.page, pagination.total_pages, fetchCourses, debouncedSearch]
  );

  const summaryText = useMemo(() => {
    if (pagination.total === 0) {
      return 'No courses found';
    }

    const start = (pagination.page - 1) * pagination.per_page + 1;
    const end = Math.min(pagination.page * pagination.per_page, pagination.total);
    return `Showing ${start}-${end} of ${pagination.total} courses`;
  }, [pagination]);

  const formatDate = useCallback((value) => {
    if (!value) {
      return '—';
    }
    try {
      const date = new Date(value);
      return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return value;
    }
  }, []);

  const isEditing = Boolean(editingCourseId);

  return (
    <>
      <Navbar />
      <div className="admin-courses-page">
        <header className="admin-courses-header">
          <div>
            <h1>Manage Courses</h1>
            <p>Admins can create, update, and delete courses. All changes apply instantly.</p>
          </div>
          <div className="admin-courses-search">
            <input
              type="search"
              name="search"
              placeholder="Search by code or name"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search courses"
            />
            <Button
              variant="secondary"
              onClick={() => fetchCourses(1, debouncedSearch)}
              disabled={loading}
            >
              Refresh
            </Button>
          </div>
        </header>

        <main className="admin-courses-content">
          <section className="admin-courses-form">
            <div className="form-header">
              <h2>{isEditing ? 'Update Course' : 'Create Course'}</h2>
              <p>
                {isEditing
                  ? 'Modify the course details and save your changes.'
                  : 'Fill out the form to add a new course.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="code">
                    Course Code <span className="required">*</span>
                  </label>
                  <input
                    id="code"
                    name="code"
                    type="text"
                    value={formData.code}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(formErrors.code)}
                    aria-describedby={formErrors.code ? 'code-error' : undefined}
                    placeholder="e.g., CS101"
                    maxLength={20}
                    required
                  />
                  {formErrors.code && (
                    <span className="error-text" id="code-error">
                      {formErrors.code}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="name">
                    Course Name <span className="required">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(formErrors.name)}
                    aria-describedby={formErrors.name ? 'name-error' : undefined}
                    placeholder="e.g., Introduction to Programming"
                    maxLength={120}
                    required
                  />
                  {formErrors.name && (
                    <span className="error-text" id="name-error">
                      {formErrors.name}
                    </span>
                  )}
                </div>

                <div className="form-field full-width">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(formErrors.description)}
                    aria-describedby={formErrors.description ? 'description-error' : undefined}
                    placeholder="Briefly describe the course objectives (optional)"
                    rows={4}
                    maxLength={500}
                  />
                  {formErrors.description && (
                    <span className="error-text" id="description-error">
                      {formErrors.description}
                    </span>
                  )}
                </div>

                <div className="form-field">
                  <label htmlFor="credits">Credits</label>
                  <input
                    id="credits"
                    name="credits"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={formData.credits}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(formErrors.credits)}
                    aria-describedby={formErrors.credits ? 'credits-error' : undefined}
                    placeholder="1-10"
                    maxLength={2}
                  />
                  {formErrors.credits && (
                    <span className="error-text" id="credits-error">
                      {formErrors.credits}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-actions">
                {isEditing && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancelEdit}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                )}
                <Button type="submit" variant="primary" loading={submitting}>
                  {isEditing ? 'Update Course' : 'Create Course'}
                </Button>
              </div>
            </form>
          </section>

          <section className="admin-courses-table">
            <div className="table-header">
              <h2>Courses</h2>
              <span className="table-summary">{summaryText}</span>
            </div>

            <div className="table-wrapper">
              {loading ? (
                <div className="table-loading">
                  <Loading message="Loading courses..." />
                </div>
              ) : courses.length === 0 ? (
                <div className="empty-state">
                  <p>No courses found. Try adjusting your search or create a new course.</p>
                </div>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>Code</th>
                      <th>Name</th>
                      <th>Credits</th>
                      <th>Updated</th>
                      <th className="actions-column">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id}>
                        <td>{course.code}</td>
                        <td>{course.name}</td>
                        <td>{course.credits ?? '—'}</td>
                        <td>{formatDate(course.updated_at || course.created_at)}</td>
                        <td className="actions-column">
                          <Button
                            variant="outline"
                            onClick={() => handleEditCourse(course)}
                            className="table-action"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => handleDeleteCourse(course.id)}
                            className="table-action danger"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div className="pagination-controls">
              <Button
                variant="outline"
                onClick={() => handlePageChange(-1)}
                disabled={pagination.page === 1 || loading}
              >
                Previous
              </Button>
              <span className="page-indicator">
                Page {pagination.page} of {pagination.total_pages}
              </span>
              <Button
                variant="outline"
                onClick={() => handlePageChange(1)}
                disabled={pagination.page === pagination.total_pages || loading}
              >
                Next
              </Button>
            </div>
          </section>

          <section className="admin-courses-assign">
            <div className="assign-header">
              <div>
                <h2>Assign Courses</h2>
                <p>Select a teacher and one or more courses to assign.</p>
              </div>
            </div>

            <form onSubmit={handleAssignCourses} className="assign-form" noValidate>
              <div className="assign-grid">
                <div className="form-field">
                  <label htmlFor="assign-teacher">
                    Teacher <span className="required">*</span>
                  </label>
                  <select
                    id="assign-teacher"
                    value={assignmentForm.teacherId}
                    onChange={handleAssignmentTeacherChange}
                    disabled={loadingTeachers}
                    required
                  >
                    <option value="">Select a teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.first_name} {teacher.last_name} ({teacher.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="assign-courses">
                    Courses <span className="required">*</span>
                  </label>
                  <select
                    id="assign-courses"
                    multiple
                    value={assignmentForm.courseIds.map(String)}
                    onChange={handleAssignmentCoursesChange}
                    size={Math.min(8, assignmentCourses.length || 4)}
                    required
                  >
                    {assignmentCourses.map((course) => (
                      <option key={course.id} value={course.id}>
                        {course.code} — {course.name}
                      </option>
                    ))}
                  </select>
                  <span className="helper-text">Hold Ctrl/Command to select multiple courses.</span>
                </div>
              </div>

              <div className="form-actions">
                <Button type="submit" variant="primary" loading={assigning}>
                  Assign Courses
                </Button>
              </div>
            </form>
          </section>
        </main>
      </div>

      <Toast
        key={toast.timestamp}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </>
  );
};

export default AdminCourses;

