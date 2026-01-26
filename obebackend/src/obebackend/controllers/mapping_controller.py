"""Mapping management controller for OBE System."""

from typing import Optional, Dict, Any, List
import logging

from obebackend.database.connection import get_db_connection
from obebackend.database.queries import mapping_queries
from obebackend.middleware.error_handler import AppException

logger = logging.getLogger(__name__)


def get_all_mappings() -> List[Dict[str, Any]]:
    """Get all CO-PO mappings."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(mapping_queries.GET_ALL_MAPPINGS)
            rows = cursor.fetchall()
            return [{"id": r[0], "clo_id": r[1], "plo_id": r[2], "strength": r[3], "created_at": r[4]} for r in rows]
    except Exception as e:
        logger.error(f"Error getting mappings: {e}")
        raise AppException("Failed to get mappings", status_code=500, error_code="DATABASE_ERROR")


def get_mappings_by_course(course_id: int) -> List[Dict[str, Any]]:
    """Get mappings for course."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(mapping_queries.GET_MAPPINGS_BY_COURSE, (course_id,))
            rows = cursor.fetchall()
            return [{"id": r[0], "clo_id": r[1], "plo_id": r[2], "strength": r[3], "created_at": r[4], "clo_code": r[5], "plo_code": r[6]} for r in rows]
    except Exception as e:
        logger.error(f"Error getting course mappings: {e}")
        raise AppException("Failed to get course mappings", status_code=500, error_code="DATABASE_ERROR")


def create_mapping(clo_id: int, plo_id: int, strength: str = "Moderate") -> Dict[str, Any]:
    """Create CO-PO mapping."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(mapping_queries.CREATE_MAPPING, (clo_id, plo_id, strength))
            row = cursor.fetchone()
            conn.commit()
            return {"id": row[0], "clo_id": row[1], "plo_id": row[2], "strength": row[3], "created_at": row[4]}
    except Exception as e:
        logger.error(f"Error creating mapping: {e}")
        raise AppException("Failed to create mapping", status_code=500, error_code="DATABASE_ERROR")


def update_mapping(mapping_id: int, strength: str) -> Dict[str, Any]:
    """Update mapping."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(mapping_queries.UPDATE_MAPPING, (strength, mapping_id))
            row = cursor.fetchone()
            conn.commit()
            if not row:
                raise AppException("Mapping not found", status_code=404, error_code="MAPPING_NOT_FOUND")
            return {"id": row[0], "clo_id": row[1], "plo_id": row[2], "strength": row[3], "created_at": row[4]}
    except AppException:
        raise
    except Exception as e:
        logger.error(f"Error updating mapping: {e}")
        raise AppException("Failed to update mapping", status_code=500, error_code="DATABASE_ERROR")


def delete_mapping(mapping_id: int) -> None:
    """Delete mapping."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(mapping_queries.DELETE_MAPPING, (mapping_id,))
            conn.commit()
    except Exception as e:
        logger.error(f"Error deleting mapping: {e}")
        raise AppException("Failed to delete mapping", status_code=500, error_code="DATABASE_ERROR")

