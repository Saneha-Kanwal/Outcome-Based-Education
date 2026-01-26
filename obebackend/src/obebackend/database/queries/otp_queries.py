"""SQL queries for OTP entity."""

# Get OTP by email and code
GET_OTP_BY_EMAIL_CODE = """
    SELECT id, user_id, email, code, expires_at, used, created_at
    FROM otps
    WHERE email = %s AND code = %s
    ORDER BY created_at DESC
    LIMIT 1
"""

# Get active OTP by email
GET_ACTIVE_OTP_BY_EMAIL = """
    SELECT id, user_id, email, code, expires_at, used, created_at
    FROM otps
    WHERE email = %s
      AND used = FALSE
      AND expires_at > CURRENT_TIMESTAMP
    ORDER BY created_at DESC
    LIMIT 1
"""

# Create OTP
CREATE_OTP = """
    INSERT INTO otps (user_id, email, code, expires_at)
    VALUES (%s, %s, %s, %s)
    RETURNING id, user_id, email, code, expires_at, used, created_at
"""

# Mark OTP as used
MARK_OTP_AS_USED = """
    UPDATE otps
    SET used = TRUE
    WHERE id = %s
"""

# Delete expired OTPs
DELETE_EXPIRED_OTPS = """
    DELETE FROM otps
    WHERE expires_at < CURRENT_TIMESTAMP
"""

# Count OTPs for email in time window (for rate limiting)
COUNT_OTPS_BY_EMAIL_RECENT = """
    SELECT COUNT(*) as count
    FROM otps
    WHERE email = %s
      AND created_at > CURRENT_TIMESTAMP - INTERVAL '15 minutes'
"""

