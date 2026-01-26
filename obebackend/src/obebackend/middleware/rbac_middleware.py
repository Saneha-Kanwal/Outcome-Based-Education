"""Role-Based Access Control (RBAC) middleware for OBE System."""

from fastapi import Request, HTTPException, status
from typing import List, Optional
import logging

from obebackend.middleware.auth_middleware import require_auth
from obebackend.database.connection import get_db_connection
from obebackend.database.queries import permission_queries

logger = logging.getLogger(__name__)


# Role names
ROLE_ADMIN = "Admin"
ROLE_TEACHER = "Teacher"
ROLE_STUDENT = "Student"


def require_role(allowed_roles: List[str]):
    """
    Decorator/dependency to require specific role(s).
    
    Args:
        allowed_roles: List of role names that are allowed
        
    Returns:
        Dependency function for FastAPI
    """
    async def role_checker(request: Request) -> dict:
        user = await require_auth(request)
        
        user_role = user.get("role", {}).get("name") or user.get("role_name")
        logger.debug("RBAC check: user_id=%s role=%s allowed=%s path=%s", user.get("id"), user_role, allowed_roles, request.url.path)
        
        if user_role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(allowed_roles)}"
            )
        
        return user
    
    return role_checker


def require_permission(permission_name: str):
    """
    Decorator/dependency to require specific permission.
    
    Args:
        permission_name: Name of the required permission
        
    Returns:
        Dependency function for FastAPI
    """
    async def permission_checker(request: Request) -> dict:
        user = await require_auth(request)
        
        # Get user's permissions
        role_id = user.get("role_id") or user.get("role", {}).get("id")
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(permission_queries.GET_PERMISSIONS_BY_ROLE_ID, (role_id,))
            permissions = cursor.fetchall()
            
            permission_names = [perm[1] for perm in permissions]  # perm[1] is name
        
        if permission_name not in permission_names:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required permission: {permission_name}"
            )
        
        return user
    
    return permission_checker


# Convenience functions for common role checks
async def require_admin(request: Request) -> dict:
    """Require Admin role."""
    return await require_role([ROLE_ADMIN])(request)


async def require_teacher(request: Request) -> dict:
    """Require Teacher role."""
    return await require_role([ROLE_TEACHER])(request)


async def require_student(request: Request) -> dict:
    """Require Student role."""
    return await require_role([ROLE_STUDENT])(request)


async def require_admin_or_teacher(request: Request) -> dict:
    """Require Admin or Teacher role."""
    return await require_role([ROLE_ADMIN, ROLE_TEACHER])(request)

