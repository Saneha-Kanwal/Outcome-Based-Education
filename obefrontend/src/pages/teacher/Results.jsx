import { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '../../components/common/Navbar';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import Loading from '../../components/common/Loading';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import './TeacherResults.css';

const TeacherResults = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
  const [students, setStudents] = useState([]);
  const [clos, setClos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingAssessments, setLoadingAssessments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [scores, setScores] = useState({});
  const [existingResults, setExistingResults] = useState({});
  const [toast, setToast] = useState({ message: '', type: 'info', timestamp: null });

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, timestamp: Date.now() });
  }, []);

  const hideToast = useCallback(() => {
    setToast((prev) => ({ ...prev, message: '' }));
  }, []);

  const fetchCourses = useCallback(async () => {
    if (!user?.id) {
      setCourses([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data } = await api.get(`/teacher/${user.id}/courses`);
      const list = Array.isArray(data) ? data : [];
      setCourses(list);
      if (!selectedCourseId && list.length > 0) {
        setSelectedCourseId(String(list[0].id));
      }
    } catch (error) {
      console.error('Error fetching teacher courses:', error);
      showToast(
        error.response?.data?.detail || error.response?.data?.message || 'Failed to load courses.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  }, [selectedCourseId, showToast, user?.id]);

  const fetchCourseData = useCallback(
    async (courseId) => {
      if (!courseId) {
        setAssessments([]);
        setStudents([]);
        setClos([]);
        setSelectedAssessmentId('');
        setScores({});
        return;
      }

      setLoadingAssessments(true);
      try {
        const [assessmentsResp, studentsResp, closResp] = await Promise.allSettled([
          api.get(`/courses/${courseId}/assessments`),
          api.get(`/courses/${courseId}/students`),
          api.get(`/courses/${courseId}/clos`),
        ]);

        if (assessmentsResp.status === 'fulfilled') {
          const list = Array.isArray(assessmentsResp.value.data) ? assessmentsResp.value.data : [];
          setAssessments(list);
          if (list.length > 0) {
            setSelectedAssessmentId(String(list[0].id));
          } else {
            setSelectedAssessmentId('');
          }
        } else {
          throw assessmentsResp.reason;
        }

        if (studentsResp.status === 'fulfilled') {
          const list = Array.isArray(studentsResp.value.data) ? studentsResp.value.data : [];
          setStudents(list);
        } else {
          throw studentsResp.reason;
        }

        if (closResp.status === 'fulfilled') {
          const list = Array.isArray(closResp.value.data) ? closResp.value.data : [];
          setClos(list);
        } else {
          throw closResp.reason;
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
        showToast(
          error.response?.data?.detail || error.response?.data?.message || 'Failed to load course data.',
          'error'
        );
        setAssessments([]);
        setStudents([]);
        setClos([]);
        setSelectedAssessmentId('');
      } finally {
        setLoadingAssessments(false);
        setScores({});
      }
    },
    [showToast]
  );

  const fetchExistingResults = useCallback(
    async (assessmentId) => {
      if (!assessmentId) {
        setExistingResults({});
        setScores({});
        return;
      }
      try {
        const { data } = await api.get(`/results/assessments/${assessmentId}/results`);
        const map = {};
        const newScores = {};
        if (Array.isArray(data)) {
          data.forEach((result) => {
            const key = `${result.student_id}-${result.clo_id}`;
            map[key] = result;
            newScores[result.student_id] = {
              score: result.score?.toString() ?? '',
              cloId: result.clo_id,
              maxScore: result.max_score?.toString() ?? '',
            };
          });
        }
        setExistingResults(map);
        setScores((prev) => ({
          ...prev,
          ...newScores,
        }));
      } catch (error) {
        console.error('Error fetching assessment results:', error);
        showToast(
          error.response?.data?.detail || error.response?.data?.message || 'Failed to load existing results.',
          'error'
        );
        setExistingResults({});
      }
    },
    [showToast]
  );

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (selectedCourseId) {
      fetchCourseData(selectedCourseId);
    }
  }, [fetchCourseData, selectedCourseId]);

  useEffect(() => {
    if (selectedAssessmentId) {
      fetchExistingResults(selectedAssessmentId);
    } else {
      setExistingResults({});
    }
  }, [fetchExistingResults, selectedAssessmentId]);

  const handleCourseChange = useCallback((event) => {
    setSelectedCourseId(event.target.value);
    setSelectedAssessmentId('');
    setScores({});
    setExistingResults({});
  }, []);

  const handleAssessmentChange = useCallback((event) => {
    setSelectedAssessmentId(event.target.value);
    setScores({});
    setExistingResults({});
  }, []);

  const handleScoreChange = useCallback((studentId, field, value) => {
    setScores((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value,
      },
    }));
  }, []);

  const currentAssessment = useMemo(
    () => assessments.find((assessment) => String(assessment.id) === String(selectedAssessmentId)) || null,
    [assessments, selectedAssessmentId]
  );

  useEffect(() => {
    if (currentAssessment) {
      setScores((prev) => {
        const updated = { ...prev };
        students.forEach((student) => {
          if (!updated[student.id]) {
            updated[student.id] = {
              score: '',
              cloId: clos[0]?.id || '',
              maxScore: currentAssessment.max_score?.toString() ?? '',
            };
          } else if (!updated[student.id]?.maxScore) {
            updated[student.id] = {
              ...updated[student.id],
              maxScore: currentAssessment.max_score?.toString() ?? '',
            };
          }
          if (!updated[student.id]?.cloId && clos.length > 0) {
            updated[student.id] = {
              ...updated[student.id],
              cloId: clos[0]?.id || '',
            };
          }
        });
        return updated;
      });
    }
  }, [clos, currentAssessment, students]);

  const handleSubmit = useCallback(
    async (event) => {
      event.preventDefault();
      if (!selectedAssessmentId || !selectedCourseId) {
        showToast('Select a course and assessment first.', 'warning');
        return;
      }

      const payloadEntries = [];
      const updates = [];

      students.forEach((student) => {
        const entry = scores[student.id];
        if (!entry || entry.score === '' || entry.score === null || entry.score === undefined) {
          return;
        }
        const cloId = entry.cloId || (clos[0]?.id ?? null);
        if (!cloId) {
          return;
        }
        const scoreValue = Number(entry.score);
        const maxScoreValue = Number(entry.maxScore || currentAssessment?.max_score || 0);
        if (Number.isNaN(scoreValue) || Number.isNaN(maxScoreValue) || maxScoreValue <= 0) {
          return;
        }

        const key = `${student.id}-${cloId}`;
        const existing = existingResults[key];

        if (existing) {
          updates.push({
            id: existing.id,
            score: scoreValue,
            max_score: maxScoreValue,
          });
        } else {
          payloadEntries.push({
            student_id: student.id,
            assessment_id: Number(selectedAssessmentId),
            clo_id: cloId,
            score: scoreValue,
            max_score: maxScoreValue,
          });
        }
      });

      if (payloadEntries.length === 0 && updates.length === 0) {
        showToast('Enter at least one score before saving.', 'warning');
        return;
      }

      setSubmitting(true);
      try {
        if (payloadEntries.length > 0) {
          await api.post('/results/bulk', {
            assessment_id: Number(selectedAssessmentId),
            results: payloadEntries,
          });
        }

        if (updates.length > 0) {
          await Promise.all(
            updates.map((update) =>
              api.put(`/results/${update.id}`, {
                score: update.score,
                max_score: update.max_score,
              })
            )
          );
        }

        showToast('Results saved successfully.', 'success');
        await fetchExistingResults(selectedAssessmentId);
      } catch (error) {
        console.error('Error saving results:', error);
        showToast(
          error.response?.data?.detail || error.response?.data?.message || 'Failed to save results.',
          'error'
        );
      } finally {
        setSubmitting(false);
      }
    },
    [clos, currentAssessment?.max_score, existingResults, fetchExistingResults, scores, selectedAssessmentId, selectedCourseId, showToast, students]
  );

  return (
    <>
      <Navbar />
      <div className="teacher-results-page">
        <header className="teacher-results-header">
          <h1>Enter Results</h1>
          <p>Select a course and assessment, then enter scores for enrolled students.</p>
        </header>

        <main className="teacher-results-content">
          {loading ? (
            <div className="centered">
              <Loading message="Loading courses..." />
            </div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <p>No courses assigned to you yet.</p>
            </div>
          ) : (
            <>
              <form className="teacher-results-form" onSubmit={handleSubmit}>
                <div className="form-grid">
                  <div className="form-field">
                    <label htmlFor="course-select">
                      Course <span className="required">*</span>
                    </label>
                    <select id="course-select" value={selectedCourseId} onChange={handleCourseChange}>
                      {courses.map((course) => (
                        <option key={course.id} value={course.id}>
                          {course.code} — {course.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-field">
                    <label htmlFor="assessment-select">
                      Assessment <span className="required">*</span>
                    </label>
                    <select
                      id="assessment-select"
                      value={selectedAssessmentId}
                      onChange={handleAssessmentChange}
                      disabled={loadingAssessments || assessments.length === 0}
                    >
                      {assessments.length === 0 ? (
                        <option value="">No assessments available</option>
                      ) : (
                        assessments.map((assessment) => (
                          <option key={assessment.id} value={assessment.id}>
                            {assessment.name} ({assessment.type})
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                </div>

                {loadingAssessments ? (
                  <div className="centered">
                    <Loading message="Loading assessment details..." />
                  </div>
                ) : students.length === 0 ? (
                  <div className="empty-state">
                    <p>No students enrolled in this course.</p>
                  </div>
                ) : clos.length === 0 ? (
                  <div className="empty-state">
                    <p>No CLOs defined for this course. Add at least one CLO before recording results.</p>
                  </div>
                ) : (
                  <div className="results-table-wrapper">
                    <table>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Email</th>
                          <th>CLO</th>
                          <th>Score</th>
                          <th>Max Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.map((student) => {
                          const entry = scores[student.id] || {};
                          return (
                            <tr key={student.id}>
                              <td>
                                {student.first_name} {student.last_name}
                              </td>
                              <td>{student.email}</td>
                              <td>
                                <select
                                  value={entry.cloId || ''}
                                  onChange={(event) => handleScoreChange(student.id, 'cloId', Number(event.target.value))}
                                >
                                  {clos.map((clo) => (
                                    <option key={clo.id} value={clo.id}>
                                      {clo.code}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  value={entry.score ?? ''}
                                  onChange={(event) => handleScoreChange(student.id, 'score', event.target.value)}
                                  placeholder="Score"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  value={entry.maxScore ?? ''}
                                  onChange={(event) => handleScoreChange(student.id, 'maxScore', event.target.value)}
                                  placeholder="Max"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                <div className="form-actions">
                  <Button type="submit" variant="primary" loading={submitting} disabled={students.length === 0}>
                    Save Results
                  </Button>
                </div>
              </form>
            </>
          )}
        </main>
      </div>

      <Toast key={toast.timestamp} message={toast.message} type={toast.type} onClose={hideToast} />
    </>
  );
};

export default TeacherResults;

