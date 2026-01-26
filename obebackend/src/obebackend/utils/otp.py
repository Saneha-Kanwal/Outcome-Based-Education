"""OTP generation and validation utilities."""

import secrets
import hashlib
from datetime import datetime, timedelta
from typing import Optional
import logging

from obebackend.config import settings

logger = logging.getLogger(__name__)


def generate_otp_code(length: int = 6) -> str:
    """
    Generate a secure random OTP code.
    
    Args:
        length: Length of OTP code (default: 6)
        
    Returns:
        Random numeric OTP code string
    """
    # Generate random number and convert to string with leading zeros
    otp = secrets.randbelow(10 ** length)
    return str(otp).zfill(length)


def hash_otp_code(code: str) -> str:
    """
    Hash an OTP code for storage.
    
    Args:
        code: Plain OTP code
        
    Returns:
        Hashed OTP code (using SHA-256)
    """
    return hashlib.sha256(code.encode()).hexdigest()


def verify_otp_code(plain_code: str, hashed_code: str) -> bool:
    """
    Verify an OTP code against its hash.
    
    Args:
        plain_code: Plain OTP code to verify
        hashed_code: Hashed OTP code to compare against
        
    Returns:
        True if codes match, False otherwise
    """
    hashed_input = hash_otp_code(plain_code)
    return hashed_input == hashed_code


def get_otp_expiry(minutes: int = 10) -> datetime:
    """
    Get OTP expiry timestamp.
    
    Args:
        minutes: Expiry time in minutes (default: 10)
        
    Returns:
        Expiry datetime
    """
    return datetime.utcnow() + timedelta(minutes=minutes)


def is_otp_expired(expires_at: datetime) -> bool:
    """
    Check if OTP has expired.
    
    Args:
        expires_at: Expiry timestamp
        
    Returns:
        True if expired, False otherwise
    """
    return datetime.utcnow() >= expires_at

