# Data Model: OBE System

**Date**: 2025-01-27  
**Feature**: OBE System Complete Specification  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the data model for the OBE System, including all entities, their attributes, relationships, validation rules, and state transitions. The model is implemented in PostgreSQL using raw SQL.

---

## Entity Definitions

### User

**Purpose**: Represents system users (admins, teachers, students) with authentication credentials and profile information.

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique user identifier
- `email` (VARCHAR(255), UNIQUE, NOT NULL): User email address (used for login)
- `password_hash` (VARCHAR(255), NULLABLE): Bcrypt-hashed password (NULL for OAuth-only users)
- `first_name` (VARCHAR(100), NOT NULL): User's first name
- `last_name` (VARCHAR(100), NOT NULL): User's last name
- `role_id` (INTEGER, NOT NULL, FOREIGN KEY → roles.id): User's role (Admin, Teacher, Student)
- `is_active` (BOOLEAN, DEFAULT TRUE): Account active status
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Account creation timestamp
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Last update timestamp

**Relationships**:
- **1-to-many** with `roles` (via `role_id`)
- **1-to-many** with `enrollments` (as student)
- **1-to-many** with `results` (as student)
- **1-to-many** with `course_teachers` (as teacher)
- **1-to-many** with `otps`
- **1-to-many** with `oauth_tokens`
- **1-to-many** with `feedback` (as creator)

**Validation Rules**:
- Email must be unique across all users
- Email must be valid format (regex validation)
- Password (if provided) must be at least 8 characters
- First name and last name cannot be empty
- Role must exist in roles table

**State Transitions**:
- `is_active`: TRUE → FALSE (deactivation by admin)
- `is_active`: FALSE → TRUE (reactivation by admin)
- `role_id`: Can be changed by admin (triggers permission recalculation)

**Indexes**:
- `idx_users_email` (UNIQUE): Fast email lookup for authentication
- `idx_users_role_id`: Fast role-based queries

---

### Role

**Purpose**: Defines user permission groups (Admin, Teacher, Student).

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique role identifier
- `name` (VARCHAR(50), UNIQUE, NOT NULL): Role name (e.g., "Admin", "Teacher", "Student")
- `description` (TEXT, NULLABLE): Role description
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Role creation timestamp

**Relationships**:
- **1-to-many** with `users` (via `role_id`)
- **many-to-many** with `permissions` (via `role_permissions`)

**Validation Rules**:
- Name must be unique
- Name cannot be empty

**State Transitions**: None (roles are static, created during system initialization)

**Indexes**:
- `idx_roles_name` (UNIQUE): Fast role lookup

---

### Permission

**Purpose**: Defines specific system capabilities that can be assigned to roles.

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique permission identifier
- `name` (VARCHAR(100), UNIQUE, NOT NULL): Permission name (e.g., "users.create", "courses.view")
- `description` (TEXT, NULLABLE): Permission description
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Permission creation timestamp

**Relationships**:
- **many-to-many** with `roles` (via `role_permissions`)

**Validation Rules**:
- Name must be unique
- Name should follow pattern: `resource.action` (e.g., "users.create", "courses.view")

**State Transitions**: None (permissions are static, created during system initialization)

**Indexes**:
- `idx_permissions_name` (UNIQUE): Fast permission lookup

---

### RolePermission (Junction Table)

**Purpose**: Links roles to permissions (many-to-many relationship).

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique relationship identifier
- `role_id` (INTEGER, NOT NULL, FOREIGN KEY → roles.id): Role identifier
- `permission_id` (INTEGER, NOT NULL, FOREIGN KEY → permissions.id): Permission identifier
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Relationship creation timestamp

**Relationships**:
- **many-to-1** with `roles` (via `role_id`)
- **many-to-1** with `permissions` (via `permission_id`)

**Validation Rules**:
- Combination of `role_id` and `permission_id` must be unique
- Both role and permission must exist

**State Transitions**: None (static relationships)

**Indexes**:
- `idx_role_permissions_role_id`: Fast permission lookup by role
- `idx_role_permissions_permission_id`: Fast role lookup by permission
- UNIQUE constraint on `(role_id, permission_id)`

---

### Course

**Purpose**: Represents academic courses with details, assigned teachers, and enrolled students.

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique course identifier
- `code` (VARCHAR(50), UNIQUE, NOT NULL): Course code (e.g., "CS101")
- `name` (VARCHAR(200), NOT NULL): Course name
- `description` (TEXT, NULLABLE): Course description
- `credits` (INTEGER, NULLABLE): Course credit hours
- `deleted_at` (TIMESTAMP, NULLABLE): Soft delete timestamp (NULL = active)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Course creation timestamp
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Last update timestamp

**Relationships**:
- **1-to-many** with `clos` (Course Learning Outcomes)
- **1-to-many** with `enrollments` (student enrollments)
- **1-to-many** with `assessments`
- **many-to-many** with `users` as teachers (via `course_teachers`)

**Validation Rules**:
- Course code must be unique
- Course code cannot be empty
- Course name cannot be empty
- Credits must be positive integer if provided

**State Transitions**:
- `deleted_at`: NULL → TIMESTAMP (soft delete by admin)
- Soft-deleted courses remain in database for historical data (7-year retention)

**Indexes**:
- `idx_courses_code` (UNIQUE): Fast course lookup by code
- `idx_courses_deleted_at` (partial, WHERE deleted_at IS NULL): Fast active course queries

---

### CourseTeacher (Junction Table)

**Purpose**: Links courses to teachers (many-to-many: one course can have multiple teachers).

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique relationship identifier
- `course_id` (INTEGER, NOT NULL, FOREIGN KEY → courses.id): Course identifier
- `teacher_id` (INTEGER, NOT NULL, FOREIGN KEY → users.id): Teacher (user) identifier
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Assignment creation timestamp

**Relationships**:
- **many-to-1** with `courses` (via `course_id`)
- **many-to-1** with `users` (via `teacher_id`)

**Validation Rules**:
- Combination of `course_id` and `teacher_id` must be unique
- Teacher must have role_id = Teacher role
- Both course and teacher must exist

**State Transitions**: None (static assignments, can be deleted)

**Indexes**:
- `idx_course_teachers_course_id`: Fast teacher lookup by course
- `idx_course_teachers_teacher_id`: Fast course lookup by teacher
- UNIQUE constraint on `(course_id, teacher_id)`

---

### PLO (Program Learning Outcome)

**Purpose**: Represents program-level educational outcomes that courses contribute to.

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique PLO identifier
- `code` (VARCHAR(50), UNIQUE, NOT NULL): PLO code (e.g., "PLO1", "PLO2")
- `description` (TEXT, NOT NULL): PLO description
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): PLO creation timestamp
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Last update timestamp

**Relationships**:
- **many-to-many** with `clos` (via `co_po_mappings`)

**Validation Rules**:
- PLO code must be unique
- PLO code cannot be empty
- Description cannot be empty

**State Transitions**: None (PLOs are relatively static)

**Indexes**:
- `idx_plos_code` (UNIQUE): Fast PLO lookup by code

---

### CLO (Course Learning Outcome)

**Purpose**: Represents course-level educational outcomes that map to program outcomes.

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique CLO identifier
- `course_id` (INTEGER, NOT NULL, FOREIGN KEY → courses.id): Course identifier
- `code` (VARCHAR(50), NOT NULL): CLO code (e.g., "CLO1", "CLO2")
- `description` (TEXT, NOT NULL): CLO description
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): CLO creation timestamp
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Last update timestamp

**Relationships**:
- **many-to-1** with `courses` (via `course_id`)
- **many-to-many** with `plos` (via `co_po_mappings`)
- **many-to-many** with `assessments` (via `assessment_clos`)
- **1-to-many** with `results` (via `clo_id`)

**Validation Rules**:
- Combination of `course_id` and `code` must be unique within a course
- CLO code cannot be empty
- Description cannot be empty
- Course must exist

**State Transitions**: None (CLOs are relatively static)

**Indexes**:
- `idx_clos_course_id`: Fast CLO lookup by course
- `idx_clos_course_code`: Fast CLO lookup by course and code
- UNIQUE constraint on `(course_id, code)`

---

### CO_PO_Mapping

**Purpose**: Links Course Learning Outcomes to Program Learning Outcomes with strength indicators.

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique mapping identifier
- `clo_id` (INTEGER, NOT NULL, FOREIGN KEY → clos.id): CLO identifier
- `plo_id` (INTEGER, NOT NULL, FOREIGN KEY → plos.id): PLO identifier
- `strength` (VARCHAR(20), DEFAULT 'Moderate'): Mapping strength (Strong, Moderate, Weak)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Mapping creation timestamp

**Relationships**:
- **many-to-1** with `clos` (via `clo_id`)
- **many-to-1** with `plos` (via `plo_id`)

**Validation Rules**:
- Combination of `clo_id` and `plo_id` must be unique
- Strength must be one of: "Strong", "Moderate", "Weak"
- Both CLO and PLO must exist

**State Transitions**: None (static mappings)

**Indexes**:
- `idx_co_po_mappings_clo_id`: Fast PLO lookup by CLO
- `idx_co_po_mappings_plo_id`: Fast CLO lookup by PLO
- UNIQUE constraint on `(clo_id, plo_id)`

---

### Enrollment

**Purpose**: Links students to courses (junction table for student-course relationship).

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique enrollment identifier
- `student_id` (INTEGER, NOT NULL, FOREIGN KEY → users.id): Student (user) identifier
- `course_id` (INTEGER, NOT NULL, FOREIGN KEY → courses.id): Course identifier
- `enrollment_date` (DATE, DEFAULT CURRENT_DATE): Enrollment date
- `status` (VARCHAR(20), DEFAULT 'Active'): Enrollment status (Active, Completed, Withdrawn)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Enrollment creation timestamp

**Relationships**:
- **many-to-1** with `users` (via `student_id`)
- **many-to-1** with `courses` (via `course_id`)

**Validation Rules**:
- Combination of `student_id` and `course_id` must be unique
- Student must have role_id = Student role
- Status must be one of: "Active", "Completed", "Withdrawn"
- Both student and course must exist

**State Transitions**:
- `status`: "Active" → "Completed" (course completion)
- `status`: "Active" → "Withdrawn" (student withdrawal)

**Indexes**:
- `idx_enrollments_student_id`: Fast course lookup by student
- `idx_enrollments_course_id`: Fast student lookup by course
- UNIQUE constraint on `(student_id, course_id)`

---

### Assessment

**Purpose**: Represents evaluations (quizzes, assignments, exams, projects) with weights and due dates.

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique assessment identifier
- `course_id` (INTEGER, NOT NULL, FOREIGN KEY → courses.id): Course identifier
- `name` (VARCHAR(200), NOT NULL): Assessment name
- `type` (VARCHAR(50), NOT NULL): Assessment type (Quiz, Assignment, Exam, Project)
- `description` (TEXT, NULLABLE): Assessment description
- `weight` (DECIMAL(5,2), NOT NULL): Percentage weight (0-100)
- `max_score` (DECIMAL(10,2), NOT NULL): Maximum possible score
- `due_date` (TIMESTAMP, NULLABLE): Assessment due date
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Assessment creation timestamp
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Last update timestamp

**Relationships**:
- **many-to-1** with `courses` (via `course_id`)
- **many-to-many** with `clos` (via `assessment_clos`)
- **1-to-many** with `results`

**Validation Rules**:
- Assessment name cannot be empty
- Type must be one of: "Quiz", "Assignment", "Exam", "Project"
- Weight must be between 0 and 100
- Max score must be positive
- Total weight of all assessments for a course must not exceed 100%
- Course must exist

**State Transitions**: None (assessments are relatively static)

**Indexes**:
- `idx_assessments_course_id`: Fast assessment lookup by course
- `idx_assessments_due_date`: Fast queries for upcoming assessments

---

### AssessmentCLO (Junction Table)

**Purpose**: Links assessments to Course Learning Outcomes with weights.

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique relationship identifier
- `assessment_id` (INTEGER, NOT NULL, FOREIGN KEY → assessments.id): Assessment identifier
- `clo_id` (INTEGER, NOT NULL, FOREIGN KEY → clos.id): CLO identifier
- `weight` (DECIMAL(5,2), DEFAULT 100.00): Weight of this CLO in the assessment (percentage)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Relationship creation timestamp

**Relationships**:
- **many-to-1** with `assessments` (via `assessment_id`)
- **many-to-1** with `clos` (via `clo_id`)

**Validation Rules**:
- Combination of `assessment_id` and `clo_id` must be unique
- Weight must be between 0 and 100
- Both assessment and CLO must exist
- CLO must belong to the same course as the assessment

**State Transitions**: None (static relationships)

**Indexes**:
- `idx_assessment_clos_assessment_id`: Fast CLO lookup by assessment
- `idx_assessment_clos_clo_id`: Fast assessment lookup by CLO
- UNIQUE constraint on `(assessment_id, clo_id)`

---

### Result

**Purpose**: Represents student assessment scores linked to specific CLOs.

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique result identifier
- `student_id` (INTEGER, NOT NULL, FOREIGN KEY → users.id): Student (user) identifier
- `assessment_id` (INTEGER, NOT NULL, FOREIGN KEY → assessments.id): Assessment identifier
- `clo_id` (INTEGER, NOT NULL, FOREIGN KEY → clos.id): CLO identifier
- `score` (DECIMAL(10,2), NOT NULL): Student's score
- `max_score` (DECIMAL(10,2), NOT NULL): Maximum possible score (denormalized from assessment)
- `percentage` (DECIMAL(5,2), NOT NULL): Calculated percentage (score/max_score * 100)
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Result creation timestamp
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Last update timestamp

**Relationships**:
- **many-to-1** with `users` (via `student_id`)
- **many-to-1** with `assessments` (via `assessment_id`)
- **many-to-1** with `clos` (via `clo_id`)
- **1-to-many** with `feedback`

**Validation Rules**:
- Combination of `student_id`, `assessment_id`, and `clo_id` must be unique
- Score must be between 0 and max_score
- Percentage must be between 0 and 100
- Student must be enrolled in the course containing the assessment
- CLO must be linked to the assessment via assessment_clos
- All foreign keys must exist

**State Transitions**: None (results are updated in place)

**Indexes**:
- `idx_results_student_id`: Fast result lookup by student
- `idx_results_assessment_id`: Fast result lookup by assessment
- `idx_results_clo_id`: Fast result lookup by CLO
- `idx_results_student_assessment`: Fast queries for student assessment results
- UNIQUE constraint on `(student_id, assessment_id, clo_id)`

---

### Feedback

**Purpose**: Represents teacher comments on student results.

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique feedback identifier
- `result_id` (INTEGER, NOT NULL, FOREIGN KEY → results.id): Result identifier
- `comment` (TEXT, NOT NULL): Feedback comment
- `created_by` (INTEGER, NOT NULL, FOREIGN KEY → users.id): Teacher who created feedback
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Feedback creation timestamp
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Last update timestamp

**Relationships**:
- **many-to-1** with `results` (via `result_id`)
- **many-to-1** with `users` (via `created_by`)

**Validation Rules**:
- Comment cannot be empty
- Created_by must be a teacher
- Result must exist

**State Transitions**: None (feedback can be updated)

**Indexes**:
- `idx_feedback_result_id`: Fast feedback lookup by result
- `idx_feedback_created_by`: Fast feedback lookup by teacher

---

### OTP

**Purpose**: Stores time-limited OTP codes for email-based authentication.

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique OTP identifier
- `user_id` (INTEGER, NULLABLE, FOREIGN KEY → users.id): User identifier (NULL for unregistered users)
- `email` (VARCHAR(255), NOT NULL): Email address for OTP delivery
- `code` (VARCHAR(10), NOT NULL): Hashed OTP code
- `expires_at` (TIMESTAMP, NOT NULL): OTP expiration timestamp
- `used` (BOOLEAN, DEFAULT FALSE): Whether OTP has been used
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): OTP creation timestamp

**Relationships**:
- **many-to-1** with `users` (via `user_id`, optional)

**Validation Rules**:
- Code must be hashed before storage
- Expires_at must be in the future
- Email must be valid format

**State Transitions**:
- `used`: FALSE → TRUE (after successful verification)
- OTPs expire automatically after `expires_at` timestamp

**Indexes**:
- `idx_otps_email_code`: Fast OTP lookup by email and code
- `idx_otps_expires_at`: Fast cleanup of expired OTPs
- `idx_otps_user_id`: Fast OTP lookup by user (where user_id IS NOT NULL)

---

### OAuthToken

**Purpose**: Stores Google OAuth tokens for authenticated users.

**Fields**:
- `id` (SERIAL, PRIMARY KEY): Unique token identifier
- `user_id` (INTEGER, NOT NULL, FOREIGN KEY → users.id): User identifier
- `provider` (VARCHAR(50), DEFAULT 'google'): OAuth provider name
- `access_token` (TEXT, NOT NULL): Encrypted OAuth access token
- `refresh_token` (TEXT, NULLABLE): Encrypted OAuth refresh token
- `expires_at` (TIMESTAMP, NOT NULL): Token expiration timestamp
- `created_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Token creation timestamp
- `updated_at` (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP): Last update timestamp

**Relationships**:
- **many-to-1** with `users` (via `user_id`)

**Validation Rules**:
- Access token must be encrypted before storage
- Expires_at must be in the future
- User must exist

**State Transitions**:
- Tokens are refreshed before expiry
- Expired tokens are cleaned up

**Indexes**:
- `idx_oauth_tokens_user_id`: Fast token lookup by user
- `idx_oauth_tokens_expires_at`: Fast cleanup of expired tokens

---

## Entity Relationship Summary

### One-to-Many Relationships

- `roles` → `users` (one role has many users)
- `users` → `enrollments` (one student has many enrollments)
- `users` → `results` (one student has many results)
- `users` → `otps` (one user can have many OTPs)
- `users` → `oauth_tokens` (one user can have many OAuth tokens)
- `courses` → `clos` (one course has many CLOs)
- `courses` → `enrollments` (one course has many enrollments)
- `courses` → `assessments` (one course has many assessments)
- `assessments` → `results` (one assessment has many results)
- `results` → `feedback` (one result can have many feedback entries)
- `clos` → `results` (one CLO has many results)

### Many-to-Many Relationships

- `roles` ↔ `permissions` (via `role_permissions`)
- `courses` ↔ `users` as teachers (via `course_teachers`)
- `clos` ↔ `plos` (via `co_po_mappings`)
- `assessments` ↔ `clos` (via `assessment_clos`)
- `users` as students ↔ `courses` (via `enrollments`)

---

## Data Integrity Rules

1. **Referential Integrity**: All foreign keys must reference existing records
2. **Unique Constraints**: Email, course codes, PLO codes, and composite keys must be unique
3. **Soft Delete**: Courses use soft delete (deleted_at) to preserve historical data
4. **Cascade Deletes**: 
   - Deleting a course cascades to CLOs, enrollments, assessments
   - Deleting a user cascades to enrollments, results, OTPs, OAuth tokens
   - Deleting a role cascades to role_permissions
5. **Check Constraints**: 
   - Assessment weights: 0 <= weight <= 100
   - Result scores: 0 <= score <= max_score
   - Enrollment status: Must be "Active", "Completed", or "Withdrawn"
   - Mapping strength: Must be "Strong", "Moderate", or "Weak"

---

## Validation Rules Summary

### User Registration/Update
- Email: Unique, valid format, required
- Password: Minimum 8 characters, hashed with bcrypt
- Name: Non-empty first and last name

### Course Management
- Course code: Unique, required
- Course name: Non-empty, required
- Soft delete: Preserves historical data

### Assessment Management
- Total course assessment weights: Must not exceed 100%
- Assessment type: Must be valid enum value
- Max score: Must be positive

### Result Entry
- Score: Must be between 0 and max_score
- Student must be enrolled in course
- CLO must be linked to assessment

### Outcome Mapping
- CLO-PLO mappings: Unique per CLO-PLO pair
- Mapping strength: Valid enum value

---

**End of Data Model**

