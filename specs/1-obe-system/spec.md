# Feature Specification: OBE System Complete Specification

**Feature Branch**: `1-obe-system`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Based on the established constitution for the Outcome-Based Education (OBE) System project, specify the entire project structure, modules, and detailed functional and technical requirements."

## Project Overview

### System Purpose

The Outcome-Based Education (OBE) Management System is a comprehensive full-stack application designed to manage and track educational outcomes, assessments, and student progress in an outcome-based education framework. The system enables institutions to define Program Learning Outcomes (PLOs), Course Learning Outcomes (CLOs), map relationships between them, conduct assessments, and generate reports on student achievement.

### System Roles

The system supports three primary user roles with distinct access levels:

- **Admin**: Full system access including user management, course configuration, outcome definitions, mapping management, and system-wide analytics
- **Teacher**: Access to assigned courses, student management, assessment creation and grading, result entry, and course-level reports
- **Student**: Access to personal profile, enrolled courses, assessment results, grades, feedback, and progress reports

---

## User Scenarios & Testing

### User Story 1 - User Authentication and Registration (Priority: P1)

A user must be able to securely authenticate into the system using multiple methods (JWT with credentials, Google OAuth, or Email OTP) and access role-appropriate dashboards based on their assigned role.

**Why this priority**: Authentication is the foundation for all system functionality. Without secure, role-based access, no other features can be safely delivered.

**Independent Test**: Can be fully tested by implementing login flows for all three authentication methods and verifying users are redirected to appropriate dashboards based on their role. Delivers value by enabling secure system access.

**Acceptance Scenarios**:

1. **Given** a user with valid email and password, **When** they submit credentials, **Then** they receive a JWT token and are redirected to their role-specific dashboard
2. **Given** a user wants to login with Google, **When** they click "Login with Google" and complete OAuth flow, **Then** they are authenticated and redirected to their dashboard
3. **Given** a user requests email OTP, **When** they enter their email and receive/enter OTP, **Then** they are authenticated and can access the system
4. **Given** an unregistered user, **When** they complete registration, **Then** they are assigned a default role and can login
5. **Given** a user with invalid credentials, **When** they attempt login, **Then** they receive an appropriate error message without revealing which field is incorrect

---

### User Story 2 - Admin User and Course Management (Priority: P1)

An admin must be able to create, view, update, and delete users (assigning roles), and manage courses including creating courses, assigning teachers, and configuring course details.

**Why this priority**: Core administrative functionality required for system setup and ongoing management. Essential for populating the system with users and course data.

**Independent Test**: Can be fully tested by creating users with different roles, creating courses, and assigning teachers to courses. Delivers value by enabling system configuration and user management.

**Acceptance Scenarios**:

1. **Given** an admin is logged in, **When** they create a new user with role assignment, **Then** the user is created and can login with assigned permissions
2. **Given** an admin views the user list, **When** they filter by role, **Then** they see only users with that role
3. **Given** an admin creates a new course, **When** they assign teachers and set course details, **Then** the course appears in teacher dashboards and is available for enrollment
4. **Given** an admin updates a user's role, **When** they save changes, **Then** the user's dashboard and permissions update immediately

---

### User Story 3 - Outcome Definition and Mapping (Priority: P2)

An admin must be able to define Program Learning Outcomes (PLOs) and Course Learning Outcomes (CLOs), and create mappings between courses and their CLOs, and between CLOs and PLOs to track how course outcomes contribute to program outcomes.

**Why this priority**: Core OBE functionality that defines the educational framework. Necessary before assessments and results can be meaningful.

**Independent Test**: Can be fully tested by creating PLOs, creating CLOs for courses, and mapping CLOs to PLOs. Delivers value by establishing the outcome structure.

**Acceptance Scenarios**:

1. **Given** an admin is managing outcomes, **When** they create a new PLO with description, **Then** it appears in the PLO list and can be mapped to courses
2. **Given** an admin creates CLOs for a course, **When** they define multiple CLOs with descriptions, **Then** all CLOs are associated with that course
3. **Given** an admin maps a CLO to a PLO, **When** they set the mapping strength/relationship, **Then** the mapping is saved and appears in reports
4. **Given** a teacher views a course, **When** they check outcomes, **Then** they see all CLOs defined for that course

---

### User Story 4 - Assessment Creation and Management (Priority: P2)

A teacher must be able to create assessments (quizzes, assignments, exams) for their courses, link them to specific CLOs, set weights, and configure assessment details.

**Why this priority**: Enables teachers to evaluate student progress against course outcomes. Required for the assessment-results-feedback cycle.

**Independent Test**: Can be fully tested by creating assessments with CLO mappings and weights. Delivers value by enabling outcome-based evaluation.

**Acceptance Scenarios**:

1. **Given** a teacher views their course, **When** they create a new assessment linked to CLOs, **Then** the assessment is saved and visible to students enrolled in that course
2. **Given** a teacher sets assessment weights, **When** they configure multiple assessments, **Then** total weight calculation is validated and displayed
3. **Given** a teacher updates an assessment, **When** they modify CLO mappings, **Then** existing results remain valid but future entries reflect new mappings

---

### User Story 5 - Result Entry and Feedback (Priority: P2)

A teacher must be able to enter student assessment results, link scores to specific CLOs, calculate outcome achievement, and provide feedback to students.

**Why this priority**: Core functionality for tracking student progress against outcomes. Required for generating meaningful reports.

**Independent Test**: Can be fully tested by entering results for assessments and verifying calculations and feedback delivery. Delivers value by enabling outcome tracking and student communication.

**Acceptance Scenarios**:

1. **Given** a teacher has an assessment with student submissions, **When** they enter scores linked to CLOs, **Then** outcome achievement is calculated automatically
2. **Given** a teacher provides feedback, **When** they save feedback for a student result, **Then** the student can view the feedback in their dashboard
3. **Given** a teacher enters results, **When** they bulk upload or enter individually, **Then** all results are validated and saved correctly

---

### User Story 6 - Student Course Enrollment and Progress View (Priority: P2)

A student must be able to view their enrolled courses, see assessment details, view their results and grades, and track their progress against course outcomes.

**Why this priority**: Primary student-facing functionality. Enables students to understand their progress and outcomes achievement.

**Independent Test**: Can be fully tested by enrolling a student in courses and verifying they can view all course information and results. Delivers value by providing student self-service access to educational data.

**Acceptance Scenarios**:

1. **Given** a student is enrolled in courses, **When** they view their dashboard, **Then** they see all enrolled courses with current grades and progress
2. **Given** a student views a course, **When** they check assessments, **Then** they see all assessments with due dates and their scores
3. **Given** a student views their results, **When** they check outcome achievement, **Then** they see progress against each CLO with visual indicators
4. **Given** a student receives feedback, **When** they view a result, **Then** they can see teacher feedback and recommendations

---

### User Story 7 - Analytics and Reporting (Priority: P3)

Admins and teachers must be able to generate reports showing student progress, outcome achievement, course performance, and program-level analytics.

**Why this priority**: Provides insights for decision-making and continuous improvement. Important but not critical for initial system operation.

**Independent Test**: Can be fully tested by generating various reports and verifying data accuracy and visualization. Delivers value by enabling data-driven educational decisions.

**Acceptance Scenarios**:

1. **Given** an admin requests a program-level report, **When** they select date range and filters, **Then** they receive aggregated PLO achievement data
2. **Given** a teacher views course analytics, **When** they check student performance, **Then** they see outcome achievement rates and identify students needing support
3. **Given** a user exports a report, **When** they select format (PDF/Excel), **Then** they receive a formatted document with all requested data

---

### Edge Cases

- What happens when a user tries to access a route they don't have permission for? System should redirect to appropriate dashboard with error message
- How does system handle expired JWT tokens? Automatically attempt refresh, redirect to login if refresh fails
- What happens when OTP expires before use? User must request new OTP, old OTP is invalidated
- How does system handle concurrent assessment result updates? Use database transactions and optimistic locking where needed
- What happens when a course is deleted with existing results? System uses soft-delete (marks course as deleted with `deleted_at` timestamp) to preserve historical data for reporting. Course appears inactive but all related results, assessments, and mappings remain accessible.
- How does system handle Google OAuth callback failures? Display error message and allow retry or fallback to email/password
- What happens when assessment weights exceed 100%? System should validate and prevent saving with clear error message
- How does system handle bulk user import with duplicate emails? Validate before import, reject duplicates, provide detailed error report

---

## Requirements

### Functional Requirements

#### Authentication Module

- **FR-001**: System MUST allow users to authenticate using email and password with JWT token generation
- **FR-002**: System MUST support Google OAuth2 authentication flow with proper token storage
- **FR-003**: System MUST support email-based OTP authentication with time-limited OTP codes (5-10 minute expiry)
- **FR-004**: System MUST hash all passwords using bcrypt before storage
- **FR-005**: System MUST generate and validate JWT tokens with appropriate expiry times
- **FR-006**: System MUST implement refresh token mechanism for session management
- **FR-007**: System MUST invalidate OTP codes after successful use or expiry
- **FR-008**: System MUST store OAuth tokens securely with expiry timestamps
- **FR-009**: System MUST redirect authenticated users to role-appropriate dashboards

#### Role-Based Access Control (RBAC)

- **FR-010**: System MUST enforce role-based access control on all API endpoints
- **FR-011**: System MUST enforce role-based UI rendering on all frontend routes
- **FR-012**: System MUST support three roles: Admin, Teacher, Student
- **FR-013**: Admin role MUST have full access to all system modules
- **FR-014**: Teacher role MUST have access only to assigned courses and related data
- **FR-015**: Student role MUST have access only to personal data and enrolled courses
- **FR-016**: System MUST validate user permissions before processing any request
- **FR-017**: System MUST log all unauthorized access attempts

#### User Management

- **FR-018**: Admin MUST be able to create, read, update, and delete users
- **FR-019**: Admin MUST be able to assign and modify user roles
- **FR-020**: System MUST validate email uniqueness during user creation
- **FR-021**: System MUST allow users to update their own profile information
- **FR-022**: System MUST display user list with filtering by role and search functionality
- **FR-023**: System MUST support bulk user import with validation

#### Course Management

- **FR-024**: Admin MUST be able to create, update, and delete courses
- **FR-024a**: System MUST use soft-delete for courses (mark as deleted with timestamp) to preserve historical data
- **FR-025**: Admin MUST be able to assign teachers to courses
- **FR-026**: System MUST allow multiple teachers per course
- **FR-027**: System MUST track course enrollment for students
- **FR-028**: System MUST display course list with filtering and search
- **FR-029**: Teachers MUST see only courses assigned to them
- **FR-030**: Students MUST see only courses they are enrolled in

#### Program Outcomes (PO/PLO)

- **FR-031**: Admin MUST be able to create, update, and delete Program Learning Outcomes (PLOs)
- **FR-032**: System MUST store PLO descriptions and codes
- **FR-033**: System MUST allow multiple PLOs per program
- **FR-034**: System MUST display PLO list with search functionality

#### Course Outcomes (CO/CLO)

- **FR-035**: Admin and assigned teachers MUST be able to create Course Learning Outcomes (CLOs) for courses
- **FR-036**: System MUST store CLO descriptions and codes
- **FR-037**: System MUST allow multiple CLOs per course
- **FR-038**: System MUST link CLOs to specific courses
- **FR-039**: System MUST display CLOs for each course

#### CO-PO Mapping

- **FR-040**: Admin MUST be able to create mappings between CLOs and PLOs
- **FR-041**: System MUST support mapping strength indicators (e.g., Strong, Moderate, Weak)
- **FR-042**: System MUST allow one CLO to map to multiple PLOs
- **FR-043**: System MUST allow one PLO to be mapped by multiple CLOs
- **FR-044**: System MUST validate mapping relationships and prevent circular dependencies
- **FR-045**: System MUST display mapping visualizations

#### Assessment Management

- **FR-046**: Teachers MUST be able to create assessments for their courses
- **FR-047**: Teachers MUST be able to link assessments to specific CLOs
- **FR-048**: System MUST support assessment types (quiz, assignment, exam, project)
- **FR-049**: System MUST allow setting assessment weights
- **FR-050**: System MUST validate that assessment weights for a course do not exceed 100%
- **FR-051**: System MUST support due dates and schedules for assessments
- **FR-052**: Students MUST be able to view assessments for enrolled courses

#### Student Management

- **FR-053**: Teachers MUST be able to view students enrolled in their courses
- **FR-054**: System MUST display student list with filtering and search
- **FR-055**: Admin MUST be able to enroll students in courses
- **FR-056**: System MUST track student enrollment status

#### Results & Feedback

- **FR-057**: Teachers MUST be able to enter assessment results for students
- **FR-058**: System MUST link results to specific CLOs
- **FR-059**: System MUST calculate outcome achievement based on assessment scores
- **FR-060**: System MUST support bulk result entry
- **FR-061**: Teachers MUST be able to provide feedback on student results
- **FR-062**: Students MUST be able to view their results and feedback
- **FR-063**: System MUST calculate course grades based on assessment weights and scores
- **FR-064**: System MUST generate progress reports for students

#### Analytics & Reporting

- **FR-065**: Admins MUST be able to generate program-level outcome reports
- **FR-066**: Teachers MUST be able to generate course-level reports
- **FR-067**: System MUST support report filtering by date range, course, student, outcome
- **FR-068**: System MUST calculate outcome achievement percentages
- **FR-069**: System MUST support report export in multiple formats (PDF, Excel)
- **FR-070**: System MUST provide visual charts and graphs for analytics

#### Security & Performance

- **FR-071**: System MUST implement rate limiting on authentication endpoints
- **FR-072**: System MUST validate and sanitize all user inputs
- **FR-073**: System MUST use parameterized SQL queries to prevent injection
- **FR-074**: System MUST implement CORS policies appropriately
- **FR-075**: System MUST support pagination for large data sets
- **FR-076**: System MUST implement database indexing for performance
- **FR-077**: System MUST log all critical operations for audit trails

### Key Entities

- **User**: Represents system users (admins, teachers, students) with authentication credentials, role assignments, and profile information. Relationships: belongs to role(s), enrolled in courses, has results

- **Role**: Defines user permissions (Admin, Teacher, Student). Relationships: has many users, has many permissions

- **Permission**: Defines specific system capabilities. Relationships: belongs to role(s) through role_permissions

- **Course**: Represents academic courses with details, assigned teachers, and enrolled students. Relationships: has many CLOs, has many teachers, has many enrollments, has many assessments

- **Program Learning Outcome (PLO)**: Represents program-level educational outcomes. Relationships: mapped by many CLOs through co_po_mappings

- **Course Learning Outcome (CLO)**: Represents course-level educational outcomes. Relationships: belongs to course, maps to many PLOs through co_po_mappings, assessed by many assessments

- **Assessment**: Represents evaluations (quizzes, assignments, exams) with weights and due dates. Relationships: belongs to course, linked to CLOs, has many results

- **Enrollment**: Links students to courses. Relationships: belongs to student, belongs to course

- **Result**: Represents student assessment scores linked to CLOs. Relationships: belongs to student, belongs to assessment, linked to CLOs

- **Feedback**: Represents teacher comments on student results. Relationships: belongs to result

- **OTP**: Temporary authentication codes with expiry. Relationships: belongs to user

- **OAuth Token**: Google OAuth tokens with expiry. Relationships: belongs to user

---

## Success Criteria

### Measurable Outcomes

- **SC-001**: Users can complete authentication (any method) and access their dashboard within 30 seconds
- **SC-002**: System supports 1000 concurrent authenticated users without performance degradation
- **SC-003**: 95% of users successfully complete authentication on first attempt
- **SC-004**: Admins can create a new user and assign role in under 2 minutes
- **SC-005**: Teachers can create an assessment with CLO mappings in under 5 minutes
- **SC-006**: Students can view all their course results and feedback in under 3 seconds
- **SC-007**: System processes bulk result entry (100 records) in under 10 seconds
- **SC-008**: Reports generate for datasets up to 10,000 records in under 15 seconds
- **SC-009**: 90% of API endpoints respond within 500ms under normal load
- **SC-010**: System maintains 99.5% uptime during business hours
- **SC-011**: All critical operations are logged and traceable within 1 second
- **SC-012**: 98% of role-based access restrictions are correctly enforced

---

## Technical Architecture

### Backend Specification (FastAPI + PostgreSQL)

#### Folder Structure

```
obebackend/
├── src/
│   └── obebackend/
│       ├── __init__.py
│       ├── main.py                 # FastAPI app entry point
│       ├── config.py               # Configuration and environment variables
│       ├── database/
│       │   ├── __init__.py
│       │   ├── connection.py       # PostgreSQL connection pool
│       │   └── queries/            # Raw SQL queries organized by module
│       │       ├── __init__.py
│       │       ├── auth_queries.py
│       │       ├── user_queries.py
│       │       ├── course_queries.py
│       │       ├── outcome_queries.py
│       │       ├── assessment_queries.py
│       │       ├── result_queries.py
│       │       └── analytics_queries.py
│       ├── routes/
│       │   ├── __init__.py
│       │   ├── auth.py            # Authentication endpoints
│       │   ├── users.py           # User management endpoints
│       │   ├── courses.py         # Course management endpoints
│       │   ├── outcomes.py        # PLO/CLO endpoints
│       │   ├── mappings.py        # CO-PO mapping endpoints
│       │   ├── assessments.py     # Assessment endpoints
│       │   ├── results.py         # Result entry endpoints
│       │   └── analytics.py       # Reporting endpoints
│       ├── controllers/
│       │   ├── __init__.py
│       │   ├── auth_controller.py
│       │   ├── user_controller.py
│       │   ├── course_controller.py
│       │   ├── outcome_controller.py
│       │   ├── assessment_controller.py
│       │   ├── result_controller.py
│       │   └── analytics_controller.py
│       ├── schemas/
│       │   ├── __init__.py
│       │   ├── auth_schemas.py    # Pydantic models for auth
│       │   ├── user_schemas.py
│       │   ├── course_schemas.py
│       │   ├── outcome_schemas.py
│       │   ├── assessment_schemas.py
│       │   ├── result_schemas.py
│       │   └── common_schemas.py   # Common response models
│       ├── middleware/
│       │   ├── __init__.py
│       │   ├── auth_middleware.py  # JWT validation
│       │   ├── rbac_middleware.py  # Role-based access control
│       │   └── error_handler.py    # Global exception handling
│       ├── utils/
│       │   ├── __init__.py
│       │   ├── security.py         # Password hashing, JWT utils
│       │   ├── oauth.py            # Google OAuth handling
│       │   ├── otp.py              # OTP generation and validation
│       │   ├── email.py            # Email sending utilities
│       │   └── validators.py       # Input validation helpers
│       └── tests/
│           ├── __init__.py
│           ├── test_auth.py
│           ├── test_users.py
│           ├── test_courses.py
│           └── test_integration.py
├── requirements.txt
├── pyproject.toml
└── README.md
```

#### Database Schema (PostgreSQL Raw SQL)

**Tables and Relationships:**

1. **users** (1-to-many with roles, 1-to-many with enrollments, 1-to-many with results)
   - Primary Key: `id` (SERIAL)
   - Foreign Keys: `role_id` → `roles.id`
   - Indexes: `email` (UNIQUE), `role_id`

2. **roles** (1-to-many with users, many-to-many with permissions)
   - Primary Key: `id` (SERIAL)
   - Indexes: `name` (UNIQUE)

3. **permissions** (many-to-many with roles)
   - Primary Key: `id` (SERIAL)
   - Indexes: `name` (UNIQUE)

4. **role_permissions** (junction table for many-to-many)
   - Primary Key: `id` (SERIAL)
   - Foreign Keys: `role_id` → `roles.id`, `permission_id` → `permissions.id`
   - Unique Constraint: `(role_id, permission_id)`

5. **courses** (1-to-many with CLOs, 1-to-many with enrollments, 1-to-many with assessments)
   - Primary Key: `id` (SERIAL)
   - Indexes: `code` (UNIQUE)

6. **course_teachers** (junction table for many-to-many: courses ↔ users/teachers)
   - Primary Key: `id` (SERIAL)
   - Foreign Keys: `course_id` → `courses.id`, `teacher_id` → `users.id`
   - Unique Constraint: `(course_id, teacher_id)`

7. **plos** (Program Learning Outcomes)
   - Primary Key: `id` (SERIAL)
   - Indexes: `code` (UNIQUE)

8. **clos** (Course Learning Outcomes)
   - Primary Key: `id` (SERIAL)
   - Foreign Keys: `course_id` → `courses.id`
   - Indexes: `(course_id, code)` (UNIQUE)

9. **co_po_mappings** (many-to-many: CLOs ↔ PLOs)
   - Primary Key: `id` (SERIAL)
   - Foreign Keys: `clo_id` → `clos.id`, `plo_id` → `plos.id`
   - Unique Constraint: `(clo_id, plo_id)`

10. **enrollments** (junction table: students ↔ courses)
    - Primary Key: `id` (SERIAL)
    - Foreign Keys: `student_id` → `users.id`, `course_id` → `courses.id`
    - Unique Constraint: `(student_id, course_id)`

11. **assessments**
    - Primary Key: `id` (SERIAL)
    - Foreign Keys: `course_id` → `courses.id`
    - Indexes: `course_id`

12. **assessment_clos** (junction table: assessments ↔ CLOs)
    - Primary Key: `id` (SERIAL)
    - Foreign Keys: `assessment_id` → `assessments.id`, `clo_id` → `clos.id`
    - Unique Constraint: `(assessment_id, clo_id)`

13. **results**
    - Primary Key: `id` (SERIAL)
    - Foreign Keys: `student_id` → `users.id`, `assessment_id` → `assessments.id`, `clo_id` → `clos.id`
    - Indexes: `(student_id, assessment_id, clo_id)` (UNIQUE)

14. **feedback**
    - Primary Key: `id` (SERIAL)
    - Foreign Keys: `result_id` → `results.id`
    - Indexes: `result_id`

15. **otps**
    - Primary Key: `id` (SERIAL)
    - Foreign Keys: `user_id` → `users.id`
    - Indexes: `(user_id, code)`, `expires_at`

16. **oauth_tokens**
    - Primary Key: `id` (SERIAL)
    - Foreign Keys: `user_id` → `users.id`
    - Indexes: `user_id`, `expires_at`

#### Detailed SQL Schema

```sql
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
    code VARCHAR(10) NOT NULL,
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
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_oauth_tokens_user_id ON oauth_tokens(user_id);
CREATE INDEX idx_oauth_tokens_expires_at ON oauth_tokens(expires_at);
```

#### API Endpoints Structure

**Authentication Routes (`/api/auth`)**
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Email/password login (JWT)
- `POST /api/auth/google` - Google OAuth callback
- `POST /api/auth/otp/request` - Request OTP code
- `POST /api/auth/otp/verify` - Verify OTP and login
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout (invalidate token)

**User Management Routes (`/api/users`)**
- `GET /api/users` - List users (Admin only)
- `GET /api/users/{id}` - Get user details
- `POST /api/users` - Create user (Admin only)
- `PUT /api/users/{id}` - Update user (Admin or self)
- `DELETE /api/users/{id}` - Delete user (Admin only)
- `GET /api/users/{id}/profile` - Get own profile

**Course Management Routes (`/api/courses`)**
- `GET /api/courses` - List courses (role-based filtering)
- `GET /api/courses/{id}` - Get course details
- `POST /api/courses` - Create course (Admin only)
- `PUT /api/courses/{id}` - Update course (Admin only)
- `DELETE /api/courses/{id}` - Delete course (Admin only)
- `POST /api/courses/{id}/teachers` - Assign teacher (Admin only)
- `GET /api/courses/{id}/students` - List enrolled students

**Outcome Routes (`/api/outcomes`)**
- `GET /api/plos` - List PLOs
- `POST /api/plos` - Create PLO (Admin only)
- `PUT /api/plos/{id}` - Update PLO (Admin only)
- `DELETE /api/plos/{id}` - Delete PLO (Admin only)
- `GET /api/courses/{id}/clos` - Get CLOs for course
- `POST /api/courses/{id}/clos` - Create CLO (Admin/Teacher)
- `PUT /api/clos/{id}` - Update CLO (Admin/Teacher)
- `DELETE /api/clos/{id}` - Delete CLO (Admin only)

**Mapping Routes (`/api/mappings`)**
- `GET /api/mappings` - List CO-PO mappings
- `POST /api/mappings` - Create mapping (Admin only)
- `PUT /api/mappings/{id}` - Update mapping (Admin only)
- `DELETE /api/mappings/{id}` - Delete mapping (Admin only)
- `GET /api/courses/{id}/mappings` - Get mappings for course

**Assessment Routes (`/api/assessments`)**
- `GET /api/courses/{id}/assessments` - List assessments for course
- `GET /api/assessments/{id}` - Get assessment details
- `POST /api/assessments` - Create assessment (Teacher)
- `PUT /api/assessments/{id}` - Update assessment (Teacher)
- `DELETE /api/assessments/{id}` - Delete assessment (Teacher)

**Result Routes (`/api/results`)**
- `GET /api/assessments/{id}/results` - Get results for assessment (Teacher)
- `GET /api/students/{id}/results` - Get student results (Teacher/Student)
- `POST /api/results` - Create result entry (Teacher)
- `POST /api/results/bulk` - Bulk result entry (Teacher)
- `PUT /api/results/{id}` - Update result (Teacher)
- `POST /api/results/{id}/feedback` - Add feedback (Teacher)

**Analytics Routes (`/api/analytics`)**
- `GET /api/analytics/course/{id}` - Course analytics (Teacher/Admin)
- `GET /api/analytics/program` - Program-level analytics (Admin)
- `GET /api/analytics/student/{id}` - Student progress (Student/Teacher)
- `GET /api/analytics/outcomes/{id}` - Outcome achievement analytics

#### Security Implementation Details

**JWT Authentication:**
- Token payload includes: user_id, email, role_id, permissions
- Access token expiry: 15 minutes
- Refresh token expiry: 7 days
- Token stored in HTTP-only cookies or Authorization header

**Password Hashing:**
- Use bcrypt with salt rounds: 12
- Never store or log plaintext passwords

**OTP Handling:**
- Generate 6-digit numeric codes
- Store hashed OTP codes
- Expiry: 10 minutes
- Single-use: invalidate after successful verification
- Rate limit: 3 requests per email per 15 minutes

**OAuth Flow:**
- Use Google OAuth2 authorization code flow
- Store access and refresh tokens securely
- Validate token expiry before use
- Handle token refresh automatically

**RBAC Middleware:**
- Check JWT token validity
- Verify user role and permissions
- Compare required permissions with user permissions
- Return 403 for unauthorized access

#### Error Handling

- All endpoints return structured JSON responses
- Standard HTTP status codes (200, 201, 400, 401, 403, 404, 500)
- Error response format: `{"error": "message", "code": "ERROR_CODE", "details": {}}`
- Global exception handler catches all unhandled exceptions
- Validation errors return 400 with field-specific messages
- Database errors are logged but return generic messages to clients

---

### Frontend Specification (React.js)

#### Folder Structure

```
obefrontend/
├── public/
│   └── index.html
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Table.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Form.jsx
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Loading.jsx
│   │   │   └── ErrorMessage.jsx
│   │   ├── auth/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── OTPForm.jsx
│   │   │   └── GoogleOAuthButton.jsx
│   │   └── dashboard/
│   │       ├── AdminDashboard.jsx
│   │       ├── TeacherDashboard.jsx
│   │       └── StudentDashboard.jsx
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── ForgotPassword.jsx
│   │   ├── admin/
│   │   │   ├── Users.jsx
│   │   │   ├── Courses.jsx
│   │   │   ├── Outcomes.jsx
│   │   │   ├── Mappings.jsx
│   │   │   └── Analytics.jsx
│   │   ├── teacher/
│   │   │   ├── Courses.jsx
│   │   │   ├── Assessments.jsx
│   │   │   ├── Students.jsx
│   │   │   ├── Results.jsx
│   │   │   └── Reports.jsx
│   │   └── student/
│   │       ├── Profile.jsx
│   │       ├── Courses.jsx
│   │       ├── Results.jsx
│   │       └── Progress.jsx
│   ├── contexts/
│   │   ├── AuthContext.jsx       # Global auth state
│   │   └── UserContext.jsx        # User profile and permissions
│   ├── services/
│   │   ├── api.js                 # Axios instance with interceptors
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── courseService.js
│   │   ├── outcomeService.js
│   │   ├── assessmentService.js
│   │   ├── resultService.js
│   │   └── analyticsService.js
│   ├── utils/
│   │   ├── constants.js           # Role constants, API endpoints
│   │   ├── validators.js          # Form validation
│   │   ├── formatters.js          # Date, number formatting
│   │   └── helpers.js             # Common utility functions
│   ├── hooks/
│   │   ├── useAuth.js
│   │   ├── useRole.js
│   │   └── useProtectedRoute.js
│   └── styles/
│       ├── variables.css          # CSS variables
│       ├── components.css
│       └── responsive.css
├── package.json
├── vite.config.js
└── README.md
```

#### Context API Usage

**AuthContext:**
- Stores: current user, JWT token, refresh token, isAuthenticated flag
- Provides: login, logout, register, refreshToken functions
- Persists auth state in localStorage
- Auto-refreshes tokens before expiry

**UserContext:**
- Stores: user profile, role, permissions
- Provides: user data access throughout app
- Updates when user profile changes

#### Axios Instance Setup

```javascript
// services/api.js
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios.post('/api/auth/refresh', {
          refresh_token: refreshToken,
        });
        
        const { access_token } = response.data;
        localStorage.setItem('accessToken', access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
```

#### Page Structure

**Authentication Pages:**
- Login: Email/password, Google OAuth, OTP options
- Register: User registration form with role assignment (if admin)
- Forgot Password: OTP-based password reset

**Admin Dashboard Pages:**
- Users: CRUD operations, role assignment, filtering
- Courses: CRUD operations, teacher assignment
- Outcomes: PLO/CLO management
- Mappings: CO-PO mapping interface with visualization
- Analytics: Program-level reports and charts

**Teacher Dashboard Pages:**
- Courses: List of assigned courses
- Assessments: Create and manage assessments
- Students: View enrolled students per course
- Results: Enter and update assessment results
- Reports: Course-level analytics

**Student Dashboard Pages:**
- Profile: View and edit personal information
- Courses: List enrolled courses with progress
- Results: View assessment results and feedback
- Progress: Outcome achievement visualization

#### Protected Routes

```javascript
// hooks/useProtectedRoute.js
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={`/${user.role.toLowerCase()}/dashboard`} />;
  }
  
  return children;
};

export default ProtectedRoute;
```

#### Responsive Design Principles

**Breakpoints:**
- Mobile: < 768px (single column, stacked layouts)
- Tablet: 768px - 1024px (two columns, adjusted spacing)
- Desktop: > 1024px (full multi-column layouts)

**Design Guidelines:**
- Mobile-first CSS approach
- Touch-friendly buttons (min 44x44px)
- Responsive tables (scroll or card view on mobile)
- Collapsible sidebar on mobile
- Flexible grid layouts
- Readable typography (min 16px base font)

---

## Testing & Deployment

### Testing Strategy

**Unit Tests:**
- Backend: Test all controllers, utilities, and SQL query functions
- Frontend: Test components, hooks, and utility functions
- Coverage target: 70%+ for critical paths

**Integration Tests:**
- Authentication flows (JWT, OAuth, OTP)
- RBAC enforcement on all endpoints
- Database operations with test database
- API endpoint integration

**Manual Testing:**
- All three dashboards (Admin, Teacher, Student)
- Complete user journeys for each role
- Cross-browser compatibility
- Mobile responsiveness

### Local Development Setup

**Backend:**
```bash
cd obebackend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
# Set environment variables
export DATABASE_URL=postgresql://user:pass@localhost/obe_db
export JWT_SECRET=your-secret-key
export GOOGLE_CLIENT_ID=your-google-client-id
export GOOGLE_CLIENT_SECRET=your-google-client-secret
uvicorn src.obebackend.main:app --reload
```

**Frontend:**
```bash
cd obefrontend
npm install
# Set environment variables
export VITE_API_BASE_URL=http://localhost:8000
npm run dev
```

**Database:**
```bash
# Create database
createdb obe_db
# Run migrations/schema
psql obe_db < schema.sql
```

### Deployment Suggestions

**Option 1: Docker**
- Docker Compose for local development
- Separate containers for backend, frontend, and PostgreSQL
- Environment-based configuration

**Option 2: Railway/Render**
- Deploy backend as FastAPI service
- Deploy frontend as static site
- Use managed PostgreSQL service
- Environment variables via platform config

**Option 3: Traditional VPS**
- Nginx reverse proxy
- PM2 for backend process management
- PostgreSQL on same server or managed service
- SSL certificates via Let's Encrypt

---

## Assumptions

- Institution uses email-based user identification
- All users have valid email addresses
- Google OAuth is available and configured
- Email service is configured for OTP delivery
- Assessment weights are percentages (0-100)
- Results are entered after assessments are completed
- One course can have multiple CLOs
- One CLO can map to multiple PLOs
- Historical data retention policy: Course and result data are retained for 7 years after course completion or deletion, aligning with standard academic record retention policies. After 7 years, data may be archived or purged based on institutional policy.

---

**End of Specification**

