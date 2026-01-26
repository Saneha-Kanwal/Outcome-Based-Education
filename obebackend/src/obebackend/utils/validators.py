"""Input validation utilities."""

import re
from typing import Optional
from email_validator import validate_email, EmailNotValidError


def validate_email_format(email: str) -> tuple[bool, Optional[str]]:
    """
    Validate email format.
    
    Args:
        email: Email address to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not email:
        return False, "Email is required"
    
    try:
        validate_email(email)
        return True, None
    except EmailNotValidError as e:
        return False, str(e)


def validate_password_strength(password: str) -> tuple[bool, Optional[str]]:
    """
    Validate password strength.
    
    Args:
        password: Password to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not password:
        return False, "Password is required"
    
    if len(password) < 8:
        return False, "Password must be at least 8 characters long"
    
    return True, None


def validate_name(name: str, field_name: str = "Name") -> tuple[bool, Optional[str]]:
    """
    Validate name field.
    
    Args:
        name: Name to validate
        field_name: Name of the field (for error messages)
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not name or not name.strip():
        return False, f"{field_name} is required"
    
    if len(name.strip()) < 2:
        return False, f"{field_name} must be at least 2 characters long"
    
    return True, None


def validate_otp_code(code: str) -> tuple[bool, Optional[str]]:
    """
    Validate OTP code format (6 digits).
    
    Args:
        code: OTP code to validate
        
    Returns:
        Tuple of (is_valid, error_message)
    """
    if not code:
        return False, "OTP code is required"
    
    if not re.match(r'^\d{6}$', code):
        return False, "OTP code must be exactly 6 digits"
    
    return True, None

