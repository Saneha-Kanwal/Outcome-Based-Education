"""
Configuration Module for OBE System Backend

This module manages all application settings and environment variables.
It uses Pydantic Settings to automatically load and validate configuration
from environment variables or .env file.

The Settings class defines all configuration options with:
- Default values (where appropriate)
- Type validation
- Required/optional fields
- Descriptions for documentation

All settings can be overridden using environment variables or a .env file.

Author: OBE System Development Team
"""

# Import os module for operating system interface
# We use this to access environment variables directly if needed
import os

# Import Path from pathlib for file path operations
# Path provides an object-oriented way to work with file paths
from pathlib import Path

# Import Optional from typing for type hints
# Optional[str] means a variable can be either a string or None
from typing import Optional

# Import BaseSettings from pydantic_settings
# This provides automatic loading and validation of settings from environment variables
from pydantic_settings import BaseSettings

# Import Field from pydantic
# Field allows us to add validation, defaults, and descriptions to settings
from pydantic import Field

# ============================================================================
# PROJECT ROOT AND ENV FILE PATH
# ============================================================================

# Get the project root directory (obebackend/)
# __file__ is the path to this current file (config.py)
# .parent gets the parent directory, so:
#   Path(__file__) = /path/to/obebackend/src/obebackend/config.py
#   .parent = /path/to/obebackend/src/obebackend/
#   .parent.parent = /path/to/obebackend/src/
#   .parent.parent.parent = /path/to/obebackend/
PROJECT_ROOT = Path(__file__).parent.parent.parent

# Define the path to the .env file in the project root
# .env file contains environment variables that override defaults
# Example: /path/to/obebackend/.env
ENV_FILE = PROJECT_ROOT / ".env"

# ============================================================================
# SETTINGS CLASS DEFINITION
# ============================================================================

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    
    This class defines all configuration options for the OBE System.
    Settings are automatically loaded from:
    1. Environment variables (highest priority)
    2. .env file in project root
    3. Default values defined here (lowest priority)
    
    All settings are validated when loaded, ensuring type safety.
    """
    
    # ========================================================================
    # DATABASE CONFIGURATION
    # ========================================================================
    
    # PostgreSQL database connection string
    # Format: postgresql://username:password@host:port/database_name
    # Example: postgresql://user:pass@localhost:5432/obe_db
    # This is REQUIRED (Field(...) means no default, must be provided)
    DATABASE_URL: str = Field(..., description="PostgreSQL connection string")
    
    # ========================================================================
    # JWT (JSON Web Token) CONFIGURATION
    # ========================================================================
    
    # Secret key used to sign and verify JWT tokens
    # IMPORTANT: This must be kept secret and should be a long random string
    # Generate with: openssl rand -hex 32
    # This is REQUIRED for authentication to work
    JWT_SECRET: str = Field(..., description="Secret key for JWT tokens")
    
    # Algorithm used to sign JWT tokens
    # HS256 = HMAC with SHA-256 (symmetric encryption)
    # This is the most common and secure algorithm for JWTs
    # Default is "HS256" if not specified
    JWT_ALGORITHM: str = Field(default="HS256", description="JWT algorithm")
    
    # How long access tokens remain valid (in minutes)
    # Access tokens are short-lived for security
    # After expiry, users must refresh their token
    # Default: 15 minutes (good balance between security and usability)
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = Field(
        default=15, 
        description="Access token expiry in minutes"
    )
    
    # How long refresh tokens remain valid (in days)
    # Refresh tokens are long-lived and used to get new access tokens
    # Users can use refresh tokens to get new access tokens without re-login
    # Default: 7 days
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = Field(
        default=7, 
        description="Refresh token expiry in days"
    )
    
    # ========================================================================
    # GOOGLE OAUTH CONFIGURATION
    # ========================================================================
    
    # Google OAuth 2.0 Client ID
    # This is obtained from Google Cloud Console when setting up OAuth
    # Optional - only needed if Google OAuth login is enabled
    # Format: long string like "123456789-abc.apps.googleusercontent.com"
    GOOGLE_CLIENT_ID: Optional[str] = Field(
        default=None, 
        description="Google OAuth client ID"
    )
    
    # Google OAuth 2.0 Client Secret
    # This is the secret key for your Google OAuth application
    # Must be kept secure - never commit to version control
    # Optional - only needed if Google OAuth login is enabled
    GOOGLE_CLIENT_SECRET: Optional[str] = Field(
        default=None, 
        description="Google OAuth client secret"
    )
    
    # Google OAuth redirect URI
    # This is the URL where Google redirects users after authentication
    # Must match the URI configured in Google Cloud Console
    # Example: http://localhost:8000/api/auth/google/callback
    # Optional - can be auto-generated if not provided
    GOOGLE_REDIRECT_URI: Optional[str] = Field(
        default=None, 
        description="Google OAuth redirect URI"
    )
    
    # ========================================================================
    # EMAIL (SMTP) CONFIGURATION
    # ========================================================================
    
    # SMTP server hostname for sending emails
    # SMTP = Simple Mail Transfer Protocol (how emails are sent)
    # Example: smtp.gmail.com for Gmail, smtp.outlook.com for Outlook
    # Optional - only needed if email features (OTP, notifications) are used
    SMTP_HOST: Optional[str] = Field(
        default=None, 
        description="SMTP server host"
    )
    
    # SMTP server port number
    # Common ports:
    #   587 = Submission port (TLS/STARTTLS) - most common, default
    #   465 = SSL/TLS port (legacy but still used)
    #   25 = Plain SMTP (not recommended, often blocked)
    # Default: 587 (TLS port)
    SMTP_PORT: int = Field(
        default=587, 
        description="SMTP server port"
    )
    
    # SMTP username for authentication
    # This is usually your email address
    # Example: your-email@gmail.com
    # Optional - only needed if SMTP authentication is required
    SMTP_USER: Optional[str] = Field(
        default=None, 
        description="SMTP username"
    )
    
    # SMTP password for authentication
    # This is your email password or an app-specific password
    # For Gmail, you may need to use an "App Password" instead of regular password
    # MUST be kept secure - never commit to version control
    # Optional - only needed if SMTP authentication is required
    SMTP_PASSWORD: Optional[str] = Field(
        default=None, 
        description="SMTP password"
    )
    
    # Email address to use as sender ("From" field)
    # This appears in the "From" field of emails sent by the system
    # Example: noreply@obesystem.com
    # Should match SMTP_USER or be from the same domain
    # Optional - only needed if sending emails
    EMAIL_FROM: Optional[str] = Field(
        default=None, 
        description="Email sender address"
    )
    
    # ========================================================================
    # APPLICATION CONFIGURATION
    # ========================================================================
    
    # Current environment (development/staging/production)
    # This helps us adjust behavior based on environment
    # - development: Local development, verbose logging, relaxed security
    # - staging: Testing environment, similar to production
    # - production: Live environment, strict security, minimal logging
    # Default: "development"
    ENVIRONMENT: str = Field(
        default="development", 
        description="Environment (development/staging/production)"
    )
    
    # Enable or disable debug mode
    # Debug mode enables:
    # - Detailed error messages (including stack traces)
    # - API documentation (Swagger UI) at /docs
    # - More verbose logging
    # - Development-friendly CORS settings
    # Should be False in production for security
    # Default: False
    DEBUG: bool = Field(
        default=False, 
        description="Debug mode"
    )
    
    # Comma-separated list of allowed CORS origins
    # CORS = Cross-Origin Resource Sharing
    # This defines which frontend domains can make requests to the API
    # Example: "http://localhost:5173,https://app.example.com"
    # Default: "http://localhost:5173" (default Vite dev server port)
    CORS_ORIGINS: str = Field(
        default="http://localhost:5173", 
        description="Comma-separated CORS origins"
    )
    
    # ========================================================================
    # PYDANTIC CONFIGURATION CLASS
    # ========================================================================
    
    class Config:
        """
        Pydantic configuration for settings loading.
        
        This nested class configures how Pydantic loads settings from files
        and environment variables.
        """
        
        # Path to the .env file to load settings from
        # We check if ENV_FILE exists, otherwise fall back to ".env"
        # The .env file is loaded automatically if it exists
        env_file = str(ENV_FILE) if ENV_FILE.exists() else ".env"
        
        # Encoding to use when reading the .env file
        # UTF-8 supports all characters including emojis and international text
        env_file_encoding = "utf-8"
        
        # Make field names case-sensitive
        # This means DATABASE_URL != database_url
        # Python convention is to use uppercase for constants/settings
        case_sensitive = True

# ============================================================================
# GLOBAL SETTINGS INSTANCE
# ============================================================================

# Create a global instance of Settings
# This loads all settings from environment variables and .env file
# The instance is created once when this module is imported
# Other modules can import this instance to access settings:
#   from obebackend.config import settings
#   database_url = settings.DATABASE_URL
settings = Settings()

# Note: If any required fields (Field(...)) are missing, Settings() will
# raise a ValidationError immediately when this module is imported.
# This ensures configuration errors are caught early, before the app starts.
