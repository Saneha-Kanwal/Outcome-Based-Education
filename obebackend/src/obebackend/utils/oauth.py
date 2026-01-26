"""Google OAuth2 handling utilities."""

from typing import Optional, Dict, Any
from google.auth.transport.requests import Request
from google.oauth2 import id_token
import google.auth
import logging

from obebackend.config import settings

logger = logging.getLogger(__name__)


def verify_google_token(token: str) -> Optional[Dict[str, Any]]:
    """
    Verify a Google OAuth ID token and extract user information.
    
    Args:
        token: Google OAuth ID token
        
    Returns:
        Dictionary with user info (email, name, etc.) if valid, None otherwise
    """
    try:
        # Verify the token
        idinfo = id_token.verify_oauth2_token(
            token,
            Request(),
            settings.GOOGLE_CLIENT_ID
        )
        
        # Check if token is from the correct issuer
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            logger.warning(f"Invalid token issuer: {idinfo['iss']}")
            return None
        
        return {
            'email': idinfo.get('email'),
            'name': idinfo.get('name'),
            'given_name': idinfo.get('given_name'),
            'family_name': idinfo.get('family_name'),
            'picture': idinfo.get('picture'),
            'sub': idinfo.get('sub'),  # Google user ID
        }
    except ValueError as e:
        logger.error(f"Google token verification failed: {e}")
        return None
    except Exception as e:
        logger.error(f"Unexpected error verifying Google token: {e}")
        return None


def get_google_oauth_url() -> str:
    """
    Generate Google OAuth authorization URL.
    
    Returns:
        OAuth authorization URL
    """
    from google_auth_oauthlib.flow import Flow
    from google.oauth2.credentials import Credentials
    
    # This would typically be handled by the frontend
    # Backend receives the authorization code from the callback
    pass


def exchange_code_for_token(code: str) -> Optional[Dict[str, Any]]:
    """
    Exchange Google OAuth authorization code for tokens.
    
    Args:
        code: Authorization code from Google
        
    Returns:
        Dictionary with access_token, refresh_token, and user info if successful
    """
    try:
        from google_auth_oauthlib.flow import Flow
        from google.oauth2.credentials import Credentials
        
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [settings.GOOGLE_REDIRECT_URI]
                }
            },
            scopes=['openid', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']
        )
        
        flow.redirect_uri = settings.GOOGLE_REDIRECT_URI
        
        # Exchange code for token
        flow.fetch_token(code=code)
        
        credentials = flow.credentials
        
        # Get user info
        user_info = verify_google_token(credentials.id_token)
        
        if user_info:
            return {
                'access_token': credentials.token,
                'refresh_token': credentials.refresh_token,
                'expires_at': credentials.expiry,
                'user_info': user_info
            }
        
        return None
    except Exception as e:
        logger.error(f"Error exchanging Google OAuth code: {e}")
        return None

