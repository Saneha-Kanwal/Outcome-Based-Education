"""User management routes for OBE System."""

from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import Optional

from obebackend.schemas.user_schemas import (
    UserResponse,
    CreateUserRequest,
    UpdateUserRequest,
    UserListResponse
)
from obebackend.controllers.user_controller import (
    get_user_by_id,
    get_users,
    create_user,
    update_user,
    delete_user
)
from obebackend.middleware.auth_middleware import require_auth
from obebackend.middleware.rbac_middleware import require_admin, require_admin_or_teacher
from obebackend.middleware.error_handler import AppException

router = APIRouter()


@router.get("", response_model=UserListResponse)
async def list_users(
    role: Optional[str] = Query(None, description="Filter by role name"),
    search: Optional[str] = Query(None, description="Search by email, first name, or last name"),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=100, description="Items per page"),
    current_user: dict = Depends(require_admin)
):
    """
    List all users (Admin only).
    
    Returns paginated list of users with optional filtering.
    """
    try:
        result = get_users(role_filter=role, search=search, page=page, per_page=per_page)
        return result
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    current_user: dict = Depends(require_auth)
):
    """
    Get user by ID.
    
    Users can view their own profile, admins can view any user.
    """
    try:
        # Allow users to view their own profile, or require admin for others
        if current_user["id"] != user_id and current_user.get("role", {}).get("name") != "Admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        user = get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    except HTTPException:
        raise
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def create_new_user(
    request: CreateUserRequest,
    current_user: dict = Depends(require_admin)
):
    """
    Create a new user (Admin only).
    """
    try:
        result = create_user(
            email=request.email,
            first_name=request.first_name,
            last_name=request.last_name,
            role_id=request.role_id,
            password=request.password
        )
        return result
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.put("/{user_id}", response_model=UserResponse)
async def update_existing_user(
    user_id: int,
    request: UpdateUserRequest,
    current_user: dict = Depends(require_auth)
):
    """
    Update user information.
    
    Users can update their own profile, admins can update any user.
    """
    try:
        # Allow users to update their own profile, or require admin for others
        if current_user["id"] != user_id and current_user.get("role", {}).get("name") != "Admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        result = update_user(
            user_id=user_id,
            email=request.email,
            first_name=request.first_name,
            last_name=request.last_name,
            role_id=request.role_id,
            is_active=request.is_active
        )
        return result
    except HTTPException:
        raise
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_user(
    user_id: int,
    current_user: dict = Depends(require_admin)
):
    """
    Delete a user (Admin only).
    """
    try:
        delete_user(user_id)
        return None
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/{user_id}/profile", response_model=UserResponse)
async def get_user_profile(
    user_id: int,
    current_user: dict = Depends(require_auth)
):
    """
    Get user profile.
    
    Users can view their own profile, admins can view any profile.
    """
    try:
        if current_user["id"] != user_id and current_user.get("role", {}).get("name") != "Admin":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )
        
        user = get_user_by_id(user_id)
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    except HTTPException:
        raise
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

