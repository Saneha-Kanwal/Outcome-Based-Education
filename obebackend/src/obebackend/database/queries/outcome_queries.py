"""SQL queries for PLO and CLO entities."""

# PLO queries
GET_PLO_BY_ID = """
    SELECT id, code, description, created_at, updated_at
    FROM plos
    WHERE id = %s
"""

GET_ALL_PLOS = """
    SELECT id, code, description, created_at, updated_at
    FROM plos
    ORDER BY code
"""

CREATE_PLO = """
    INSERT INTO plos (code, description)
    VALUES (%s, %s)
    RETURNING id, code, description, created_at, updated_at
"""

UPDATE_PLO = """
    UPDATE plos
    SET code = %s, description = %s, updated_at = CURRENT_TIMESTAMP
    WHERE id = %s
    RETURNING id, code, description, created_at, updated_at
"""

DELETE_PLO = """
    DELETE FROM plos
    WHERE id = %s
"""

# CLO queries
GET_CLO_BY_ID = """
    SELECT id, course_id, code, description, created_at, updated_at
    FROM clos
    WHERE id = %s
"""

GET_CLOS_BY_COURSE = """
    SELECT id, course_id, code, description, created_at, updated_at
    FROM clos
    WHERE course_id = %s
    ORDER BY code
"""

CREATE_CLO = """
    INSERT INTO clos (course_id, code, description)
    VALUES (%s, %s, %s)
    RETURNING id, course_id, code, description, created_at, updated_at
"""

UPDATE_CLO = """
    UPDATE clos
    SET code = %s, description = %s, updated_at = CURRENT_TIMESTAMP
    WHERE id = %s
    RETURNING id, course_id, code, description, created_at, updated_at
"""

DELETE_CLO = """
    DELETE FROM clos
    WHERE id = %s
"""

