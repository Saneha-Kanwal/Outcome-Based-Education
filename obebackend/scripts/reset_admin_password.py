"""
Script to reset admin user password.
Usage: uv run python scripts/reset_admin_password.py --email admin@obesystem.com --new-password AdminPassword123
"""

import sys
import os
import logging
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from obebackend.database.connection import get_db_connection, init_connection_pool
from obebackend.utils.security import hash_password
from obebackend.database.queries import user_queries

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def reset_admin_password(email: str, new_password: str):
    """Reset password for admin user."""
    init_connection_pool()
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Check if user exists
        cursor.execute(user_queries.GET_USER_BY_EMAIL, (email,))
        user_data = cursor.fetchone()
        
        if not user_data:
            logger.error(f"User with email '{email}' not found!")
            return False
        
        # Check if user is admin
        role_id = user_data[5]
        if role_id != 1:  # Admin role ID is 1
            logger.warning(f"User '{email}' is not an admin (role_id: {role_id})")
            response = input("Continue anyway? (y/n): ")
            if response.lower() != 'y':
                return False
        
        # Hash new password
        password_hash = hash_password(new_password)
        
        # Update password
        cursor.execute(
            "UPDATE users SET password_hash = %s, updated_at = NOW() WHERE email = %s",
            (password_hash, email)
        )
        conn.commit()
        
        logger.info(f"✓ Password reset successfully for user: {email}")
        logger.info(f"  New password: {new_password}")
        logger.info("  ⚠️  IMPORTANT: Keep this password secure!")
        
        return True


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="Reset admin user password")
    parser.add_argument("--email", required=True, help="Email of admin user")
    parser.add_argument("--new-password", required=True, help="New password for admin user")
    
    args = parser.parse_args()
    
    logger.info("=" * 60)
    logger.info("OBE System - Reset Admin Password")
    logger.info("=" * 60)
    logger.info("")
    
    try:
        success = reset_admin_password(args.email, args.new_password)
        if success:
            logger.info("")
            logger.info("Password reset completed successfully!")
        else:
            logger.error("Password reset failed!")
            sys.exit(1)
    except Exception as e:
        logger.error(f"Error resetting password: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

