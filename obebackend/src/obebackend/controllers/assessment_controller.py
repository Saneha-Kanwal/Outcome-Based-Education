"""Assessment management controller for OBE System."""

from typing import Optional, Dict, Any, List
import logging

from obebackend.database.connection import get_db_connection
from obebackend.database.queries import assessment_queries, teacher_course_queries
from obebackend.middleware.error_handler import AppException

logger = logging.getLogger(__name__)


def get_assessment_by_id(assessment_id: int) -> Optional[Dict[str, Any]]:
    """Get assessment by ID."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(assessment_queries.GET_ASSESSMENT_BY_ID, (assessment_id,))
            row = cursor.fetchone()
            if not row:
                return None
            return {
                "id": row[0],
                "course_id": row[1],
                "teacher_id": row[2],
                "name": row[3],
                "type": row[4],
                "description": row[5],
                "weight": float(row[6]),
                "max_score": float(row[7]),
                "due_date": row[8],
                "created_at": row[9],
                "updated_at": row[10],
            }
    except Exception as e:
        logger.error(f"Error getting assessment: {e}")
        raise AppException("Failed to get assessment", status_code=500, error_code="DATABASE_ERROR")


def get_assessments_by_course(course_id: int) -> List[Dict[str, Any]]:
    """Get assessments for course."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(assessment_queries.GET_ASSESSMENTS_BY_COURSE, (course_id,))
            rows = cursor.fetchall()
            return [
                {
                    "id": r[0],
                    "course_id": r[1],
                    "teacher_id": r[2],
                    "name": r[3],
                    "type": r[4],
                    "description": r[5],
                    "weight": float(r[6]),
                    "max_score": float(r[7]),
                    "due_date": r[8],
                    "created_at": r[9],
                    "updated_at": r[10],
                }
                for r in rows
            ]
    except Exception as e:
        logger.error(f"Error getting assessments: {e}")
        raise AppException("Failed to get assessments", status_code=500, error_code="DATABASE_ERROR")


def create_assessment(course_id: int, teacher_id: int, name: str, type: str, description: Optional[str],
                      weight: float, max_score: float, due_date: Optional[str] = None) -> Dict[str, Any]:
    """Create assessment."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            cursor.execute(teacher_course_queries.CHECK_TEACHER_ASSIGNED_TO_COURSE, (course_id, teacher_id))
            if not cursor.fetchone():
                raise AppException(
                    "You are not assigned to this course.",
                    status_code=403,
                    error_code="TEACHER_NOT_ASSIGNED"
                )

            cursor.execute(
                assessment_queries.CREATE_ASSESSMENT,
                (course_id, teacher_id, name, type, description, weight, max_score, due_date)
            )
            row = cursor.fetchone()
            conn.commit()
            return {
                "id": row[0],
                "course_id": row[1],
                "teacher_id": row[2],
                "name": row[3],
                "type": row[4],
                "description": row[5],
                "weight": float(row[6]),
                "max_score": float(row[7]),
                "due_date": row[8],
                "created_at": row[9],
                "updated_at": row[10],
            }
    except Exception as e:
        logger.error(f"Error creating assessment: {e}")
        raise AppException("Failed to create assessment", status_code=500, error_code="DATABASE_ERROR")


def update_assessment(assessment_id: int, teacher_id: int, name: Optional[str] = None, type: Optional[str] = None,
                      description: Optional[str] = None, weight: Optional[float] = None,
                      max_score: Optional[float] = None, due_date: Optional[str] = None) -> Dict[str, Any]:
    """Update assessment."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            existing = get_assessment_by_id(assessment_id)
            if not existing:
                raise AppException("Assessment not found", status_code=404, error_code="ASSESSMENT_NOT_FOUND")
            if existing["teacher_id"] != teacher_id:
                raise AppException("You are not allowed to modify this assessment.", status_code=403, error_code="FORBIDDEN")

            cursor.execute(
                assessment_queries.UPDATE_ASSESSMENT,
                (name, type, description, weight, max_score, due_date, assessment_id)
            )
            row = cursor.fetchone()
            conn.commit()
            if not row:
                raise AppException("Assessment not found", status_code=404, error_code="ASSESSMENT_NOT_FOUND")
            return {
                "id": row[0],
                "course_id": row[1],
                "teacher_id": row[2],
                "name": row[3],
                "type": row[4],
                "description": row[5],
                "weight": float(row[6]),
                "max_score": float(row[7]),
                "due_date": row[8],
                "created_at": row[9],
                "updated_at": row[10],
            }
    except AppException:
        raise
    except Exception as e:
        logger.error(f"Error updating assessment: {e}")
        raise AppException("Failed to update assessment", status_code=500, error_code="DATABASE_ERROR")


def delete_assessment(assessment_id: int, teacher_id: int) -> None:
    """Delete assessment."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            existing = get_assessment_by_id(assessment_id)
            if not existing:
                raise AppException("Assessment not found", status_code=404, error_code="ASSESSMENT_NOT_FOUND")
            if existing["teacher_id"] != teacher_id:
                raise AppException("You are not allowed to delete this assessment.", status_code=403, error_code="FORBIDDEN")

            cursor.execute(assessment_queries.DELETE_ASSESSMENT, (assessment_id,))
            conn.commit()
    except Exception as e:
        logger.error(f"Error deleting assessment: {e}")
        raise AppException("Failed to delete assessment", status_code=500, error_code="DATABASE_ERROR")

