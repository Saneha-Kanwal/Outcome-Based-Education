# Tasks: OBE System Complete Specification

**Input**: Design documents from `/specs/1-obe-system/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not explicitly requested in specification, so test tasks are not included. Focus on implementation tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `obebackend/src/obebackend/`, `obefrontend/src/`
- Backend paths: `obebackend/src/obebackend/`
- Frontend paths: `obefrontend/src/`

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create backend project structure in obebackend/src/obebackend/ per implementation plan
- [x] T002 Create frontend project structure in obefrontend/src/ per implementation plan
- [ ] T003 [P] Initialize Python virtual environment and install backend dependencies in obebackend/
- [ ] T004 [P] Initialize npm project and install frontend dependencies in obefrontend/
- [x] T005 [P] Configure ESLint for frontend in obefrontend/eslint.config.js
- [x] T006 [P] Create backend requirements.txt with FastAPI, psycopg2, bcrypt, PyJWT, python-google-auth dependencies
- [x] T007 [P] Create backend config.py for environment variables in obebackend/src/obebackend/config.py
- [x] T008 [P] Create frontend .env.example with VITE_API_BASE_URL in obefrontend/.env.example
- [x] T009 [P] Create backend .env.example with DATABASE_URL, JWT_SECRET, OAuth credentials in obebackend/.env.example
- [x] T010 Create database schema SQL file in obebackend/schema.sql with all table definitions from data-model.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T011 Setup PostgreSQL database connection pool in obebackend/src/obebackend/database/connection.py
- [x] T012 [P] Create database queries base module in obebackend/src/obebackend/database/queries/__init__.py
- [x] T013 [P] Implement error handling middleware in obebackend/src/obebackend/middleware/error_handler.py
- [x] T014 [P] Create common response schemas in obebackend/src/obebackend/schemas/common_schemas.py
- [x] T015 [P] Create FastAPI app entry point in obebackend/src/obebackend/main.py with CORS and middleware setup
- [x] T016 [P] Create frontend Axios instance with interceptors in obefrontend/src/services/api.js
- [x] T017 [P] Create frontend constants file with role constants and API endpoints in obefrontend/src/utils/constants.js
- [x] T018 [P] Create frontend formatters utility in obefrontend/src/utils/formatters.js
- [x] T019 [P] Create frontend helpers utility in obefrontend/src/utils/helpers.js
- [x] T020 [P] Create frontend validators utility in obefrontend/src/utils/validators.js
- [x] T021 Create frontend base CSS variables in obefrontend/src/styles/variables.css
- [x] T022 [P] Create frontend base component styles in obefrontend/src/styles/components.css
- [x] T023 [P] Create frontend responsive styles in obefrontend/src/styles/responsive.css
- [ ] T024 Run database schema SQL to create all tables in PostgreSQL database

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Authentication and Registration (Priority: P1) 🎯 MVP

**Goal**: Enable users to securely authenticate using JWT, Google OAuth, or Email OTP and access role-appropriate dashboards

**Independent Test**: Can be fully tested by implementing login flows for all three authentication methods and verifying users are redirected to appropriate dashboards based on their role. Delivers value by enabling secure system access.

### Implementation for User Story 1

#### Backend - Database & Models

- [x] T025 [P] [US1] Create Role entity SQL queries in obebackend/src/obebackend/database/queries/role_queries.py
- [x] T026 [P] [US1] Create Permission entity SQL queries in obebackend/src/obebackend/database/queries/permission_queries.py
- [x] T027 [P] [US1] Create RolePermission junction table SQL queries in obebackend/src/obebackend/database/queries/role_permission_queries.py
- [x] T028 [P] [US1] Create User entity SQL queries in obebackend/src/obebackend/database/queries/user_queries.py
- [x] T029 [P] [US1] Create OTP entity SQL queries in obebackend/src/obebackend/database/queries/otp_queries.py
- [x] T030 [P] [US1] Create OAuthToken entity SQL queries in obebackend/src/obebackend/database/queries/oauth_token_queries.py

#### Backend - Utilities

- [x] T031 [P] [US1] Implement password hashing with bcrypt in obebackend/src/obebackend/utils/security.py
- [x] T032 [P] [US1] Implement JWT token generation and validation in obebackend/src/obebackend/utils/security.py
- [x] T033 [P] [US1] Implement OTP generation and validation in obebackend/src/obebackend/utils/otp.py
- [x] T034 [P] [US1] Implement Google OAuth handling in obebackend/src/obebackend/utils/oauth.py
- [x] T035 [P] [US1] Implement email sending utilities in obebackend/src/obebackend/utils/email.py
- [x] T036 [P] [US1] Create input validators in obebackend/src/obebackend/utils/validators.py

#### Backend - Schemas

- [x] T037 [P] [US1] Create auth request/response schemas in obebackend/src/obebackend/schemas/auth_schemas.py
- [x] T038 [P] [US1] Create user schemas in obebackend/src/obebackend/schemas/user_schemas.py

#### Backend - Controllers

- [x] T039 [US1] Implement authentication controller in obebackend/src/obebackend/controllers/auth_controller.py
- [x] T040 [US1] Implement user controller in obebackend/src/obebackend/controllers/user_controller.py

#### Backend - Middleware

- [x] T041 [US1] Implement JWT authentication middleware in obebackend/src/obebackend/middleware/auth_middleware.py
- [x] T042 [US1] Implement RBAC middleware in obebackend/src/obebackend/middleware/rbac_middleware.py

#### Backend - Routes

- [x] T043 [US1] Implement authentication routes in obebackend/src/obebackend/routes/auth.py
- [x] T044 [US1] Register auth routes in obebackend/src/obebackend/main.py

#### Frontend - Context & Services

- [x] T045 [P] [US1] Create AuthContext for global auth state in obefrontend/src/contexts/AuthContext.jsx
- [x] T046 [P] [US1] Create UserContext for user profile and permissions in obefrontend/src/contexts/UserContext.jsx
- [x] T047 [P] [US1] Create auth service in obefrontend/src/services/authService.js
- [x] T048 [P] [US1] Create user service in obefrontend/src/services/userService.js

#### Frontend - Components

- [x] T049 [P] [US1] Create LoginForm component in obefrontend/src/components/auth/LoginForm.jsx
- [x] T050 [P] [US1] Create RegisterForm component in obefrontend/src/components/auth/RegisterForm.jsx
- [x] T051 [P] [US1] Create OTPForm component in obefrontend/src/components/auth/OTPForm.jsx
- [x] T052 [P] [US1] Create GoogleOAuthButton component in obefrontend/src/components/auth/GoogleOAuthButton.jsx

#### Frontend - Pages

- [x] T053 [US1] Create Login page in obefrontend/src/pages/auth/Login.jsx
- [x] T054 [US1] Create Register page in obefrontend/src/pages/auth/Register.jsx
- [x] T055 [US1] Create ForgotPassword page in obefrontend/src/pages/auth/ForgotPassword.jsx

#### Frontend - Hooks & Routing

- [x] T056 [P] [US1] Create useAuth hook in obefrontend/src/hooks/useAuth.js
- [x] T057 [P] [US1] Create useRole hook in obefrontend/src/hooks/useRole.js
- [x] T058 [P] [US1] Create useProtectedRoute hook in obefrontend/src/hooks/useProtectedRoute.js
- [x] T059 [US1] Setup React Router with protected routes in obefrontend/src/App.jsx
- [x] T060 [US1] Implement role-based route guards in obefrontend/src/App.jsx

#### Frontend - Dashboards

- [x] T061 [P] [US1] Create AdminDashboard component in obefrontend/src/components/dashboard/AdminDashboard.jsx
- [x] T062 [P] [US1] Create TeacherDashboard component in obefrontend/src/components/dashboard/TeacherDashboard.jsx
- [x] T063 [P] [US1] Create StudentDashboard component in obefrontend/src/components/dashboard/StudentDashboard.jsx

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Users can authenticate via JWT, OAuth, or OTP and access role-appropriate dashboards.

---

## Phase 4: User Story 2 - Admin User and Course Management (Priority: P1)

**Goal**: Enable admins to create, view, update, and delete users (assigning roles), and manage courses including creating courses, assigning teachers, and configuring course details

**Independent Test**: Can be fully tested by creating users with different roles, creating courses, and assigning teachers to courses. Delivers value by enabling system configuration and user management.

### Implementation for User Story 2

#### Backend - Database & Models

- [ ] T064 [P] [US2] Create Course entity SQL queries in obebackend/src/obebackend/database/queries/course_queries.py
- [ ] T065 [P] [US2] Create CourseTeacher junction table SQL queries in obebackend/src/obebackend/database/queries/course_teacher_queries.py

#### Backend - Schemas

- [ ] T066 [P] [US2] Create course schemas in obebackend/src/obebackend/schemas/course_schemas.py

#### Backend - Controllers

- [ ] T067 [US2] Implement user management controller in obebackend/src/obebackend/controllers/user_controller.py (extend existing)
- [ ] T068 [US2] Implement course management controller in obebackend/src/obebackend/controllers/course_controller.py

#### Backend - Routes

- [ ] T069 [US2] Implement user management routes in obebackend/src/obebackend/routes/users.py
- [ ] T070 [US2] Implement course management routes in obebackend/src/obebackend/routes/courses.py
- [ ] T071 [US2] Register user and course routes in obebackend/src/obebackend/main.py

#### Frontend - Services

- [ ] T072 [P] [US2] Create course service in obefrontend/src/services/courseService.js

#### Frontend - Common Components

- [ ] T073 [P] [US2] Create Navbar component in obefrontend/src/components/common/Navbar.jsx
- [ ] T074 [P] [US2] Create Sidebar component in obefrontend/src/components/common/Sidebar.jsx
- [ ] T075 [P] [US2] Create Card component in obefrontend/src/components/common/Card.jsx
- [ ] T076 [P] [US2] Create Table component in obefrontend/src/components/common/Table.jsx
- [ ] T077 [P] [US2] Create Modal component in obefrontend/src/components/common/Modal.jsx
- [ ] T078 [P] [US2] Create Form component in obefrontend/src/components/common/Form.jsx
- [ ] T079 [P] [US2] Create Button component in obefrontend/src/components/common/Button.jsx
- [ ] T080 [P] [US2] Create Input component in obefrontend/src/components/common/Input.jsx
- [ ] T081 [P] [US2] Create Select component in obefrontend/src/components/common/Select.jsx
- [ ] T082 [P] [US2] Create Loading component in obefrontend/src/components/common/Loading.jsx
- [ ] T083 [P] [US2] Create ErrorMessage component in obefrontend/src/components/common/ErrorMessage.jsx

#### Frontend - Admin Pages

- [ ] T084 [US2] Create Users management page in obefrontend/src/pages/admin/Users.jsx
- [ ] T085 [US2] Create Courses management page in obefrontend/src/pages/admin/Courses.jsx
- [ ] T086 [US2] Setup admin routes in obefrontend/src/App.jsx

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Admins can manage users and courses.

---

## Phase 5: User Story 3 - Outcome Definition and Mapping (Priority: P2)

**Goal**: Enable admins to define Program Learning Outcomes (PLOs) and Course Learning Outcomes (CLOs), and create mappings between CLOs and PLOs

**Independent Test**: Can be fully tested by creating PLOs, creating CLOs for courses, and mapping CLOs to PLOs. Delivers value by establishing the outcome structure.

### Implementation for User Story 3

#### Backend - Database & Models

- [ ] T087 [P] [US3] Create PLO entity SQL queries in obebackend/src/obebackend/database/queries/plo_queries.py
- [ ] T088 [P] [US3] Create CLO entity SQL queries in obebackend/src/obebackend/database/queries/clo_queries.py
- [ ] T089 [P] [US3] Create CO_PO_Mapping entity SQL queries in obebackend/src/obebackend/database/queries/mapping_queries.py

#### Backend - Schemas

- [ ] T090 [P] [US3] Create outcome schemas in obebackend/src/obebackend/schemas/outcome_schemas.py

#### Backend - Controllers

- [ ] T091 [US3] Implement outcome controller in obebackend/src/obebackend/controllers/outcome_controller.py
- [ ] T092 [US3] Implement mapping controller in obebackend/src/obebackend/controllers/mapping_controller.py

#### Backend - Routes

- [ ] T093 [US3] Implement outcome routes in obebackend/src/obebackend/routes/outcomes.py
- [ ] T094 [US3] Implement mapping routes in obebackend/src/obebackend/routes/mappings.py
- [ ] T095 [US3] Register outcome and mapping routes in obebackend/src/obebackend/main.py

#### Frontend - Services

- [ ] T096 [P] [US3] Create outcome service in obefrontend/src/services/outcomeService.js

#### Frontend - Admin Pages

- [ ] T097 [US3] Create Outcomes management page in obefrontend/src/pages/admin/Outcomes.jsx
- [ ] T098 [US3] Create Mappings management page in obefrontend/src/pages/admin/Mappings.jsx

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. Admins can define outcomes and create mappings.

---

## Phase 6: User Story 4 - Assessment Creation and Management (Priority: P2)

**Goal**: Enable teachers to create assessments (quizzes, assignments, exams) for their courses, link them to specific CLOs, set weights, and configure assessment details

**Independent Test**: Can be fully tested by creating assessments with CLO mappings and weights. Delivers value by enabling outcome-based evaluation.

### Implementation for User Story 4

#### Backend - Database & Models

- [ ] T099 [P] [US4] Create Assessment entity SQL queries in obebackend/src/obebackend/database/queries/assessment_queries.py
- [ ] T100 [P] [US4] Create AssessmentCLO junction table SQL queries in obebackend/src/obebackend/database/queries/assessment_clo_queries.py

#### Backend - Schemas

- [ ] T101 [P] [US4] Create assessment schemas in obebackend/src/obebackend/schemas/assessment_schemas.py

#### Backend - Controllers

- [ ] T102 [US4] Implement assessment controller in obebackend/src/obebackend/controllers/assessment_controller.py

#### Backend - Routes

- [ ] T103 [US4] Implement assessment routes in obebackend/src/obebackend/routes/assessments.py
- [ ] T104 [US4] Register assessment routes in obebackend/src/obebackend/main.py

#### Frontend - Services

- [ ] T105 [P] [US4] Create assessment service in obefrontend/src/services/assessmentService.js

#### Frontend - Teacher Pages

- [ ] T106 [US4] Create Assessments management page in obefrontend/src/pages/teacher/Assessments.jsx
- [ ] T107 [US4] Setup teacher routes in obefrontend/src/App.jsx

**Checkpoint**: At this point, User Stories 1-4 should all work independently. Teachers can create and manage assessments.

---

## Phase 7: User Story 5 - Result Entry and Feedback (Priority: P2)

**Goal**: Enable teachers to enter student assessment results, link scores to specific CLOs, calculate outcome achievement, and provide feedback to students

**Independent Test**: Can be fully tested by entering results for assessments and verifying calculations and feedback delivery. Delivers value by enabling outcome tracking and student communication.

### Implementation for User Story 5

#### Backend - Database & Models

- [ ] T108 [P] [US5] Create Result entity SQL queries in obebackend/src/obebackend/database/queries/result_queries.py
- [ ] T109 [P] [US5] Create Feedback entity SQL queries in obebackend/src/obebackend/database/queries/feedback_queries.py

#### Backend - Schemas

- [ ] T110 [P] [US5] Create result schemas in obebackend/src/obebackend/schemas/result_schemas.py

#### Backend - Controllers

- [ ] T111 [US5] Implement result controller in obebackend/src/obebackend/controllers/result_controller.py

#### Backend - Routes

- [ ] T112 [US5] Implement result routes in obebackend/src/obebackend/routes/results.py
- [ ] T113 [US5] Register result routes in obebackend/src/obebackend/main.py

#### Frontend - Services

- [ ] T114 [P] [US5] Create result service in obefrontend/src/services/resultService.js

#### Frontend - Teacher Pages

- [ ] T115 [US5] Create Results entry page in obefrontend/src/pages/teacher/Results.jsx

**Checkpoint**: At this point, User Stories 1-5 should all work independently. Teachers can enter results and provide feedback.

---

## Phase 8: User Story 6 - Student Course Enrollment and Progress View (Priority: P2)

**Goal**: Enable students to view their enrolled courses, see assessment details, view their results and grades, and track their progress against course outcomes

**Independent Test**: Can be fully tested by enrolling a student in courses and verifying they can view all course information and results. Delivers value by providing student self-service access to educational data.

### Implementation for User Story 6

#### Backend - Database & Models

- [ ] T116 [P] [US6] Create Enrollment entity SQL queries in obebackend/src/obebackend/database/queries/enrollment_queries.py

#### Backend - Controllers

- [ ] T117 [US6] Extend course controller to support enrollment queries in obebackend/src/obebackend/controllers/course_controller.py
- [ ] T118 [US6] Extend result controller to support student result queries in obebackend/src/obebackend/controllers/result_controller.py

#### Backend - Routes

- [ ] T119 [US6] Extend course routes to support student enrollment views in obebackend/src/obebackend/routes/courses.py
- [ ] T120 [US6] Extend result routes to support student result views in obebackend/src/obebackend/routes/results.py

#### Frontend - Student Pages

- [ ] T121 [US6] Create Profile page in obefrontend/src/pages/student/Profile.jsx
- [ ] T122 [US6] Create Courses page in obefrontend/src/pages/student/Courses.jsx
- [ ] T123 [US6] Create Results page in obefrontend/src/pages/student/Results.jsx
- [ ] T124 [US6] Create Progress page in obefrontend/src/pages/student/Progress.jsx
- [ ] T125 [US6] Setup student routes in obefrontend/src/App.jsx

**Checkpoint**: At this point, User Stories 1-6 should all work independently. Students can view their courses, results, and progress.

---

## Phase 9: User Story 7 - Analytics and Reporting (Priority: P3)

**Goal**: Enable admins and teachers to generate reports showing student progress, outcome achievement, course performance, and program-level analytics

**Independent Test**: Can be fully tested by generating various reports and verifying data accuracy and visualization. Delivers value by enabling data-driven educational decisions.

### Implementation for User Story 7

#### Backend - Database & Models

- [ ] T126 [P] [US7] Create analytics SQL queries in obebackend/src/obebackend/database/queries/analytics_queries.py

#### Backend - Schemas

- [ ] T127 [P] [US7] Create analytics response schemas in obebackend/src/obebackend/schemas/analytics_schemas.py

#### Backend - Controllers

- [ ] T128 [US7] Implement analytics controller in obebackend/src/obebackend/controllers/analytics_controller.py

#### Backend - Routes

- [ ] T129 [US7] Implement analytics routes in obebackend/src/obebackend/routes/analytics.py
- [ ] T130 [US7] Register analytics routes in obebackend/src/obebackend/main.py

#### Frontend - Services

- [ ] T131 [P] [US7] Create analytics service in obefrontend/src/services/analyticsService.js

#### Frontend - Pages

- [ ] T132 [US7] Create Analytics page in obefrontend/src/pages/admin/Analytics.jsx
- [ ] T133 [US7] Create Reports page in obefrontend/src/pages/teacher/Reports.jsx

**Checkpoint**: All user stories should now be independently functional. Analytics and reporting are available.

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T134 [P] Update README with setup instructions in obebackend/README.md
- [ ] T135 [P] Update README with setup instructions in obefrontend/README.md
- [ ] T136 [P] Add inline comments for complex logic in backend controllers
- [ ] T137 [P] Add inline comments for complex SQL queries in database/queries/
- [ ] T138 [P] Code cleanup and refactoring across backend
- [ ] T139 [P] Code cleanup and refactoring across frontend
- [ ] T140 [P] Performance optimization - add database indexes verification
- [ ] T141 [P] Performance optimization - implement pagination for all list endpoints
- [ ] T142 [P] Security hardening - verify all inputs are validated
- [ ] T143 [P] Security hardening - verify RBAC enforcement on all endpoints
- [ ] T144 [P] Responsive design testing and fixes across all pages
- [ ] T145 [P] Accessibility improvements (WCAG compliance) across frontend
- [ ] T146 Run quickstart.md validation - verify all setup steps work
- [ ] T147 Create database seed script for initial roles and permissions in obebackend/scripts/seed_data.py

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-9)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 10)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 for authentication/RBAC
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on US2 for courses
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - Depends on US2 (courses) and US3 (CLOs)
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Depends on US4 (assessments) and US6 (enrollments)
- **User Story 6 (P2)**: Can start after Foundational (Phase 2) - Depends on US2 (courses) and US5 (results)
- **User Story 7 (P3)**: Can start after Foundational (Phase 2) - Depends on all previous stories for data

### Within Each User Story

- Database queries before controllers
- Controllers before routes
- Schemas before controllers
- Backend before frontend (for same feature)
- Core implementation before integration
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, user stories can start in parallel (if team capacity allows)
- Database query files within a story marked [P] can run in parallel
- Frontend components within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members (respecting dependencies)

---

## Parallel Example: User Story 1

```bash
# Launch all database query files for User Story 1 together:
Task: "Create Role entity SQL queries in obebackend/src/obebackend/database/queries/role_queries.py"
Task: "Create Permission entity SQL queries in obebackend/src/obebackend/database/queries/permission_queries.py"
Task: "Create RolePermission junction table SQL queries in obebackend/src/obebackend/database/queries/role_permission_queries.py"
Task: "Create User entity SQL queries in obebackend/src/obebackend/database/queries/user_queries.py"
Task: "Create OTP entity SQL queries in obebackend/src/obebackend/database/queries/otp_queries.py"
Task: "Create OAuthToken entity SQL queries in obebackend/src/obebackend/database/queries/oauth_token_queries.py"

# Launch all utility files for User Story 1 together:
Task: "Implement password hashing with bcrypt in obebackend/src/obebackend/utils/security.py"
Task: "Implement JWT token generation and validation in obebackend/src/obebackend/utils/security.py"
Task: "Implement OTP generation and validation in obebackend/src/obebackend/utils/otp.py"
Task: "Implement Google OAuth handling in obebackend/src/obebackend/utils/oauth.py"
Task: "Implement email sending utilities in obebackend/src/obebackend/utils/email.py"

# Launch all frontend components for User Story 1 together:
Task: "Create LoginForm component in obefrontend/src/components/auth/LoginForm.jsx"
Task: "Create RegisterForm component in obefrontend/src/components/auth/RegisterForm.jsx"
Task: "Create OTPForm component in obefrontend/src/components/auth/OTPForm.jsx"
Task: "Create GoogleOAuthButton component in obefrontend/src/components/auth/GoogleOAuthButton.jsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add User Story 6 → Test independently → Deploy/Demo
8. Add User Story 7 → Test independently → Deploy/Demo
9. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Authentication)
   - Developer B: User Story 2 (User/Course Management) - after US1 auth is ready
   - Developer C: User Story 3 (Outcomes) - after US2 courses are ready
3. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Backend uses raw SQL (no ORM) - all queries in database/queries/
- Frontend uses Context API (no Redux) - state in contexts/
- All authentication must enforce RBAC
- All endpoints must validate inputs and handle errors

---

## Task Summary

- **Total Tasks**: 147
- **Setup Phase**: 10 tasks
- **Foundational Phase**: 14 tasks
- **User Story 1 (P1)**: 37 tasks
- **User Story 2 (P1)**: 23 tasks
- **User Story 3 (P2)**: 12 tasks
- **User Story 4 (P2)**: 9 tasks
- **User Story 5 (P2)**: 8 tasks
- **User Story 6 (P2)**: 10 tasks
- **User Story 7 (P3)**: 8 tasks
- **Polish Phase**: 14 tasks

**Suggested MVP Scope**: Phases 1-3 (Setup + Foundational + User Story 1) = 61 tasks

