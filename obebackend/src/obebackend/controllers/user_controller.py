"""User management controller for OBE System."""

from typing import Optional, Dict, Any, List
import logging
import math

from obebackend.database.connection import get_db_connection
from obebackend.database.queries import user_queries, role_queries
from obebackend.utils.security import hash_password
from obebackend.utils.validators import (
    validate_email_format,
    validate_password_strength,
    validate_name
)
from obebackend.middleware.error_handler import AppException

logger = logging.getLogger(__name__)


def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    """
    Get user by ID.
    
    Args:
        user_id: User ID
        
    Returns:
        User dictionary or None if not found
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(user_queries.GET_USER_BY_ID, (user_id,))
        row = cursor.fetchone()
        
        if not row:
            return None
        
        # Query returns: u.id, u.email, u.password_hash, u.first_name, u.last_name,
        #                u.role_id, u.is_active, u.created_at, u.updated_at,
        #                r.id as role_id, r.name as role_name, r.description as role_description
        # Indices:       0     1        2               3           4
        #                5           6           7             8
        #                9           10          11
        return {
            "id": row[0],
            "email": row[1],
            "first_name": row[3],
            "last_name": row[4],
            "role": {
                "id": row[9],  # r.id (role id from roles table)
                "name": row[10],  # r.name (role_name)
                "description": row[11]  # r.description (role_description)
            },
            "is_active": row[6],
            "created_at": row[7],
            "updated_at": row[8] if len(row) > 8 else None
        }


def get_users(
    role_filter: Optional[str] = None,
    search: Optional[str] = None,
    page: int = 1,
    per_page: int = 20
) -> Dict[str, Any]:
    """
    Get paginated list of users.
    
    Args:
        role_filter: Optional role name filter
        search: Optional search term (email, first_name, last_name)
        page: Page number (1-indexed)
        per_page: Items per page
        
    Returns:
        Dictionary with users list and pagination metadata
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Build search pattern
        search_pattern = None
        if search:
            search_pattern = f"%{search}%"
        
        # Calculate offset
        offset = (page - 1) * per_page
        
        # Get users
        cursor.execute(
            user_queries.GET_ALL_USERS,
            (role_filter, role_filter, search_pattern, search_pattern, search_pattern, search_pattern, per_page, offset)
        )
        rows = cursor.fetchall()
        
        # Count total
        cursor.execute(
            user_queries.COUNT_USERS,
            (role_filter, role_filter, search_pattern, search_pattern, search_pattern, search_pattern)
        )
        count_row = cursor.fetchone()
        total = count_row[0] if count_row else 0
        
        # Format users
        # Query returns: u.id, u.email, u.first_name, u.last_name,
        #                u.role_id, u.is_active, u.created_at, u.updated_at,
        #                r.id as role_id, r.name as role_name, r.description as role_description
        # Indices:       0     1        2               3
        #                4           5           6             7
        #                8           9           10
        users = []
        for row in rows:
            users.append({
                "id": row[0],
                "email": row[1],
                "first_name": row[2],
                "last_name": row[3],
                "role": {
                    "id": row[8],  # r.id (role id from roles table)
                    "name": row[9],  # r.name (role_name)
                    "description": row[10]  # r.description (role_description)
                },
                "is_active": row[5],
                "created_at": row[6],
                "updated_at": row[7] if len(row) > 7 else None
            })
        
        total_pages = math.ceil(total / per_page) if per_page > 0 else 0
        
        return {
            "users": users,
            "total": total,
            "page": page,
            "per_page": per_page,
            "total_pages": total_pages
        }


def create_user(
    email: str,
    first_name: str,
    last_name: str,
    role_id: int,
    password: Optional[str] = None
) -> Dict[str, Any]:
    """
    Create a new user (Admin only).
    
    Args:
        email: User email
        first_name: User's first name
        last_name: User's last name
        role_id: Role ID
        password: Optional password (if not provided, user must use OAuth/OTP)
        
    Returns:
        Created user dictionary
        
    Raises:
        AppException: If validation fails or user already exists
    """
    # Validate inputs
    is_valid, error = validate_email_format(email)
    if not is_valid:
        raise AppException(error, status_code=400, error_code="INVALID_EMAIL")
    
    is_valid, error = validate_name(first_name, "First name")
    if not is_valid:
        raise AppException(error, status_code=400, error_code="INVALID_NAME")
    
    is_valid, error = validate_name(last_name, "Last name")
    if not is_valid:
        raise AppException(error, status_code=400, error_code="INVALID_NAME")
    
    if password:
        is_valid, error = validate_password_strength(password)
        if not is_valid:
            raise AppException(error, status_code=400, error_code="WEAK_PASSWORD")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if email already exists
        cursor.execute(user_queries.GET_USER_BY_EMAIL, (email,))
        if cursor.fetchone():
            raise AppException("Email already exists", status_code=409, error_code="EMAIL_EXISTS")
        
        # Verify role exists
        cursor.execute(role_queries.GET_ROLE_BY_ID, (role_id,))
        if not cursor.fetchone():
            raise AppException("Invalid role ID", status_code=400, error_code="INVALID_ROLE")
        
        # Hash password if provided
        password_hash = hash_password(password) if password else None
        
        # Create user
        cursor.execute(
            user_queries.CREATE_USER,
            (email, password_hash, first_name, last_name, role_id)
        )
        user_row = cursor.fetchone()
        conn.commit()
        
        # Get full user data
        return get_user_by_id(user_row[0])


def update_user(
    user_id: int,
    email: Optional[str] = None,
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    role_id: Optional[int] = None,
    is_active: Optional[bool] = None
) -> Dict[str, Any]:
    """
    Update user information.
    
    Args:
        user_id: User ID
        first_name: Optional new first name
        last_name: Optional new last name
        role_id: Optional new role ID
        is_active: Optional active status
        
    Returns:
        Updated user dictionary
        
    Raises:
        AppException: If user not found or validation fails
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute(user_queries.GET_USER_BY_ID, (user_id,))
        existing_user = cursor.fetchone()
        if not existing_user:
            raise AppException("User not found", status_code=404, error_code="USER_NOT_FOUND")
        
        # Validate inputs if provided
        if email is not None:
            is_valid, error = validate_email_format(email)
            if not is_valid:
                raise AppException(error, status_code=400, error_code="INVALID_EMAIL")

            # Ensure email is not taken by another user
            cursor.execute(user_queries.GET_USER_BY_EMAIL, (email,))
            email_owner = cursor.fetchone()
            if email_owner and email_owner[0] != user_id:
                raise AppException("Email already exists", status_code=409, error_code="EMAIL_EXISTS")

        if first_name is not None:
            is_valid, error = validate_name(first_name, "First name")
            if not is_valid:
                raise AppException(error, status_code=400, error_code="INVALID_NAME")
        
        if last_name is not None:
            is_valid, error = validate_name(last_name, "Last name")
            if not is_valid:
                raise AppException(error, status_code=400, error_code="INVALID_NAME")
        
        if role_id is not None:
            cursor.execute(role_queries.GET_ROLE_BY_ID, (role_id,))
            if not cursor.fetchone():
                raise AppException("Invalid role ID", status_code=400, error_code="INVALID_ROLE")
        
        # Update user
        cursor.execute(
            user_queries.UPDATE_USER,
            (email, first_name, last_name, role_id, is_active, user_id)
        )
        updated_row = cursor.fetchone()
        conn.commit()
        
        # Get full user data
        return get_user_by_id(user_id)


def delete_user(user_id: int) -> None:
    """
    Delete a user (Admin only).
    
    Args:
        user_id: User ID to delete
        
    Raises:
        AppException: If user not found
    """
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute(user_queries.GET_USER_BY_ID, (user_id,))
        if not cursor.fetchone():
            raise AppException("User not found", status_code=404, error_code="USER_NOT_FOUND")
        
        # Delete user (cascade will handle related records)
        cursor.execute(user_queries.DELETE_USER, (user_id,))
        conn.commit()

