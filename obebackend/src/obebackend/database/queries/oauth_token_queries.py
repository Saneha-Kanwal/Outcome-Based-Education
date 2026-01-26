"""SQL queries for OAuthToken entity."""

# Get OAuth token by user ID and provider
GET_OAUTH_TOKEN_BY_USER_PROVIDER = """
    SELECT id, user_id, provider, access_token, refresh_token, expires_at, created_at, updated_at
    FROM oauth_tokens
    WHERE user_id = %s AND provider = %s
    ORDER BY created_at DESC
    LIMIT 1
"""

# Get valid OAuth token by user ID
GET_VALID_OAUTH_TOKEN = """
    SELECT id, user_id, provider, access_token, refresh_token, expires_at, created_at, updated_at
    FROM oauth_tokens
    WHERE user_id = %s
      AND provider = %s
      AND expires_at > CURRENT_TIMESTAMP
    ORDER BY created_at DESC
    LIMIT 1
"""

# Create or update OAuth token
UPSERT_OAUTH_TOKEN = """
    INSERT INTO oauth_tokens (user_id, provider, access_token, refresh_token, expires_at)
    VALUES (%s, %s, %s, %s, %s)
    ON CONFLICT (user_id, provider) DO UPDATE
    SET access_token = EXCLUDED.access_token,
        refresh_token = EXCLUDED.refresh_token,
        expires_at = EXCLUDED.expires_at,
        updated_at = CURRENT_TIMESTAMP
    RETURNING id, user_id, provider, access_token, refresh_token, expires_at, created_at, updated_at
"""

# Update OAuth token
UPDATE_OAUTH_TOKEN = """
    UPDATE oauth_tokens
    SET access_token = %s,
        refresh_token = COALESCE(%s, refresh_token),
        expires_at = %s,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = %s
    RETURNING id, user_id, provider, access_token, refresh_token, expires_at, created_at, updated_at
"""

# Delete OAuth token
DELETE_OAUTH_TOKEN = """
    DELETE FROM oauth_tokens
    WHERE id = %s
"""

# Delete expired OAuth tokens
DELETE_EXPIRED_OAUTH_TOKENS = """
    DELETE FROM oauth_tokens
    WHERE expires_at < CURRENT_TIMESTAMP
"""

