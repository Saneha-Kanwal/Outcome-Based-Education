"""SQL queries for Role entity."""

# Get role by ID
GET_ROLE_BY_ID = """
    SELECT id, name, description, created_at
    FROM roles
    WHERE id = %s
"""

# Get role by name
GET_ROLE_BY_NAME = """
    SELECT id, name, description, created_at
    FROM roles
    WHERE name = %s
"""

# Get all roles
GET_ALL_ROLES = """
    SELECT id, name, description, created_at
    FROM roles
    ORDER BY name
"""

# Create role
CREATE_ROLE = """
    INSERT INTO roles (name, description)
    VALUES (%s, %s)
    RETURNING id, name, description, created_at
"""

# Update role
UPDATE_ROLE = """
    UPDATE roles
    SET name = %s, description = %s
    WHERE id = %s
    RETURNING id, name, description, created_at
"""

# Delete role
DELETE_ROLE = """
    DELETE FROM roles
    WHERE id = %s
"""

