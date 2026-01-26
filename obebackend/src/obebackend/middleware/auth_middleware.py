"""JWT authentication middleware for OBE System."""

from fastapi import Request, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import logging

from obebackend.utils.security import verify_token
from obebackend.database.connection import get_db_connection
from obebackend.database.queries import user_queries

logger = logging.getLogger(__name__)

security = HTTPBearer()


async def get_current_user(request: Request) -> Optional[dict]:
    """
    Extract and verify JWT token from request, return current user.
    
    Args:
        request: FastAPI request object
        
    Returns:
        User dictionary if token is valid, None otherwise
    """
    try:
        # Get token from Authorization header
        authorization = request.headers.get("Authorization")
        if not authorization:
            logger.warning("Authorization header missing for %s %s", request.method, request.url.path)
            return None
        
        # Extract token (Bearer <token>)
        try:
            scheme, token = authorization.split()
        except ValueError:
            logger.warning("Invalid Authorization header format for %s %s: %s", request.method, request.url.path, authorization)
            return None
        if scheme.lower() != "bearer":
            logger.warning("Unsupported auth scheme '%s' for %s %s", scheme, request.method, request.url.path)
            return None
        
        # Verify token
        payload = verify_token(token, token_type="access")
        if payload is None:
            logger.warning("Token verification failed for %s %s", request.method, request.url.path)
            return None
        
        # Get user from database
        user_id = payload.get("user_id") or payload.get("sub")
        if not user_id:
            return None
        
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
            # Convert row to dictionary
            user = {
                "id": row[0],
                "email": row[1],
                "first_name": row[3],
                "last_name": row[4],
                "role_id": row[5],
                "is_active": row[6],
                "role": {
                    "id": row[9],  # r.id (role id from roles table)
                    "name": row[10],  # r.name (role_name)
                    "description": row[11]  # r.description (role_description)
                }
            }
            logger.debug("Authenticated user: id=%s role=%s path=%s", user["id"], user["role"]["name"], request.url.path)
            
            if not user["is_active"]:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="User account is inactive"
                )
            
            return user
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error in get_current_user: {e}")
        return None


async def require_auth(request: Request) -> dict:
    """
    Require authentication - raise exception if not authenticated.
    
    Args:
        request: FastAPI request object
        
    Returns:
        User dictionary
        
    Raises:
        HTTPException: If user is not authenticated
    """
    user = await get_current_user(request)
    
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return user

