/**
 * Main App component for OBE System
 * Sets up routing and context providers
 */

import { memo, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { UserProvider } from './contexts/UserContext';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import GoogleOAuthCallback from './pages/auth/GoogleOAuthCallback';
import AdminDashboard from './components/dashboard/AdminDashboard';
import TeacherDashboard from './components/dashboard/TeacherDashboard';
import StudentDashboard from './components/dashboard/StudentDashboard';
import StudentCourses from './pages/student/Courses';
import StudentResults from './pages/student/Results';
import StudentProgress from './pages/student/Progress';
import StudentProfile from './pages/student/Profile';
import AdminUsers from './pages/admin/Users';
import AdminCourses from './pages/admin/Courses';
import AdminOutcomes from './pages/admin/Outcomes';
import AdminAnalytics from './pages/admin/Analytics';
import EditUser from './pages/admin/EditUser';
import TeacherCoursesPage from './pages/teacher/Courses';
import TeacherAssessments from './pages/teacher/Assessments';
import TeacherResults from './pages/teacher/Results';
import TeacherStudents from './pages/teacher/Students';
import StudentCourseDetail from './pages/student/CourseDetail';
import Loading from './components/common/Loading';
import './App.css';
import './styles/variables.css';
import './styles/components.css';
import './styles/responsive.css';

// Protected Route wrapper component - memoized to prevent re-renders
const normalizeRole = (role) =>
  role ? role.toString().trim().toLowerCase() : 'student';

const ProtectedRoute = memo(({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <Loading message="Loading..." fullScreen />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    const normalizedRequired = normalizeRole(requiredRole);
    const normalizedUserRole = normalizeRole(getUserRole(user));

    if (normalizedRequired !== normalizedUserRole) {
      const redirectPath =
        normalizedUserRole === 'admin'
          ? '/admin/dashboard'
          : normalizedUserRole === 'teacher'
            ? '/teacher/dashboard'
            : '/student/dashboard';
      return <Navigate to={redirectPath} replace />;
    }
  }

  return <>{children}</>;
});

ProtectedRoute.displayName = 'ProtectedRoute';

// Helper function to get role from user object
const getUserRole = (user) => {
  if (!user) {
    console.log('DashboardRedirect getUserRole: No user');
    return 'Student';
  }
  
  console.log('DashboardRedirect getUserRole - user:', user);
  console.log('DashboardRedirect getUserRole - user.role:', user.role);
  console.log('DashboardRedirect getUserRole - user.role_id:', user.role_id);
  
  let role = null;
  if (user.role) {
    if (typeof user.role === 'string') {
      role = user.role;
      console.log('DashboardRedirect getUserRole - role is string:', role);
    } else if (user.role && typeof user.role === 'object' && user.role.name) {
      role = user.role.name;
      console.log('DashboardRedirect getUserRole - role from object.name:', role);
    }
  }
  
  // Fallback to role_id if role object is missing
  if (!role && user.role_id) {
    const roleMap = { 1: 'Admin', 2: 'Teacher', 3: 'Student' };
    role = roleMap[user.role_id];
    console.log('DashboardRedirect getUserRole - role from role_id:', role, 'role_id:', user.role_id);
  }
  
  // Normalize role name (handle case variations)
  const normalizedRole = role && typeof role === 'string' 
    ? role.charAt(0).toUpperCase() + role.slice(1).toLowerCase() 
    : 'Student';
  
  console.log('DashboardRedirect getUserRole - Final normalized role:', normalizedRole);
  return normalizedRole;
};

// Role-based dashboard redirect - memoized to prevent unnecessary re-renders
const DashboardRedirect = memo(() => {
  const { user, loading, isAuthenticated } = useAuth();

  const normalizedRole = useMemo(() => {
    if (!user) return 'Student';
    return getUserRole(user);
  }, [user?.id, user?.role?.name, user?.role_id]);

  const redirectPath = useMemo(() => {
    if (normalizedRole === 'Admin') {
      return '/admin/dashboard';
    } else if (normalizedRole === 'Teacher') {
      return '/teacher/dashboard';
    } else {
      return '/student/dashboard';
    }
  }, [normalizedRole]);

  if (loading) {
    return <Loading message="Loading..." fullScreen />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={redirectPath} replace />;
});

DashboardRedirect.displayName = 'DashboardRedirect';

function App() {
  // Add error boundary
  try {
    return (
      <AuthProvider>
        <UserProvider>
          <Router>
            <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/auth/google/callback" element={<GoogleOAuthCallback />} />

            {/* Protected routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/outcomes"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminOutcomes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/analytics"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <AdminAnalytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users/:id"
              element={
                <ProtectedRoute requiredRole="Admin">
                  <EditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/dashboard"
              element={
                <ProtectedRoute requiredRole="Teacher">
                  <TeacherDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/courses"
              element={
                <ProtectedRoute requiredRole="Teacher">
                  <TeacherCoursesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/assessments"
              element={
                <ProtectedRoute requiredRole="Teacher">
                  <TeacherAssessments />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/results"
              element={
                <ProtectedRoute requiredRole="Teacher">
                  <TeacherResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher/students"
              element={
                <ProtectedRoute requiredRole="Teacher">
                  <TeacherStudents />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/dashboard"
              element={
                <ProtectedRoute requiredRole="Student">
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/courses"
              element={
                <ProtectedRoute requiredRole="Student">
                  <StudentCourses />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/courses/:id"
              element={
                <ProtectedRoute requiredRole="Student">
                  <StudentCourseDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/results"
              element={
                <ProtectedRoute requiredRole="Student">
                  <StudentResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/progress"
              element={
                <ProtectedRoute requiredRole="Student">
                  <StudentProgress />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student/profile"
              element={
                <ProtectedRoute requiredRole="Student">
                  <StudentProfile />
                </ProtectedRoute>
              }
            />

            {/* Default redirect */}
            <Route path="/" element={<DashboardRedirect />} />
            <Route path="/dashboard" element={<DashboardRedirect />} />

            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </UserProvider>
      </AuthProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Application Error</h1>
        <p>There was an error loading the application.</p>
        <p>Error: {error.message}</p>
        <p>Please check the browser console for more details.</p>
      </div>
    );
  }
}

export default App;
