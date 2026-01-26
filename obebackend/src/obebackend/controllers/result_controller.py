"""Result management controller for OBE System."""

from typing import Optional, Dict, Any, List
import logging

from obebackend.database.connection import get_db_connection
from obebackend.database.queries import result_queries, teacher_course_queries
from obebackend.controllers.assessment_controller import get_assessment_by_id
from obebackend.middleware.error_handler import AppException

logger = logging.getLogger(__name__)


def _map_result_row(row: tuple) -> Dict[str, Any]:
    """Map a raw SQL row to result dictionary."""
    return {
        "id": row[0],
        "student_id": row[1],
        "assessment_id": row[2],
        "clo_id": row[3],
        "score": float(row[4]) if row[4] is not None else 0.0,
        "max_score": float(row[5]) if row[5] is not None else 0.0,
        "percentage": float(row[6]) if row[6] is not None else 0.0,
        "created_at": row[7],
        "updated_at": row[8],
        "assessment_name": row[9],
        "assessment_type": row[10],
        "assessment_due_date": row[11],
        "course_id": row[12],
        "course_name": row[13],
        "course_code": row[14],
        "student_name": f"{row[15]} {row[16]}".strip() if row[15] or row[16] else None,
        "student_email": row[17],
        "clo_code": row[18],
    }


def _get_result_detail_by_id(result_id: int) -> Optional[Dict[str, Any]]:
    """Fetch a single result with detailed join data."""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute(result_queries.GET_RESULT_WITH_DETAILS_BY_ID, (result_id,))
        row = cursor.fetchone()
        if not row:
            return None
        return _map_result_row(row)


def get_results_by_assessment(assessment_id: int, requester_id: Optional[int] = None) -> List[Dict[str, Any]]:
    """Get results for assessment."""
    try:
        assessment = get_assessment_by_id(assessment_id)
        if not assessment:
            raise AppException("Assessment not found", status_code=404, error_code="ASSESSMENT_NOT_FOUND")

        if requester_id and assessment["teacher_id"] != requester_id:
            raise AppException("You are not allowed to view these results.", status_code=403, error_code="FORBIDDEN")

        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(result_queries.GET_RESULTS_BY_ASSESSMENT, (assessment_id,))
            rows = cursor.fetchall()
            return [_map_result_row(r) for r in rows]
    except AppException:
        raise
    except Exception as e:
        logger.error(f"Error getting results: {e}")
        raise AppException("Failed to get results", status_code=500, error_code="DATABASE_ERROR")


def get_results_by_student(student_id: int) -> List[Dict[str, Any]]:
    """Get results for student."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(result_queries.GET_RESULTS_BY_STUDENT, (student_id,))
            rows = cursor.fetchall()
            return [_map_result_row(r) for r in rows]
    except Exception as e:
        logger.error(f"Error getting student results: {e}")
        raise AppException("Failed to get student results", status_code=500, error_code="DATABASE_ERROR")


def create_result(student_id: int, assessment_id: int, clo_id: int, score: float,
                  max_score: float, teacher_id: int) -> Dict[str, Any]:
    """Create result entry."""
    try:
        assessment = get_assessment_by_id(assessment_id)
        if not assessment:
            raise AppException("Assessment not found", status_code=404, error_code="ASSESSMENT_NOT_FOUND")
        if assessment["teacher_id"] != teacher_id:
            raise AppException("You are not allowed to record results for this assessment.", status_code=403, error_code="FORBIDDEN")

        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                teacher_course_queries.CHECK_STUDENT_ENROLLED_IN_COURSE,
                (assessment["course_id"], student_id)
            )
            if not cursor.fetchone():
                raise AppException("Student is not enrolled in this course.", status_code=400, error_code="STUDENT_NOT_ENROLLED")

        percentage = (score / max_score) * 100 if max_score > 0 else 0
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(result_queries.GET_RESULT_BY_KEYS, (student_id, assessment_id, clo_id))
            if cursor.fetchone():
                raise AppException("Result already exists for this student and CLO.", status_code=409, error_code="RESULT_EXISTS")

            cursor.execute(result_queries.CREATE_RESULT, (student_id, assessment_id, clo_id, score, max_score, percentage))
            row = cursor.fetchone()
            conn.commit()
            if not row:
                raise AppException("Failed to create result", status_code=500, error_code="RESULT_INSERT_ERROR")
            detail = _get_result_detail_by_id(row[0])
            if not detail:
                raise AppException("Failed to load result after creation", status_code=500, error_code="RESULT_FETCH_FAILED")
            return detail
    except AppException:
        raise
    except Exception as e:
        logger.error(f"Error creating result: {e}")
        raise AppException("Failed to create result", status_code=500, error_code="DATABASE_ERROR")


def create_bulk_results(results: List[Dict[str, Any]], teacher_id: int) -> List[Dict[str, Any]]:
    """Create multiple results."""
    created: List[Dict[str, Any]] = []
    for result in results:
        try:
            created.append(create_result(**result, teacher_id=teacher_id))
        except AppException as exc:
            if exc.error_code == "RESULT_EXISTS":
                existing = _get_result_by_keys(
                    student_id=result["student_id"],
                    assessment_id=result["assessment_id"],
                    clo_id=result["clo_id"],
                )
                if existing:
                    updated = update_result(
                        result_id=existing["id"],
                        score=result["score"],
                        max_score=result["max_score"],
                        teacher_id=teacher_id,
                    )
                    created.append(updated)
                else:
                    raise
            else:
                raise
    return created


def update_result(result_id: int, score: float, max_score: float, teacher_id: int) -> Dict[str, Any]:
    """Update result."""
    try:
        existing = get_result_by_id(result_id)
        if not existing:
            raise AppException("Result not found", status_code=404, error_code="RESULT_NOT_FOUND")

        assessment = get_assessment_by_id(existing["assessment_id"])
        if not assessment or assessment["teacher_id"] != teacher_id:
            raise AppException("You are not allowed to update this result.", status_code=403, error_code="FORBIDDEN")

        percentage = (score / max_score) * 100 if max_score > 0 else 0
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(result_queries.UPDATE_RESULT, (score, max_score, percentage, result_id))
            row = cursor.fetchone()
            conn.commit()
            if not row:
                raise AppException("Result not found", status_code=404, error_code="RESULT_NOT_FOUND")
            detail = _get_result_detail_by_id(row[0])
            if not detail:
                raise AppException("Failed to load result after update", status_code=500, error_code="RESULT_FETCH_FAILED")
            return detail
    except AppException:
        raise
    except Exception as e:
        logger.error(f"Error updating result: {e}")
        raise AppException("Failed to update result", status_code=500, error_code="DATABASE_ERROR")


def create_feedback(result_id: int, comment: str, created_by: int) -> Dict[str, Any]:
    """Add feedback to result."""
    try:
        result = get_result_by_id(result_id)
        if not result:
            raise AppException("Result not found", status_code=404, error_code="RESULT_NOT_FOUND")

        assessment = get_assessment_by_id(result["assessment_id"])
        if not assessment or assessment["teacher_id"] != created_by:
            raise AppException("You are not allowed to leave feedback for this result.", status_code=403, error_code="FORBIDDEN")

        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(result_queries.CREATE_FEEDBACK, (result_id, comment, created_by))
            row = cursor.fetchone()
            conn.commit()
            return {"id": row[0], "result_id": row[1], "comment": row[2], "created_by": row[3],
                    "created_at": row[4], "updated_at": row[5]}
    except Exception as e:
        logger.error(f"Error creating feedback: {e}")
        raise AppException("Failed to create feedback", status_code=500, error_code="DATABASE_ERROR")


def get_result_by_id(result_id: int) -> Optional[Dict[str, Any]]:
    """Helper to fetch a result by its ID."""
    try:
        return _get_result_detail_by_id(result_id)
    except Exception as exc:
        logger.error(f"Error fetching result by id: {exc}")
        raise AppException("Failed to fetch result", status_code=500, error_code="DATABASE_ERROR")


def _get_result_by_keys(student_id: int, assessment_id: int, clo_id: int) -> Optional[Dict[str, Any]]:
    """Helper to fetch a result by composite keys."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(result_queries.GET_RESULT_BY_KEYS, (student_id, assessment_id, clo_id))
            row = cursor.fetchone()
            if not row:
                return None
            return _get_result_detail_by_id(row[0])
    except Exception as exc:
        logger.error(f"Error fetching result by keys: {exc}")
        raise AppException("Failed to fetch result", status_code=500, error_code="DATABASE_ERROR")


def get_students_for_teacher(teacher_id: int) -> List[Dict[str, Any]]:
    """Return students enrolled across a teacher's courses."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(teacher_course_queries.GET_STUDENTS_FOR_TEACHER, (teacher_id,))
            rows = cursor.fetchall()
            students: List[Dict[str, Any]] = []
            for row in rows:
                students.append({
                    "id": row[0],
                    "first_name": row[1],
                    "last_name": row[2],
                    "email": row[3],
                    "enrollment_date": row[4],
                    "status": row[5],
                    "course_id": row[6],
                    "course_code": row[7],
                    "course_name": row[8],
                })
            return students
    except Exception as exc:
        logger.error(f"Error fetching teacher students: {exc}")
        raise AppException("Failed to get students", status_code=500, error_code="DATABASE_ERROR")

