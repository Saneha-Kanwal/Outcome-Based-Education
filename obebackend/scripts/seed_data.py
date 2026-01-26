"""
Seed script for OBE System database.
Creates initial roles, permissions, and optionally an admin user.
"""

import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

from obebackend.database.connection import get_db_connection
from obebackend.database.queries import role_queries, permission_queries, role_permission_queries, user_queries
from obebackend.utils.security import hash_password
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def create_roles():
    """Create default roles: Admin, Teacher, Student."""
    logger.info("Creating roles...")
    
    roles = [
        ("Admin", "System administrator with full access"),
        ("Teacher", "Course instructor with teaching permissions"),
        ("Student", "Student with access to own courses and results")
    ]
    
    role_ids = {}
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        for name, description in roles:
            # Check if role exists
            cursor.execute(role_queries.GET_ROLE_BY_NAME, (name,))
            existing = cursor.fetchone()
            
            if existing:
                logger.info(f"  Role '{name}' already exists (ID: {existing[0]})")
                role_ids[name] = existing[0]
            else:
                cursor.execute(role_queries.CREATE_ROLE, (name, description))
                role_row = cursor.fetchone()
                role_ids[name] = role_row[0]
                logger.info(f"  Created role '{name}' (ID: {role_row[0]})")
        
        conn.commit()
    
    return role_ids


def create_permissions():
    """Create default permissions."""
    logger.info("Creating permissions...")
    
    permissions = [
        ("manage_users", "Create, update, and delete users"),
        ("manage_courses", "Create, update, and delete courses"),
        ("manage_outcomes", "Create and manage PLOs and CLOs"),
        ("manage_mappings", "Create and manage CO-PO mappings"),
        ("create_assessments", "Create assessments for courses"),
        ("enter_results", "Enter and update student results"),
        ("view_analytics", "View analytics and reports"),
        ("assign_teachers", "Assign teachers to courses"),
        ("view_all_results", "View all student results"),
        ("manage_own_courses", "Manage assigned courses"),
    ]
    
    permission_ids = {}
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        for name, description in permissions:
            # Check if permission exists
            cursor.execute(permission_queries.GET_PERMISSION_BY_NAME, (name,))
            existing = cursor.fetchone()
            
            if existing:
                logger.info(f"  Permission '{name}' already exists (ID: {existing[0]})")
                permission_ids[name] = existing[0]
            else:
                cursor.execute(permission_queries.CREATE_PERMISSION, (name, description))
                perm_row = cursor.fetchone()
                permission_ids[name] = perm_row[0]
                logger.info(f"  Created permission '{name}' (ID: {perm_row[0]})")
        
        conn.commit()
    
    return permission_ids


def assign_role_permissions(role_ids, permission_ids):
    """Assign permissions to roles."""
    logger.info("Assigning permissions to roles...")
    
    # Admin gets all permissions
    admin_permissions = list(permission_ids.keys())
    
    # Teacher permissions
    teacher_permissions = [
        "create_assessments",
        "enter_results",
        "view_analytics",
        "manage_own_courses",
        "manage_outcomes",  # Can create CLOs
    ]
    
    # Student permissions (minimal)
    student_permissions = []  # Students have read-only access to their own data
    
    role_permission_map = {
        "Admin": admin_permissions,
        "Teacher": teacher_permissions,
        "Student": student_permissions
    }
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        for role_name, perm_names in role_permission_map.items():
            role_id = role_ids[role_name]
            
            for perm_name in perm_names:
                perm_id = permission_ids[perm_name]
                
                # Check if already assigned
                cursor.execute(role_permission_queries.GET_ROLE_PERMISSION, (role_id, perm_id))
                if cursor.fetchone():
                    logger.info(f"  {role_name} already has permission '{perm_name}'")
                else:
                    cursor.execute(role_permission_queries.CREATE_ROLE_PERMISSION, (role_id, perm_id))
                    logger.info(f"  Assigned '{perm_name}' to {role_name}")
        
        conn.commit()
    
    logger.info("Permission assignment complete")


def create_admin_user(email: str, password: str, first_name: str = "Admin", last_name: str = "User"):
    """Create initial admin user."""
    logger.info(f"Creating admin user: {email}")
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        
        # Get Admin role ID
        cursor.execute(role_queries.GET_ROLE_BY_NAME, ("Admin",))
        admin_role = cursor.fetchone()
        
        if not admin_role:
            logger.error("Admin role not found! Run create_roles() first.")
            return False
        
        admin_role_id = admin_role[0]
        
        # Check if admin user already exists
        cursor.execute(user_queries.GET_USER_BY_EMAIL, (email,))
        existing = cursor.fetchone()
        
        if existing:
            logger.warning(f"  User with email '{email}' already exists")
            return False
        
        # Create admin user
        password_hash = hash_password(password)
        cursor.execute(
            user_queries.CREATE_USER,
            (email, password_hash, first_name, last_name, admin_role_id)
        )
        user_row = cursor.fetchone()
        conn.commit()
        
        logger.info(f"  ✓ Admin user created successfully (ID: {user_row[0]})")
        logger.info(f"  Email: {email}")
        logger.info(f"  Password: {password}")
        logger.info("  ⚠️  IMPORTANT: Change this password after first login!")
        
        return True


def main():
    """Main seed function."""
    import argparse
    
    parser = argparse.ArgumentParser(description="Seed OBE System database")
    parser.add_argument("--admin-email", help="Email for initial admin user")
    parser.add_argument("--admin-password", help="Password for initial admin user")
    parser.add_argument("--admin-first-name", default="Admin", help="First name for admin")
    parser.add_argument("--admin-last-name", default="User", help="Last name for admin")
    parser.add_argument("--skip-admin", action="store_true", help="Skip admin user creation")
    
    args = parser.parse_args()
    
    logger.info("=" * 60)
    logger.info("OBE System Database Seeding")
    logger.info("=" * 60)
    logger.info("")
    
    try:
        # Create roles
        role_ids = create_roles()
        logger.info("")
        
        # Create permissions
        permission_ids = create_permissions()
        logger.info("")
        
        # Assign permissions to roles
        assign_role_permissions(role_ids, permission_ids)
        logger.info("")
        
        # Create admin user (if requested)
        if not args.skip_admin:
            if args.admin_email and args.admin_password:
                create_admin_user(
                    args.admin_email,
                    args.admin_password,
                    args.admin_first_name,
                    args.admin_last_name
                )
            else:
                logger.warning("Admin user creation skipped (provide --admin-email and --admin-password)")
        else:
            logger.info("Admin user creation skipped (--skip-admin flag)")
        
        logger.info("")
        logger.info("=" * 60)
        logger.info("✓ Database seeding completed successfully!")
        logger.info("=" * 60)
        
    except Exception as e:
        logger.error(f"Error during seeding: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()

