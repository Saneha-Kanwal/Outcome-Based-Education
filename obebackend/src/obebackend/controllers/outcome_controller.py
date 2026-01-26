"""Outcome management controller for OBE System."""

from typing import Optional, Dict, Any, List
import logging

from obebackend.database.connection import get_db_connection
from obebackend.database.queries import outcome_queries
from obebackend.middleware.error_handler import AppException

logger = logging.getLogger(__name__)


# PLO functions
def get_all_plos() -> List[Dict[str, Any]]:
    """Get all PLOs."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(outcome_queries.GET_ALL_PLOS)
            rows = cursor.fetchall()
            
            return [{"id": r[0], "code": r[1], "description": r[2], "created_at": r[3], "updated_at": r[4]} for r in rows]
    except Exception as e:
        logger.error(f"Error getting PLOs: {e}")
        raise AppException("Failed to get PLOs", status_code=500, error_code="DATABASE_ERROR")


def create_plo(code: str, description: str) -> Dict[str, Any]:
    """Create PLO."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(outcome_queries.CREATE_PLO, (code, description))
            row = cursor.fetchone()
            conn.commit()
            return {"id": row[0], "code": row[1], "description": row[2], "created_at": row[3], "updated_at": row[4]}
    except Exception as e:
        logger.error(f"Error creating PLO: {e}")
        raise AppException("Failed to create PLO", status_code=500, error_code="DATABASE_ERROR")


def update_plo(plo_id: int, code: str, description: str) -> Dict[str, Any]:
    """Update PLO."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(outcome_queries.UPDATE_PLO, (code, description, plo_id))
            row = cursor.fetchone()
            conn.commit()
            if not row:
                raise AppException("PLO not found", status_code=404, error_code="PLO_NOT_FOUND")
            return {"id": row[0], "code": row[1], "description": row[2], "created_at": row[3], "updated_at": row[4]}
    except AppException:
        raise
    except Exception as e:
        logger.error(f"Error updating PLO: {e}")
        raise AppException("Failed to update PLO", status_code=500, error_code="DATABASE_ERROR")


def delete_plo(plo_id: int) -> None:
    """Delete PLO."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(outcome_queries.DELETE_PLO, (plo_id,))
            conn.commit()
    except Exception as e:
        logger.error(f"Error deleting PLO: {e}")
        raise AppException("Failed to delete PLO", status_code=500, error_code="DATABASE_ERROR")


# CLO functions
def get_clos_by_course(course_id: int) -> List[Dict[str, Any]]:
    """Get CLOs for course."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(outcome_queries.GET_CLOS_BY_COURSE, (course_id,))
            rows = cursor.fetchall()
            return [{"id": r[0], "course_id": r[1], "code": r[2], "description": r[3], "created_at": r[4], "updated_at": r[5]} for r in rows]
    except Exception as e:
        logger.error(f"Error getting CLOs: {e}")
        raise AppException("Failed to get CLOs", status_code=500, error_code="DATABASE_ERROR")


def create_clo(course_id: int, code: str, description: str) -> Dict[str, Any]:
    """Create CLO."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(outcome_queries.CREATE_CLO, (course_id, code, description))
            row = cursor.fetchone()
            conn.commit()
            return {"id": row[0], "course_id": row[1], "code": row[2], "description": row[3], "created_at": row[4], "updated_at": row[5]}
    except Exception as e:
        logger.error(f"Error creating CLO: {e}")
        raise AppException("Failed to create CLO", status_code=500, error_code="DATABASE_ERROR")


def update_clo(clo_id: int, code: str, description: str) -> Dict[str, Any]:
    """Update CLO."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(outcome_queries.UPDATE_CLO, (code, description, clo_id))
            row = cursor.fetchone()
            conn.commit()
            if not row:
                raise AppException("CLO not found", status_code=404, error_code="CLO_NOT_FOUND")
            return {"id": row[0], "course_id": row[1], "code": row[2], "description": row[3], "created_at": row[4], "updated_at": row[5]}
    except AppException:
        raise
    except Exception as e:
        logger.error(f"Error updating CLO: {e}")
        raise AppException("Failed to update CLO", status_code=500, error_code="DATABASE_ERROR")


def delete_clo(clo_id: int) -> None:
    """Delete CLO."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(outcome_queries.DELETE_CLO, (clo_id,))
            conn.commit()
    except Exception as e:
        logger.error(f"Error deleting CLO: {e}")
        raise AppException("Failed to delete CLO", status_code=500, error_code="DATABASE_ERROR")

