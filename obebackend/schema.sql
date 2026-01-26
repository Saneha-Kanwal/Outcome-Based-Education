-- OBE System Database Schema
-- PostgreSQL 12+ compatible
-- Created: 2025-01-27

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role_id INTEGER NOT NULL REFERENCES roles(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role_id ON users(role_id);

-- Roles table
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_roles_name ON roles(name);

-- Permissions table
CREATE TABLE permissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Role-Permission junction table
CREATE TABLE role_permissions (
    id SERIAL PRIMARY KEY,
    role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id INTEGER NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role_id ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission_id ON role_permissions(permission_id);

-- Courses table
CREATE TABLE courses (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    credits INTEGER,
    deleted_at TIMESTAMP NULL, -- Soft delete timestamp
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_deleted_at ON courses(deleted_at) WHERE deleted_at IS NULL; -- Index for active courses only

-- Course-Teacher junction table
CREATE TABLE course_teachers (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, teacher_id)
);

CREATE INDEX idx_course_teachers_course_id ON course_teachers(course_id);
CREATE INDEX idx_course_teachers_teacher_id ON course_teachers(teacher_id);

-- Program Learning Outcomes (PLOs)
CREATE TABLE plos (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plos_code ON plos(code);

-- Course Learning Outcomes (CLOs)
CREATE TABLE clos (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    code VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(course_id, code)
);

CREATE INDEX idx_clos_course_id ON clos(course_id);
CREATE INDEX idx_clos_course_code ON clos(course_id, code);

-- CO-PO Mapping table
CREATE TABLE co_po_mappings (
    id SERIAL PRIMARY KEY,
    clo_id INTEGER NOT NULL REFERENCES clos(id) ON DELETE CASCADE,
    plo_id INTEGER NOT NULL REFERENCES plos(id) ON DELETE CASCADE,
    strength VARCHAR(20) DEFAULT 'Moderate', -- Strong, Moderate, Weak
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(clo_id, plo_id)
);

CREATE INDEX idx_co_po_mappings_clo_id ON co_po_mappings(clo_id);
CREATE INDEX idx_co_po_mappings_plo_id ON co_po_mappings(plo_id);

-- Enrollments table
CREATE TABLE enrollments (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrollment_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(20) DEFAULT 'Active', -- Active, Completed, Withdrawn
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id)
);

CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);

-- Assessments table
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    course_id INTEGER NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    teacher_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(50) NOT NULL, -- Quiz, Assignment, Exam, Project
    description TEXT,
    weight DECIMAL(5,2) NOT NULL, -- Percentage weight
    max_score DECIMAL(10,2) NOT NULL,
    due_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_assessments_course_id ON assessments(course_id);
CREATE INDEX idx_assessments_teacher_id ON assessments(teacher_id);
CREATE INDEX idx_assessments_due_date ON assessments(due_date);

-- Assessment-CLO junction table
CREATE TABLE assessment_clos (
    id SERIAL PRIMARY KEY,
    assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    clo_id INTEGER NOT NULL REFERENCES clos(id) ON DELETE CASCADE,
    weight DECIMAL(5,2) DEFAULT 100.00, -- Weight of this CLO in assessment
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(assessment_id, clo_id)
);

CREATE INDEX idx_assessment_clos_assessment_id ON assessment_clos(assessment_id);
CREATE INDEX idx_assessment_clos_clo_id ON assessment_clos(clo_id);

-- Results table
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assessment_id INTEGER NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    clo_id INTEGER NOT NULL REFERENCES clos(id),
    score DECIMAL(10,2) NOT NULL,
    max_score DECIMAL(10,2) NOT NULL,
    percentage DECIMAL(5,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, assessment_id, clo_id)
);

CREATE INDEX idx_results_student_id ON results(student_id);
CREATE INDEX idx_results_assessment_id ON results(assessment_id);
CREATE INDEX idx_results_clo_id ON results(clo_id);
CREATE INDEX idx_results_student_assessment ON results(student_id, assessment_id);

-- Feedback table
CREATE TABLE feedback (
    id SERIAL PRIMARY KEY,
    result_id INTEGER NOT NULL REFERENCES results(id) ON DELETE CASCADE,
    comment TEXT NOT NULL,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_feedback_result_id ON feedback(result_id);
CREATE INDEX idx_feedback_created_by ON feedback(created_by);

-- OTPs table
CREATE TABLE otps (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(128) NOT NULL,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_otps_email_code ON otps(email, code);
CREATE INDEX idx_otps_expires_at ON otps(expires_at);
CREATE INDEX idx_otps_user_id ON otps(user_id) WHERE user_id IS NOT NULL;

-- OAuth tokens table
CREATE TABLE oauth_tokens (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50) DEFAULT 'google',
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, provider)
);

CREATE INDEX idx_oauth_tokens_user_id ON oauth_tokens(user_id);
CREATE INDEX idx_oauth_tokens_expires_at ON oauth_tokens(expires_at);

