"""SQL queries for Permission entity."""

# Get permission by ID
GET_PERMISSION_BY_ID = """
    SELECT id, name, description, created_at
    FROM permissions
    WHERE id = %s
"""

# Get permission by name
GET_PERMISSION_BY_NAME = """
    SELECT id, name, description, created_at
    FROM permissions
    WHERE name = %s
"""

# Get all permissions
GET_ALL_PERMISSIONS = """
    SELECT id, name, description, created_at
    FROM permissions
    ORDER BY name
"""

# Get permissions by role ID
GET_PERMISSIONS_BY_ROLE_ID = """
    SELECT p.id, p.name, p.description, p.created_at
    FROM permissions p
    INNER JOIN role_permissions rp ON p.id = rp.permission_id
    WHERE rp.role_id = %s
    ORDER BY p.name
"""

# Create permission
CREATE_PERMISSION = """
    INSERT INTO permissions (name, description)
    VALUES (%s, %s)
    RETURNING id, name, description, created_at
"""

# Update permission
UPDATE_PERMISSION = """
    UPDATE permissions
    SET name = %s, description = %s
    WHERE id = %s
    RETURNING id, name, description, created_at
"""

# Delete permission
DELETE_PERMISSION = """
    DELETE FROM permissions
    WHERE id = %s
"""

