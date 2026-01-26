"""SQL queries for Course entity."""

# Get course by ID
GET_COURSE_BY_ID = """
    SELECT id, code, name, description, credits, deleted_at, created_at, updated_at
    FROM courses
    WHERE id = %s
"""

# Get all courses (excluding soft-deleted)
GET_ALL_COURSES = """
    SELECT id, code, name, description, credits, deleted_at, created_at, updated_at
    FROM courses
    WHERE deleted_at IS NULL
      AND (%s IS NULL OR code ILIKE %s OR name ILIKE %s)
    ORDER BY code
    LIMIT %s OFFSET %s
"""

# Count courses
COUNT_COURSES = """
    SELECT COUNT(*) as total
    FROM courses
    WHERE deleted_at IS NULL
      AND (%s IS NULL OR code ILIKE %s OR name ILIKE %s)
"""

# Create course
CREATE_COURSE = """
    INSERT INTO courses (code, name, description, credits)
    VALUES (%s, %s, %s, %s)
    RETURNING id, code, name, description, credits, deleted_at, created_at, updated_at
"""

# Update course
UPDATE_COURSE = """
    UPDATE courses
    SET code = COALESCE(%s, code),
        name = COALESCE(%s, name),
        description = COALESCE(%s, description),
        credits = COALESCE(%s, credits),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = %s
    RETURNING id, code, name, description, credits, deleted_at, created_at, updated_at
"""

# Soft delete course
DELETE_COURSE = """
    UPDATE courses
    SET deleted_at = CURRENT_TIMESTAMP,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = %s
"""

# Get teachers for course
GET_COURSE_TEACHERS = """
    SELECT u.id, u.email, u.first_name, u.last_name, ct.created_at
    FROM course_teachers ct
    INNER JOIN users u ON ct.teacher_id = u.id
    WHERE ct.course_id = %s
    ORDER BY u.last_name, u.first_name
"""

# Assign teacher to course
ASSIGN_TEACHER = """
    INSERT INTO course_teachers (course_id, teacher_id)
    VALUES (%s, %s)
    ON CONFLICT (course_id, teacher_id) DO NOTHING
    RETURNING id, course_id, teacher_id, created_at
"""

# Get students enrolled in course
GET_COURSE_STUDENTS = """
    SELECT u.id, u.email, u.first_name, u.last_name, e.enrollment_date, e.status
    FROM enrollments e
    INNER JOIN users u ON e.student_id = u.id
    WHERE e.course_id = %s
    ORDER BY u.last_name, u.first_name
"""

# Get active courses
GET_ACTIVE_COURSES = """
    SELECT id, code, name, description, credits, created_at, updated_at
    FROM courses
    WHERE deleted_at IS NULL
    ORDER BY code
"""

GET_ACTIVE_COURSE_BY_ID = """
    SELECT id, code, name
    FROM courses
    WHERE id = %s AND deleted_at IS NULL
"""

# Get courses a student is enrolled in
GET_COURSES_FOR_STUDENT = """
    SELECT c.id, c.code, c.name, c.description, c.credits, c.created_at, c.updated_at, e.enrollment_date, e.status
    FROM enrollments e
    INNER JOIN courses c ON e.course_id = c.id
    WHERE e.student_id = %s
      AND c.deleted_at IS NULL
    ORDER BY c.code
"""

# Enroll student in course
ENROLL_STUDENT = """
    INSERT INTO enrollments (student_id, course_id, status)
    VALUES (%s, %s, 'Active')
    ON CONFLICT (student_id, course_id) DO NOTHING
    RETURNING id, student_id, course_id, enrollment_date, status
"""

# Remove student enrollment
REMOVE_STUDENT_ENROLLMENT = """
    DELETE FROM enrollments
    WHERE student_id = %s
      AND course_id = %s
    RETURNING id
"""

