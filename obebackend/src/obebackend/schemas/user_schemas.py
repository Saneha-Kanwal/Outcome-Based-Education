"""Pydantic schemas for user management endpoints."""

from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime


class RoleResponse(BaseModel):
    """Role response schema."""
    id: int
    name: str
    description: Optional[str] = None


class UserResponse(BaseModel):
    """User response schema."""
    id: int
    email: str
    first_name: str
    last_name: str
    role: RoleResponse
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class CreateUserRequest(BaseModel):
    """Create user request schema (Admin only)."""
    email: EmailStr
    password: Optional[str] = Field(None, min_length=8)
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)
    role_id: int

    @validator("password", pre=True, always=True)
    def empty_password_to_none(cls, value):
        if value is None:
            return None
        if isinstance(value, str):
            value = value.strip()
            if not value:
                return None
        return value


class UpdateUserRequest(BaseModel):
    """Update user request schema."""
    email: Optional[EmailStr] = None
    first_name: Optional[str] = Field(None, min_length=1)
    last_name: Optional[str] = Field(None, min_length=1)
    role_id: Optional[int] = None
    is_active: Optional[bool] = None

    @validator("email", pre=True)
    def empty_email_to_none(cls, value):
        if value is None:
            return None
        if isinstance(value, str):
            value = value.strip()
            if not value:
                return None
        return value


class UserListResponse(BaseModel):
    """Paginated user list response schema."""
    users: list[UserResponse]
    total: int
    page: int
    per_page: int
    total_pages: int

