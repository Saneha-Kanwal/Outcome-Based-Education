"""SQL queries for Role-Permission junction table."""

# Get role-permission relationship
GET_ROLE_PERMISSION = """
    SELECT id, role_id, permission_id, created_at
    FROM role_permissions
    WHERE role_id = %s AND permission_id = %s
"""

# Get all role-permission relationships
GET_ALL_ROLE_PERMISSIONS = """
    SELECT id, role_id, permission_id, created_at
    FROM role_permissions
    ORDER BY role_id, permission_id
"""

# Create role-permission relationship
CREATE_ROLE_PERMISSION = """
    INSERT INTO role_permissions (role_id, permission_id)
    VALUES (%s, %s)
    RETURNING id, role_id, permission_id, created_at
"""

# Delete role-permission relationship
DELETE_ROLE_PERMISSION = """
    DELETE FROM role_permissions
    WHERE role_id = %s AND permission_id = %s
"""

# Delete all permissions for a role
DELETE_ALL_ROLE_PERMISSIONS = """
    DELETE FROM role_permissions
    WHERE role_id = %s
"""

