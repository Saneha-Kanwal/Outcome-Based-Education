import { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Toast from '../../components/common/Toast';
import api from '../../services/api';
import './AdminOutcomes.css';

const INITIAL_PLO_FORM = {
  code: '',
  description: '',
};

const INITIAL_CLO_FORM = {
  code: '',
  description: '',
};

const AdminOutcomes = () => {
  const [plos, setPlos] = useState([]);
  const [ploForm, setPloForm] = useState(INITIAL_PLO_FORM);
  const [ploErrors, setPloErrors] = useState({});
  const [editingPloId, setEditingPloId] = useState(null);
  const [loadingPlos, setLoadingPlos] = useState(true);
  const [savingPlo, setSavingPlo] = useState(false);

  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [clos, setClos] = useState([]);
  const [loadingClos, setLoadingClos] = useState(false);
  const [editingCloId, setEditingCloId] = useState(null);
  const [cloForm, setCloForm] = useState(INITIAL_CLO_FORM);
  const [cloErrors, setCloErrors] = useState({});
  const [savingClo, setSavingClo] = useState(false);

  const [toast, setToast] = useState({ message: '', type: 'info', timestamp: null });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, timestamp: Date.now() });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, message: '' }));
  }, []);

  const extractErrorMessage = useCallback((error, fallback) => {
    if (error?.response?.data) {
      return (
        error.response.data.detail ||
        error.response.data.message ||
        error.response.data.error ||
        fallback
      );
    }
    return fallback;
  }, []);

  const fetchPlos = useCallback(async () => {
    setLoadingPlos(true);
    try {
      const { data } = await api.get('/plos');
      setPlos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading PLOs:', error);
      showToast(extractErrorMessage(error, 'Failed to load PLOs'), 'error');
    } finally {
      setLoadingPlos(false);
    }
  }, [extractErrorMessage, showToast]);

  const fetchCourses = useCallback(async () => {
    try {
      const { data } = await api.get('/courses', { params: { page: 1, per_page: 100 } });
      if (Array.isArray(data)) {
        setCourses(data);
        if (data.length > 0) {
          setSelectedCourseId((prev) => prev || data[0].id);
        }
      } else {
        setCourses(data.courses || []);
        if (!selectedCourseId && (data.courses?.length ?? 0) > 0) {
          setSelectedCourseId(data.courses[0].id);
        }
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      showToast(extractErrorMessage(error, 'Failed to load courses'), 'error');
    }
  }, [extractErrorMessage, selectedCourseId, showToast]);

  const fetchClos = useCallback(
    async (courseId) => {
      if (!courseId) {
        setClos([]);
        return;
      }
      setLoadingClos(true);
      try {
        const { data } = await api.get(`/courses/${courseId}/clos`);
        setClos(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error loading CLOs:', error);
        showToast(extractErrorMessage(error, 'Failed to load CLOs'), 'error');
      } finally {
        setLoadingClos(false);
      }
    },
    [extractErrorMessage, showToast]
  );

  useEffect(() => {
    fetchPlos();
  }, [fetchPlos]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchClos(selectedCourseId);
    }
  }, [selectedCourseId, fetchClos]);

  const validatePloForm = useCallback(() => {
    const errors = {};

    if (!ploForm.code.trim()) {
      errors.code = 'PLO code is required';
    } else if (ploForm.code.length < 2) {
      errors.code = 'PLO code must be at least 2 characters';
    }

    if (!ploForm.description.trim()) {
      errors.description = 'PLO description is required';
    } else if (ploForm.description.length < 5) {
      errors.description = 'Description must be at least 5 characters';
    }

    setPloErrors(errors);
    return Object.keys(errors).length === 0;
  }, [ploForm]);

  const validateCloForm = useCallback(() => {
    const errors = {};

    if (!selectedCourseId) {
      errors.course = 'Please select a course first';
    }

    if (!cloForm.code.trim()) {
      errors.code = 'CLO code is required';
    } else if (cloForm.code.length < 2) {
      errors.code = 'CLO code must be at least 2 characters';
    }

    if (!cloForm.description.trim()) {
      errors.description = 'CLO description is required';
    } else if (cloForm.description.length < 5) {
      errors.description = 'Description must be at least 5 characters';
    }

    setCloErrors(errors);
    return Object.keys(errors).length === 0;
  }, [cloForm, selectedCourseId]);

  const handlePloChange = useCallback((event) => {
    const { name, value } = event.target;
    setPloForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleCloChange = useCallback((event) => {
    const { name, value } = event.target;
    setCloForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const handleSelectCourse = useCallback((event) => {
    const { value } = event.target;
    setSelectedCourseId(value ? Number(value) : '');
    setEditingCloId(null);
    setCloForm(INITIAL_CLO_FORM);
    setCloErrors({});
  }, []);

  const handleEditPlo = useCallback((plo) => {
    setEditingPloId(plo.id);
    setPloForm({
      code: plo.code || '',
      description: plo.description || '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCancelPloEdit = useCallback(() => {
    setEditingPloId(null);
    setPloForm(INITIAL_PLO_FORM);
    setPloErrors({});
  }, []);

  const handleEditClo = useCallback((clo) => {
    if (clo.course_id !== selectedCourseId) {
      setSelectedCourseId(clo.course_id);
    }
    setEditingCloId(clo.id);
    setCloForm({
      code: clo.code || '',
      description: clo.description || '',
    });
    window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' });
  }, [selectedCourseId]);

  const handleCancelCloEdit = useCallback(() => {
    setEditingCloId(null);
    setCloForm(INITIAL_CLO_FORM);
    setCloErrors({});
  }, []);

  const handleSubmitPlo = useCallback(
    async (event) => {
      event.preventDefault();
      if (!validatePloForm()) {
        showToast('Please resolve the highlighted PLO errors.', 'warning');
        return;
      }

      setSavingPlo(true);

      const payload = {
        code: ploForm.code.trim(),
        description: ploForm.description.trim(),
      };

      try {
        if (editingPloId) {
          await api.put(`/plos/${editingPloId}`, payload);
          showToast('PLO updated successfully.', 'success');
        } else {
          await api.post('/plos', payload);
          showToast('PLO created successfully.', 'success');
        }
        await fetchPlos();
        handleCancelPloEdit();
      } catch (error) {
        console.error('Error saving PLO:', error);
        showToast(extractErrorMessage(error, 'Failed to save PLO'), 'error');
      } finally {
        setSavingPlo(false);
      }
    },
    [
      validatePloForm,
      ploForm,
      editingPloId,
      fetchPlos,
      handleCancelPloEdit,
      extractErrorMessage,
      showToast,
    ]
  );

  const handleDeletePlo = useCallback(
    async (ploId) => {
      const confirmed = window.confirm('Delete this PLO? This action cannot be undone.');
      if (!confirmed) {
        return;
      }
      try {
        await api.delete(`/plos/${ploId}`);
        showToast('PLO deleted.', 'success');
        if (editingPloId === ploId) {
          handleCancelPloEdit();
        }
        await fetchPlos();
      } catch (error) {
        console.error('Error deleting PLO:', error);
        showToast(extractErrorMessage(error, 'Failed to delete PLO'), 'error');
      }
    },
    [editingPloId, handleCancelPloEdit, fetchPlos, extractErrorMessage, showToast]
  );

  const handleSubmitClo = useCallback(
    async (event) => {
      event.preventDefault();
      if (!validateCloForm()) {
        showToast('Please resolve the highlighted CLO errors.', 'warning');
        return;
      }

      setSavingClo(true);

      const payload = {
        code: cloForm.code.trim(),
        description: cloForm.description.trim(),
      };

      try {
        if (editingCloId) {
          await api.put(`/clos/${editingCloId}`, payload);
          showToast('CLO updated successfully.', 'success');
        } else {
          await api.post(`/courses/${selectedCourseId}/clos`, payload);
          showToast('CLO created successfully.', 'success');
        }
        await fetchClos(selectedCourseId);
        handleCancelCloEdit();
      } catch (error) {
        console.error('Error saving CLO:', error);
        showToast(extractErrorMessage(error, 'Failed to save CLO'), 'error');
      } finally {
        setSavingClo(false);
      }
    },
    [
      validateCloForm,
      cloForm,
      editingCloId,
      selectedCourseId,
      fetchClos,
      handleCancelCloEdit,
      extractErrorMessage,
      showToast,
    ]
  );

  const handleDeleteClo = useCallback(
    async (cloId) => {
      const confirmed = window.confirm('Delete this CLO? This action cannot be undone.');
      if (!confirmed) {
        return;
      }
      try {
        await api.delete(`/clos/${cloId}`);
        showToast('CLO deleted.', 'success');
        if (editingCloId === cloId) {
          handleCancelCloEdit();
        }
        await fetchClos(selectedCourseId);
      } catch (error) {
        console.error('Error deleting CLO:', error);
        showToast(extractErrorMessage(error, 'Failed to delete CLO'), 'error');
      }
    },
    [
      editingCloId,
      handleCancelCloEdit,
      fetchClos,
      selectedCourseId,
      extractErrorMessage,
      showToast,
    ]
  );

  const selectedCourseName = useMemo(() => {
    if (!selectedCourseId) {
      return 'Select a course';
    }
    const course = courses.find((c) => c.id === Number(selectedCourseId));
    if (!course) {
      return 'Unknown course';
    }
    return `${course.code} • ${course.name}`;
  }, [courses, selectedCourseId]);

  return (
    <>
      <Navbar />
      <div className="admin-outcomes-page">
        <header className="admin-outcomes-header">
          <h1>Manage Outcomes</h1>
          <p>
            Define Program Learning Outcomes (PLOs) and map Course Learning Outcomes (CLOs) to
            specific courses.
          </p>
        </header>

        <main className="admin-outcomes-content">
          <section className="admin-outcomes-section">
            <div className="section-header">
              <div>
                <h2>{editingPloId ? 'Update PLO' : 'Create PLO'}</h2>
                <p>
                  Program Learning Outcomes describe the overarching skills students should gain by
                  graduating.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmitPlo} className="outcome-form" noValidate>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="plo-code">
                    PLO Code <span className="required">*</span>
                  </label>
                  <input
                    id="plo-code"
                    name="code"
                    value={ploForm.code}
                    onChange={handlePloChange}
                    aria-invalid={Boolean(ploErrors.code)}
                    aria-describedby={ploErrors.code ? 'plo-code-error' : undefined}
                    placeholder="e.g., PLO1"
                    maxLength={20}
                    required
                  />
                  {ploErrors.code && (
                    <span className="error-text" id="plo-code-error">
                      {ploErrors.code}
                    </span>
                  )}
                </div>

                <div className="form-field full-width">
                  <label htmlFor="plo-description">
                    Description <span className="required">*</span>
                  </label>
                  <textarea
                    id="plo-description"
                    name="description"
                    value={ploForm.description}
                    onChange={handlePloChange}
                    aria-invalid={Boolean(ploErrors.description)}
                    aria-describedby={ploErrors.description ? 'plo-description-error' : undefined}
                    placeholder="Describe the learning outcome students should achieve"
                    rows={4}
                    maxLength={500}
                    required
                  />
                  {ploErrors.description && (
                    <span className="error-text" id="plo-description-error">
                      {ploErrors.description}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-actions">
                {editingPloId && (
                  <Button type="button" variant="outline" onClick={handleCancelPloEdit} disabled={savingPlo}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" variant="primary" loading={savingPlo}>
                  {editingPloId ? 'Update PLO' : 'Create PLO'}
                </Button>
              </div>
            </form>

            <div className="outcomes-table-wrapper">
              <div className="table-header">
                <h3>Program Learning Outcomes</h3>
              </div>
              <div className="table-content">
                {loadingPlos ? (
                  <div className="table-loading">
                    <Loading message="Loading PLOs..." />
                  </div>
                ) : plos.length === 0 ? (
                  <div className="empty-state">
                    <p>No PLOs have been defined yet.</p>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Description</th>
                        <th className="actions-column">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plos.map((plo) => (
                        <tr key={plo.id}>
                          <td>{plo.code}</td>
                          <td>{plo.description}</td>
                          <td className="actions-column">
                            <Button
                              variant="outline"
                              className="table-action"
                              onClick={() => handleEditPlo(plo)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="secondary"
                              className="table-action danger"
                              onClick={() => handleDeletePlo(plo.id)}
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
            </div>
          </section>

          <section className="admin-outcomes-section">
            <div className="section-header">
              <div>
                <h2>{editingCloId ? 'Update CLO' : 'Create CLO'}</h2>
                <p>
                  Course Learning Outcomes describe measurable objectives tied to a specific course.
                </p>
              </div>
              <div className="course-selector">
                <label htmlFor="course-select">Course</label>
                <select
                  id="course-select"
                  value={selectedCourseId}
                  onChange={handleSelectCourse}
                  aria-invalid={Boolean(cloErrors.course)}
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} — {course.name}
                    </option>
                  ))}
                </select>
                {cloErrors.course && <span className="error-text">{cloErrors.course}</span>}
              </div>
            </div>

            <form onSubmit={handleSubmitClo} className="outcome-form" noValidate>
              <div className="form-grid">
                <div className="form-field">
                  <label htmlFor="clo-code">
                    CLO Code <span className="required">*</span>
                  </label>
                  <input
                    id="clo-code"
                    name="code"
                    value={cloForm.code}
                    onChange={handleCloChange}
                    aria-invalid={Boolean(cloErrors.code)}
                    aria-describedby={cloErrors.code ? 'clo-code-error' : undefined}
                    placeholder="e.g., CLO1"
                    maxLength={20}
                    required
                  />
                  {cloErrors.code && (
                    <span className="error-text" id="clo-code-error">
                      {cloErrors.code}
                    </span>
                  )}
                </div>

                <div className="form-field full-width">
                  <label htmlFor="clo-description">
                    Description <span className="required">*</span>
                  </label>
                  <textarea
                    id="clo-description"
                    name="description"
                    value={cloForm.description}
                    onChange={handleCloChange}
                    aria-invalid={Boolean(cloErrors.description)}
                    aria-describedby={cloErrors.description ? 'clo-description-error' : undefined}
                    placeholder="Describe the learning outcome for this course"
                    rows={4}
                    maxLength={500}
                    required
                  />
                  {cloErrors.description && (
                    <span className="error-text" id="clo-description-error">
                      {cloErrors.description}
                    </span>
                  )}
                </div>
              </div>

              <div className="form-actions">
                {editingCloId && (
                  <Button type="button" variant="outline" onClick={handleCancelCloEdit} disabled={savingClo}>
                    Cancel
                  </Button>
                )}
                <Button type="submit" variant="primary" loading={savingClo}>
                  {editingCloId ? 'Update CLO' : 'Create CLO'}
                </Button>
              </div>
            </form>

            <div className="outcomes-table-wrapper">
              <div className="table-header">
                <div>
                  <h3>Course Learning Outcomes</h3>
                  <span className="table-subtitle">{selectedCourseName}</span>
                </div>
              </div>
              <div className="table-content">
                {selectedCourseId === '' ? (
                  <div className="empty-state">
                    <p>Select a course to view its CLOs.</p>
                  </div>
                ) : loadingClos ? (
                  <div className="table-loading">
                    <Loading message="Loading CLOs..." />
                  </div>
                ) : clos.length === 0 ? (
                  <div className="empty-state">
                    <p>No CLOs defined for this course yet.</p>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th>Code</th>
                        <th>Description</th>
                        <th className="actions-column">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clos.map((clo) => (
                        <tr key={clo.id}>
                          <td>{clo.code}</td>
                          <td>{clo.description}</td>
                          <td className="actions-column">
                            <Button
                              variant="outline"
                              className="table-action"
                              onClick={() => handleEditClo(clo)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="secondary"
                              className="table-action danger"
                              onClick={() => handleDeleteClo(clo.id)}
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
            </div>
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

export default AdminOutcomes;

