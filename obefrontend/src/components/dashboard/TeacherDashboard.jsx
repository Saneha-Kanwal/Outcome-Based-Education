/**
 * Teacher Dashboard component for OBE System
 * Main dashboard for teachers
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../common/Card';
import Navbar from '../common/Navbar';
import Button from '../common/Button';
import api from '../../services/api';
import './Dashboard.css';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assignedCount, setAssignedCount] = useState(null);
  const [assessmentCount, setAssessmentCount] = useState(null);
  const [studentCount, setStudentCount] = useState(null);

  const fetchTeachingSummary = useCallback(async () => {
    if (!user?.id) {
      return;
    }

    try {
      const { data } = await api.get(`/teacher/${user.id}/courses`);
      const courses = Array.isArray(data) ? data : [];
      setAssignedCount(courses.length);

      if (courses.length === 0) {
        setAssessmentCount(0);
        return;
      }

      const [assessmentResults, studentsResponse] = await Promise.allSettled([
        Promise.all(
          courses.map((course) => api.get(`/courses/${course.id}/assessments`))
        ),
        api.get(`/results/teachers/${user.id}/students`),
      ]);

      if (assessmentResults.status === 'fulfilled') {
        const totalAssessments = assessmentResults.value.reduce((acc, response) => {
          const list = Array.isArray(response.data) ? response.data : [];
          return acc + list.length;
        }, 0);
        setAssessmentCount(totalAssessments);
      } else {
        setAssessmentCount(0);
      }

      if (studentsResponse.status === 'fulfilled') {
        const list = Array.isArray(studentsResponse.value.data) ? studentsResponse.value.data : [];
        setStudentCount(list.length);
      } else {
        setStudentCount(0);
      }
    } catch (error) {
      console.error('Error fetching teacher dashboard summary:', error);
      setAssignedCount(0);
      setAssessmentCount(0);
      setStudentCount(0);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchTeachingSummary();
  }, [fetchTeachingSummary]);

  return (
    <>
      <Navbar />
      <div className="dashboard teacher-dashboard">
        <div className="dashboard-header">
          <h1>Teacher Dashboard</h1>
          <p>
            Welcome, {user?.first_name} {user?.last_name}
          </p>
        </div>

        <div className="dashboard-content">
          <div className="dashboard-grid">
            <Card title="My Courses" description="View and manage your courses">
              <p>Assigned Courses: {assignedCount === null ? '--' : assignedCount}</p>
              <Button
                variant="primary"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  navigate('/teacher/courses');
                }}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                View Courses
              </Button>
            </Card>

            <Card title="Assessments" description="Create and manage assessments">
              <p>Active Assessments: {assessmentCount === null ? '--' : assessmentCount}</p>
              <Button
                variant="primary"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  navigate('/teacher/assessments');
                }}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                Manage Assessments
              </Button>
            </Card>

            <Card title="Students" description="View student progress and results">
              <p>Total Students: {studentCount === null ? '--' : studentCount}</p>
              <Button
                variant="primary"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  navigate('/teacher/students');
                }}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                View Students
              </Button>
            </Card>

            <Card title="Results" description="Enter and manage student results">
              <p>Assessments with Results: {assessmentCount === null ? '--' : assessmentCount}</p>
              <Button
                variant="primary"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  navigate('/teacher/results');
                }}
                style={{ marginTop: '1rem', width: '100%' }}
              >
                Enter Results
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default TeacherDashboard;
