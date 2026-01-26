"""Authentication routes for OBE System."""

from fastapi import APIRouter, Depends, HTTPException, status, Request, Query
from fastapi.responses import RedirectResponse
from fastapi.security import HTTPBearer
import base64
import json
from urllib.parse import quote

from obebackend.schemas.auth_schemas import (
    RegisterRequest,
    LoginRequest,
    GoogleOAuthRequest,
    OTPRequestRequest,
    OTPVerifyRequest,
    RefreshTokenRequest,
    AuthResponse,
    TokenResponse
)
from obebackend.controllers.auth_controller import (
    register_user,
    login_user,
    login_with_google,
    request_otp,
    verify_otp,
    refresh_access_token
)
from obebackend.middleware.error_handler import AppException

router = APIRouter()
security = HTTPBearer()


@router.post("/register", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
async def register(request: RegisterRequest):
    """
    Register a new user.
    
    Creates a new user account and returns authentication tokens.
    """
    try:
        result = register_user(
            email=request.email,
            password=request.password,
            first_name=request.first_name,
            last_name=request.last_name,
            role_id=request.role_id
        )
        return result
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """
    Login with email and password.
    
    Authenticates user and returns JWT tokens.
    """
    try:
        result = login_user(email=request.email, password=request.password)
        return result
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/google/callback")
async def google_oauth_callback(
    code: str = Query(..., description="Google OAuth authorization code"),
    error: str = Query(None, description="Error from Google OAuth")
):
    """
    Google OAuth callback endpoint (GET).
    
    Handles the redirect from Google after user authorization.
    Redirects to frontend with tokens or error.
    """
    from obebackend.config import settings
    
    if error:
        # Redirect to frontend with error
        frontend_url = settings.CORS_ORIGINS.split(',')[0] if settings.CORS_ORIGINS else "http://localhost:5173"
        return RedirectResponse(
            url=f"{frontend_url}/login?error={error}",
            status_code=302
        )
    
    try:
        result = login_with_google(code=code)
        
        # Redirect to frontend with tokens in URL (or use a better method)
        frontend_url = settings.CORS_ORIGINS.split(',')[0] if settings.CORS_ORIGINS else "http://localhost:5173"
        user_payload = base64.urlsafe_b64encode(json.dumps(result["user"], default=str).encode()).decode()
        redirect_query = (
            f"access_token={quote(result['access_token'])}"
            f"&refresh_token={quote(result['refresh_token'])}"
            f"&user={quote(user_payload)}"
        )
        return RedirectResponse(
            url=f"{frontend_url}/auth/google/callback?{redirect_query}",
            status_code=302
        )
    except AppException as e:
        frontend_url = settings.CORS_ORIGINS.split(',')[0] if settings.CORS_ORIGINS else "http://localhost:5173"
        return RedirectResponse(
            url=f"{frontend_url}/login?error={e.message}",
            status_code=302
        )


@router.post("/google", response_model=AuthResponse)
async def google_oauth(request: GoogleOAuthRequest):
    """
    Google OAuth authentication (POST).
    
    Authenticates user via Google OAuth and returns JWT tokens.
    This endpoint is used when the frontend sends the code directly.
    """
    try:
        result = login_with_google(code=request.code)
        return result
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/otp/request")
async def otp_request(request: OTPRequestRequest):
    """
    Request OTP code via email.
    
    Generates and sends a 6-digit OTP code to the user's email.
    """
    try:
        result = request_otp(email=request.email)
        return result
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/otp/verify", response_model=AuthResponse)
async def otp_verify(request: OTPVerifyRequest):
    """
    Verify OTP and login.
    
    Verifies the OTP code and authenticates the user.
    """
    try:
        result = verify_otp(email=request.email, code=request.code)
        return result
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/refresh", response_model=TokenResponse)
async def refresh(request: RefreshTokenRequest):
    """
    Refresh JWT access token.
    
    Generates a new access token using a valid refresh token.
    """
    try:
        result = refresh_access_token(refresh_token=request.refresh_token)
        return result
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/logout")
async def logout():
    """
    Logout (invalidate token).
    
    Note: With JWT, logout is handled client-side by removing tokens.
    This endpoint exists for consistency and future token blacklisting.
    """
    return {"message": "Logged out successfully"}

