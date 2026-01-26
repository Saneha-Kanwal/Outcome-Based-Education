"""Pydantic schemas for authentication endpoints."""

from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class RegisterRequest(BaseModel):
    """User registration request schema."""
    email: EmailStr
    password: str = Field(..., min_length=8, description="Password must be at least 8 characters")
    first_name: str = Field(..., min_length=1)
    last_name: str = Field(..., min_length=1)
    role_id: Optional[int] = None  # Default role if not provided


class LoginRequest(BaseModel):
    """User login request schema."""
    email: EmailStr
    password: str


class GoogleOAuthRequest(BaseModel):
    """Google OAuth callback request schema."""
    code: str = Field(..., description="OAuth authorization code")


class OTPRequestRequest(BaseModel):
    """OTP request schema."""
    email: EmailStr


class OTPVerifyRequest(BaseModel):
    """OTP verification request schema."""
    email: EmailStr
    code: str = Field(..., pattern=r'^\d{6}$', description="6-digit OTP code")


class RefreshTokenRequest(BaseModel):
    """Token refresh request schema."""
    refresh_token: str


class TokenResponse(BaseModel):
    """Token response schema."""
    access_token: str
    refresh_token: Optional[str] = None


# UserResponse will be imported where needed to avoid circular imports
# For now, use dict type hint
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from obebackend.schemas.user_schemas import UserResponse


class AuthResponse(BaseModel):
    """Authentication response schema."""
    access_token: str
    refresh_token: str
    user: dict  # Will be UserResponse, using dict to avoid circular import

