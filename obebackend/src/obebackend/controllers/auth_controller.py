"""Authentication controller for OBE System."""

from typing import Optional, Dict, Any
import logging

from obebackend.database.connection import get_db_connection
from obebackend.database.queries import (
    user_queries,
    otp_queries,
    oauth_token_queries,
    role_queries
)
from obebackend.utils.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
    verify_token
)
from obebackend.utils.otp import (
    generate_otp_code,
    hash_otp_code,
    verify_otp_code,
    get_otp_expiry,
    is_otp_expired
)
from obebackend.utils.oauth import verify_google_token, exchange_code_for_token
from obebackend.utils.email import send_otp_email
from obebackend.utils.validators import (
    validate_email_format,
    validate_password_strength,
    validate_name,
    validate_otp_code
)
from obebackend.middleware.error_handler import AppException

logger = logging.getLogger(__name__)

# Default role ID for new users (Student)
DEFAULT_ROLE_ID = 3


def register_user(email: str, password: str, first_name: str, last_name: str, role_id: Optional[int] = None) -> Dict[str, Any]:
    """
    Register a new user.
    
    Args:
        email: User email
        password: Plain text password
        first_name: User's first name
        last_name: User's last name
        role_id: Optional role ID (defaults to Student)
        
    Returns:
        Dictionary with user data and tokens
        
    Raises:
        AppException: If validation fails or user already exists
    """
    # Validate inputs
    is_valid, error = validate_email_format(email)
    if not is_valid:
        raise AppException(error, status_code=400, error_code="INVALID_EMAIL")
    
    is_valid, error = validate_password_strength(password)
    if not is_valid:
        raise AppException(error, status_code=400, error_code="WEAK_PASSWORD")
    
    is_valid, error = validate_name(first_name, "First name")
    if not is_valid:
        raise AppException(error, status_code=400, error_code="INVALID_NAME")
    
    is_valid, error = validate_name(last_name, "Last name")
    if not is_valid:
        raise AppException(error, status_code=400, error_code="INVALID_NAME")
    
    # Check if user already exists
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(user_queries.GET_USER_BY_EMAIL, (email,))
        existing_user = cursor.fetchone()
        
        if existing_user:
            raise AppException("Email already registered", status_code=409, error_code="EMAIL_EXISTS")
        
        # Use provided role_id or default to Student
        final_role_id = role_id or DEFAULT_ROLE_ID
        
        # Verify role exists
        cursor.execute(role_queries.GET_ROLE_BY_ID, (final_role_id,))
        role = cursor.fetchone()
        if not role:
            raise AppException("Invalid role ID", status_code=400, error_code="INVALID_ROLE")
        
        # Hash password
        password_hash = hash_password(password)
        
        # Create user
        cursor.execute(
            user_queries.CREATE_USER,
            (email, password_hash, first_name, last_name, final_role_id)
        )
        user_row = cursor.fetchone()
        conn.commit()
        
        # Get full user data with role
        cursor.execute(user_queries.GET_USER_BY_ID, (user_row[0],))
        user_data = cursor.fetchone()
        
        # Create tokens
        token_data = {
            "user_id": user_data[0],
            "email": user_data[1],
            "role_id": user_data[5]
        }
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user_data[0],
                "email": user_data[1],
                "first_name": user_data[3],
                "last_name": user_data[4],
                "role": {
                    "id": user_data[9],  # r.id (role id from roles table)
                    "name": user_data[10],  # r.name (role_name)
                    "description": user_data[11]  # r.description (role_description)
                },
                "is_active": user_data[6],
                "created_at": user_data[7]
            }
        }


def login_user(email: str, password: str) -> Dict[str, Any]:
    """
    Authenticate user with email and password.
    
    Args:
        email: User email
        password: Plain text password
        
    Returns:
        Dictionary with user data and tokens
        
    Raises:
        AppException: If credentials are invalid
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(user_queries.GET_USER_BY_EMAIL, (email,))
        user_data = cursor.fetchone()
        
        if not user_data:
            raise AppException("Invalid email or password", status_code=401, error_code="INVALID_CREDENTIALS")
        
        # Check if user is active
        if not user_data[6]:  # is_active
            raise AppException("User account is inactive", status_code=403, error_code="ACCOUNT_INACTIVE")
        
        # Verify password
        password_hash = user_data[2]
        if not password_hash or not verify_password(password, password_hash):
            raise AppException("Invalid email or password", status_code=401, error_code="INVALID_CREDENTIALS")
        
        # Create tokens
        token_data = {
            "user_id": user_data[0],
            "email": user_data[1],
            "role_id": user_data[5]
        }
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user_data[0],
                "email": user_data[1],
                "first_name": user_data[3],
                "last_name": user_data[4],
                "role": {
                    "id": user_data[9],  # r.id (role id from roles table)
                    "name": user_data[10],  # r.name (role_name)
                    "description": user_data[11]  # r.description (role_description)
                },
                "is_active": user_data[6],
                "created_at": user_data[7]
            }
        }


def login_with_google(code: str) -> Dict[str, Any]:
    """
    Authenticate user with Google OAuth.
    
    Args:
        code: Google OAuth authorization code
        
    Returns:
        Dictionary with user data and tokens
        
    Raises:
        AppException: If OAuth fails or user not found
    """
    # Exchange code for token and get user info
    oauth_data = exchange_code_for_token(code)
    if not oauth_data:
        raise AppException("Google OAuth authentication failed", status_code=401, error_code="OAUTH_FAILED")
    
    user_info = oauth_data.get("user_info")
    email = user_info.get("email")
    
    if not email:
        raise AppException("Email not provided by Google", status_code=400, error_code="NO_EMAIL")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute(user_queries.GET_USER_BY_EMAIL, (email,))
        user_data = cursor.fetchone()
        
        if not user_data:
            # Create new user with default role (Student)
            first_name = user_info.get("given_name", "User")
            last_name = user_info.get("family_name", "")
            
            cursor.execute(
                user_queries.CREATE_USER,
                (email, None, first_name, last_name, DEFAULT_ROLE_ID)  # No password for OAuth users
            )
            user_row = cursor.fetchone()
            
            # Get full user data
            cursor.execute(user_queries.GET_USER_BY_ID, (user_row[0],))
            user_data = cursor.fetchone()
        
        # Store/update OAuth tokens
        cursor.execute(
            oauth_token_queries.UPSERT_OAUTH_TOKEN,
            (
                user_data[0],  # user_id
                "google",
                oauth_data["access_token"],
                oauth_data.get("refresh_token"),
                oauth_data["expires_at"]
            )
        )
        conn.commit()
        
        # Create JWT tokens
        token_data = {
            "user_id": user_data[0],
            "email": user_data[1],
            "role_id": user_data[5]
        }
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user_data[0],
                "email": user_data[1],
                "first_name": user_data[3],
                "last_name": user_data[4],
                "role": {
                    "id": user_data[9],  # r.id (role id from roles table)
                    "name": user_data[10],  # r.name (role_name)
                    "description": user_data[11]  # r.description (role_description)
                },
                "is_active": user_data[6],
                "created_at": user_data[7]
            }
        }


def request_otp(email: str) -> Dict[str, str]:
    """
    Request OTP code for email-based login.
    
    Args:
        email: User email
        
    Returns:
        Dictionary with success message
        
    Raises:
        AppException: If email is invalid or rate limit exceeded
    """
    # Validate email
    is_valid, error = validate_email_format(email)
    if not is_valid:
        raise AppException(error, status_code=400, error_code="INVALID_EMAIL")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Rate limiting: Check OTP requests in last 15 minutes
        cursor.execute(otp_queries.COUNT_OTPS_BY_EMAIL_RECENT, (email,))
        count_result = cursor.fetchone()
        recent_count = count_result[0] if count_result else 0
        
        if recent_count >= 3:
            raise AppException(
                "Too many OTP requests. Please wait 15 minutes.",
                status_code=429,
                error_code="RATE_LIMIT_EXCEEDED"
            )
        
        # Check if user exists (optional - allow OTP for unregistered users)
        cursor.execute(user_queries.GET_USER_BY_EMAIL, (email,))
        user_data = cursor.fetchone()
        user_id = user_data[0] if user_data else None
        
        # Generate OTP
        otp_code = generate_otp_code()
        hashed_code = hash_otp_code(otp_code)
        expires_at = get_otp_expiry(minutes=10)
        
        # Store OTP
        cursor.execute(
            otp_queries.CREATE_OTP,
            (user_id, email, hashed_code, expires_at)
        )
        conn.commit()
        
        # Send OTP via email
        send_otp_email(email, otp_code)
        
        return {"message": "OTP sent to email"}


def verify_otp(email: str, code: str) -> Dict[str, Any]:
    """
    Verify OTP and login user.
    
    Args:
        email: User email
        code: OTP code
        
    Returns:
        Dictionary with user data and tokens
        
    Raises:
        AppException: If OTP is invalid or expired
    """
    # Validate inputs
    is_valid, error = validate_email_format(email)
    if not is_valid:
        raise AppException(error, status_code=400, error_code="INVALID_EMAIL")
    
    is_valid, error = validate_otp_code(code)
    if not is_valid:
        raise AppException(error, status_code=400, error_code="INVALID_OTP_FORMAT")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Get OTP
        cursor.execute(otp_queries.GET_OTP_BY_EMAIL_CODE, (email, hash_otp_code(code)))
        otp_data = cursor.fetchone()
        
        if not otp_data:
            raise AppException("Invalid OTP code", status_code=401, error_code="INVALID_OTP")
        
        # Check if already used
        if otp_data[5]:  # used
            raise AppException("OTP code already used", status_code=401, error_code="OTP_USED")
        
        # Check if expired
        if is_otp_expired(otp_data[4]):  # expires_at
            raise AppException("OTP code expired", status_code=401, error_code="OTP_EXPIRED")
        
        # Mark OTP as used
        cursor.execute(otp_queries.MARK_OTP_AS_USED, (otp_data[0],))
        
        # Get or create user
        user_id = otp_data[1]  # user_id from OTP
        
        if user_id:
            cursor.execute(user_queries.GET_USER_BY_ID, (user_id,))
            user_data = cursor.fetchone()
        else:
            # Create new user with default role
            cursor.execute(
                user_queries.CREATE_USER,
                (email, None, "User", "", DEFAULT_ROLE_ID)  # No password, minimal name
            )
            user_row = cursor.fetchone()
            cursor.execute(user_queries.GET_USER_BY_ID, (user_row[0],))
            user_data = cursor.fetchone()
        
        conn.commit()
        
        # Create tokens
        token_data = {
            "user_id": user_data[0],
            "email": user_data[1],
            "role_id": user_data[5]
        }
        
        access_token = create_access_token(token_data)
        refresh_token = create_refresh_token(token_data)
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "user": {
                "id": user_data[0],
                "email": user_data[1],
                "first_name": user_data[3],
                "last_name": user_data[4],
                "role": {
                    "id": user_data[9],  # r.id (role id from roles table)
                    "name": user_data[10],  # r.name (role_name)
                    "description": user_data[11]  # r.description (role_description)
                },
                "is_active": user_data[6],
                "created_at": user_data[7]
            }
        }


def refresh_access_token(refresh_token: str) -> Dict[str, str]:
    """
    Refresh access token using refresh token.
    
    Args:
        refresh_token: Refresh token string
        
    Returns:
        Dictionary with new access token and optional new refresh token
        
    Raises:
        AppException: If refresh token is invalid
    """
    # Verify refresh token
    payload = verify_token(refresh_token, token_type="refresh")
    if payload is None:
        raise AppException("Invalid refresh token", status_code=401, error_code="INVALID_REFRESH_TOKEN")
    
    user_id = payload.get("user_id") or payload.get("sub")
    if not user_id:
        raise AppException("Invalid token payload", status_code=401, error_code="INVALID_TOKEN")
    
    # Get user to verify still exists and active
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(user_queries.GET_USER_BY_ID, (user_id,))
        user_data = cursor.fetchone()
        
        if not user_data:
            raise AppException("User not found", status_code=404, error_code="USER_NOT_FOUND")
        
        if not user_data[6]:  # is_active
            raise AppException("User account is inactive", status_code=403, error_code="ACCOUNT_INACTIVE")
        
        # Create new tokens
        token_data = {
            "user_id": user_data[0],
            "email": user_data[1],
            "role_id": user_data[5]
        }
        
        access_token = create_access_token(token_data)
        new_refresh_token = create_refresh_token(token_data)
        
        return {
            "access_token": access_token,
            "refresh_token": new_refresh_token
        }

