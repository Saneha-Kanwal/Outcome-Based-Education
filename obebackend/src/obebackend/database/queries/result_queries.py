"""SQL queries for Result entity."""

# Get result by ID
GET_RESULT_BY_ID = """
    SELECT id, student_id, assessment_id, clo_id, score, max_score, percentage, created_at, updated_at
    FROM results
    WHERE id = %s
"""

# Get results by assessment
GET_RESULTS_BY_ASSESSMENT = """
    SELECT r.id,
           r.student_id,
           r.assessment_id,
           r.clo_id,
           r.score,
           r.max_score,
           r.percentage,
           r.created_at,
           r.updated_at,
           a.name AS assessment_name,
           a.type AS assessment_type,
           a.due_date AS assessment_due_date,
           course.id AS course_id,
           course.name AS course_name,
           course.code AS course_code,
           u.first_name,
           u.last_name,
           u.email,
           clo.code AS clo_code
    FROM results r
    INNER JOIN assessments a ON r.assessment_id = a.id
    INNER JOIN courses course ON a.course_id = course.id
    INNER JOIN users u ON r.student_id = u.id
    INNER JOIN clos clo ON r.clo_id = clo.id
    WHERE r.assessment_id = %s
    ORDER BY course.name, a.name, u.last_name, u.first_name, clo.code
"""

# Get results by student
GET_RESULTS_BY_STUDENT = """
    SELECT r.id,
           r.student_id,
           r.assessment_id,
           r.clo_id,
           r.score,
           r.max_score,
           r.percentage,
           r.created_at,
           r.updated_at,
           a.name AS assessment_name,
           a.type AS assessment_type,
           a.due_date AS assessment_due_date,
           course.id AS course_id,
           course.name AS course_name,
           course.code AS course_code,
           u.first_name,
           u.last_name,
           u.email,
           clo.code AS clo_code
    FROM results r
    INNER JOIN assessments a ON r.assessment_id = a.id
    INNER JOIN courses course ON a.course_id = course.id
    INNER JOIN users u ON r.student_id = u.id
    INNER JOIN clos clo ON r.clo_id = clo.id
    WHERE r.student_id = %s
    ORDER BY a.due_date DESC, clo.code
"""

# Create result
CREATE_RESULT = """
    INSERT INTO results (student_id, assessment_id, clo_id, score, max_score, percentage)
    VALUES (%s, %s, %s, %s, %s, %s)
    RETURNING id, student_id, assessment_id, clo_id, score, max_score, percentage, created_at, updated_at
"""

# Find result by student/assessment/clo
GET_RESULT_BY_KEYS = """
    SELECT id, student_id, assessment_id, clo_id, score, max_score, percentage, created_at, updated_at
    FROM results
    WHERE student_id = %s
      AND assessment_id = %s
      AND clo_id = %s
"""

GET_RESULT_WITH_DETAILS_BY_ID = """
    SELECT r.id,
           r.student_id,
           r.assessment_id,
           r.clo_id,
           r.score,
           r.max_score,
           r.percentage,
           r.created_at,
           r.updated_at,
           a.name AS assessment_name,
           a.type AS assessment_type,
           a.due_date AS assessment_due_date,
           course.id AS course_id,
           course.name AS course_name,
           course.code AS course_code,
           u.first_name,
           u.last_name,
           u.email,
           clo.code AS clo_code
    FROM results r
    INNER JOIN assessments a ON r.assessment_id = a.id
    INNER JOIN courses course ON a.course_id = course.id
    INNER JOIN users u ON r.student_id = u.id
    INNER JOIN clos clo ON r.clo_id = clo.id
    WHERE r.id = %s
"""

# Update result
UPDATE_RESULT = """
    UPDATE results
    SET score = %s, max_score = %s, percentage = %s, updated_at = CURRENT_TIMESTAMP
    WHERE id = %s
    RETURNING id, student_id, assessment_id, clo_id, score, max_score, percentage, created_at, updated_at
"""

# Get feedback for result
GET_FEEDBACK_BY_RESULT = """
    SELECT id, result_id, comment, created_by, created_at, updated_at
    FROM feedback
    WHERE result_id = %s
    ORDER BY created_at DESC
"""

# Create feedback
CREATE_FEEDBACK = """
    INSERT INTO feedback (result_id, comment, created_by)
    VALUES (%s, %s, %s)
    RETURNING id, result_id, comment, created_by, created_at, updated_at
"""

