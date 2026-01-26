"""SQL queries for teacher-course assignments."""

# Insert teacher-course assignments (single)
INSERT_TEACHER_COURSE = """
    INSERT INTO course_teachers (course_id, teacher_id)
    VALUES (%s, %s)
    ON CONFLICT (course_id, teacher_id) DO NOTHING
    RETURNING id
"""

# Select teacher by id ensuring role Teacher
GET_TEACHER_BY_ID = """
    SELECT u.id
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE u.id = %s
      AND r.name = 'Teacher'
"""

# Check active course
GET_ACTIVE_COURSE_BY_ID = """
    SELECT id
    FROM courses
    WHERE id = %s
      AND deleted_at IS NULL
"""

# Get courses assigned to teacher
GET_COURSES_BY_TEACHER = """
    SELECT c.id,
           c.code,
           c.name,
           c.description,
           c.credits,
           c.created_at,
           c.updated_at
    FROM course_teachers ct
    INNER JOIN courses c ON ct.course_id = c.id
    WHERE ct.teacher_id = %s
      AND c.deleted_at IS NULL
    ORDER BY c.name
"""

# Check if teacher is assigned to a specific course
CHECK_TEACHER_ASSIGNED_TO_COURSE = """
    SELECT 1
    FROM course_teachers
    WHERE course_id = %s
      AND teacher_id = %s
    LIMIT 1
"""

# Check if student is enrolled in a course
CHECK_STUDENT_ENROLLED_IN_COURSE = """
    SELECT 1
    FROM enrollments
    WHERE course_id = %s
      AND student_id = %s
      AND status = 'Active'
    LIMIT 1
"""

# Get distinct students across teacher's courses
GET_STUDENTS_FOR_TEACHER = """
    SELECT DISTINCT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        e.enrollment_date,
        e.status,
        c.id AS course_id,
        c.code AS course_code,
        c.name AS course_name
    FROM course_teachers ct
    INNER JOIN courses c ON ct.course_id = c.id
    INNER JOIN enrollments e ON e.course_id = c.id
    INNER JOIN users u ON e.student_id = u.id
    WHERE ct.teacher_id = %s
    ORDER BY u.last_name, u.first_name
"""

