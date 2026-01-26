"""SQL queries for Assessment entity."""

# Get assessment by ID
GET_ASSESSMENT_BY_ID = """
    SELECT id, course_id, teacher_id, name, type, description, weight, max_score, due_date, created_at, updated_at
    FROM assessments
    WHERE id = %s
"""

# Get assessments by course
GET_ASSESSMENTS_BY_COURSE = """
    SELECT id, course_id, teacher_id, name, type, description, weight, max_score, due_date, created_at, updated_at
    FROM assessments
    WHERE course_id = %s
    ORDER BY due_date DESC, created_at DESC
"""

# Create assessment
CREATE_ASSESSMENT = """
    INSERT INTO assessments (course_id, teacher_id, name, type, description, weight, max_score, due_date)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
    RETURNING id, course_id, teacher_id, name, type, description, weight, max_score, due_date, created_at, updated_at
"""

# Update assessment
UPDATE_ASSESSMENT = """
    UPDATE assessments
    SET name = COALESCE(%s, name),
        type = COALESCE(%s, type),
        description = COALESCE(%s, description),
        weight = COALESCE(%s, weight),
        max_score = COALESCE(%s, max_score),
        due_date = COALESCE(%s, due_date),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = %s
    RETURNING id, course_id, teacher_id, name, type, description, weight, max_score, due_date, created_at, updated_at
"""

# Delete assessment
DELETE_ASSESSMENT = """
    DELETE FROM assessments
    WHERE id = %s
"""

# Get CLOs for assessment
GET_ASSESSMENT_CLOS = """
    SELECT ac.id, ac.assessment_id, ac.clo_id, ac.weight, c.code, c.description
    FROM assessment_clos ac
    INNER JOIN clos c ON ac.clo_id = c.id
    WHERE ac.assessment_id = %s
"""

