"""SQL queries for User entity."""

# Get user by ID
GET_USER_BY_ID = """
    SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name,
           u.role_id, u.is_active, u.created_at, u.updated_at,
           r.id as role_id, r.name as role_name, r.description as role_description
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE u.id = %s
"""

# Get user by email
GET_USER_BY_EMAIL = """
    SELECT u.id, u.email, u.password_hash, u.first_name, u.last_name,
           u.role_id, u.is_active, u.created_at, u.updated_at,
           r.id as role_id, r.name as role_name, r.description as role_description
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE u.email = %s
"""

# Get all users with pagination
GET_ALL_USERS = """
    SELECT u.id, u.email, u.first_name, u.last_name,
           u.role_id, u.is_active, u.created_at, u.updated_at,
           r.id as role_id, r.name as role_name, r.description as role_description
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE (%s IS NULL OR r.name = %s)
      AND (%s IS NULL OR u.email ILIKE %s OR u.first_name ILIKE %s OR u.last_name ILIKE %s)
    ORDER BY u.created_at DESC
    LIMIT %s OFFSET %s
"""

# Count all users
COUNT_USERS = """
    SELECT COUNT(*) as total
    FROM users u
    INNER JOIN roles r ON u.role_id = r.id
    WHERE (%s IS NULL OR r.name = %s)
      AND (%s IS NULL OR u.email ILIKE %s OR u.first_name ILIKE %s OR u.last_name ILIKE %s)
"""

# Create user
CREATE_USER = """
    INSERT INTO users (email, password_hash, first_name, last_name, role_id)
    VALUES (%s, %s, %s, %s, %s)
    RETURNING id, email, first_name, last_name, role_id, is_active, created_at, updated_at
"""

# Update user
UPDATE_USER = """
    UPDATE users
    SET email = COALESCE(%s, email),
        first_name = COALESCE(%s, first_name),
        last_name = COALESCE(%s, last_name),
        role_id = COALESCE(%s, role_id),
        is_active = COALESCE(%s, is_active),
        updated_at = CURRENT_TIMESTAMP
    WHERE id = %s
    RETURNING id, email, first_name, last_name, role_id, is_active, created_at, updated_at
"""

# Update user password
UPDATE_USER_PASSWORD = """
    UPDATE users
    SET password_hash = %s,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = %s
"""

# Delete user
DELETE_USER = """
    DELETE FROM users
    WHERE id = %s
"""

