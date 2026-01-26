/**
 * Constants for OBE System frontend.
 * Role constants, API endpoints, and other configuration values.
 */

// User Roles
export const ROLES = {
  ADMIN: 'Admin',
  TEACHER: 'Teacher',
  STUDENT: 'Student',
};

// Role IDs (these should match database role IDs)
export const ROLE_IDS = {
  ADMIN: 1,
  TEACHER: 2,
  STUDENT: 3,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    GOOGLE: '/auth/google',
    OTP_REQUEST: '/auth/otp/request',
    OTP_VERIFY: '/auth/otp/verify',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
  },
  // Users
  USERS: {
    LIST: '/users',
    GET: (id) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`,
    PROFILE: (id) => `/users/${id}/profile`,
  },
  // Courses
  COURSES: {
    LIST: '/courses',
    GET: (id) => `/courses/${id}`,
    CREATE: '/courses',
    UPDATE: (id) => `/courses/${id}`,
    DELETE: (id) => `/courses/${id}`,
    TEACHERS: (id) => `/courses/${id}/teachers`,
    STUDENTS: (id) => `/courses/${id}/students`,
  },
  // Outcomes
  OUTCOMES: {
    PLOS: {
      LIST: '/plos',
      CREATE: '/plos',
      UPDATE: (id) => `/plos/${id}`,
      DELETE: (id) => `/plos/${id}`,
    },
    CLOS: {
      LIST: (courseId) => `/courses/${courseId}/clos`,
      CREATE: (courseId) => `/courses/${courseId}/clos`,
      UPDATE: (id) => `/clos/${id}`,
      DELETE: (id) => `/clos/${id}`,
    },
  },
  // Mappings
  MAPPINGS: {
    LIST: '/mappings',
    CREATE: '/mappings',
    UPDATE: (id) => `/mappings/${id}`,
    DELETE: (id) => `/mappings/${id}`,
    BY_COURSE: (id) => `/courses/${id}/mappings`,
  },
  // Assessments
  ASSESSMENTS: {
    LIST: (courseId) => `/courses/${courseId}/assessments`,
    GET: (id) => `/assessments/${id}`,
    CREATE: '/assessments',
    UPDATE: (id) => `/assessments/${id}`,
    DELETE: (id) => `/assessments/${id}`,
  },
  // Results
  RESULTS: {
    BY_ASSESSMENT: (id) => `/assessments/${id}/results`,
    BY_STUDENT: (id) => `/students/${id}/results`,
    CREATE: '/results',
    BULK: '/results/bulk',
    UPDATE: (id) => `/results/${id}`,
    FEEDBACK: (id) => `/results/${id}/feedback`,
  },
  // Analytics
  ANALYTICS: {
    COURSE: (id) => `/analytics/course/${id}`,
    PROGRAM: '/analytics/program',
    STUDENT: (id) => `/analytics/student/${id}`,
    OUTCOME: (id) => `/analytics/outcomes/${id}`,
  },
};

// Assessment Types
export const ASSESSMENT_TYPES = {
  QUIZ: 'Quiz',
  ASSIGNMENT: 'Assignment',
  EXAM: 'Exam',
  PROJECT: 'Project',
};

// Enrollment Status
export const ENROLLMENT_STATUS = {
  ACTIVE: 'Active',
  COMPLETED: 'Completed',
  WITHDRAWN: 'Withdrawn',
};

// Mapping Strength
export const MAPPING_STRENGTH = {
  STRONG: 'Strong',
  MODERATE: 'Moderate',
  WEAK: 'Weak',
};

// Pagination defaults
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PER_PAGE: 20,
  MAX_PER_PAGE: 100,
};

