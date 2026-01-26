"""Teacher-course assignment controller."""

from typing import List, Dict, Any
import logging

from obebackend.database.connection import get_db_connection
from obebackend.database.queries import teacher_course_queries
from obebackend.middleware.error_handler import AppException

logger = logging.getLogger(__name__)


def assign_courses_to_teacher(teacher_id: int, course_ids: List[int]) -> Dict[str, Any]:
    """
    Assign courses to a teacher. Duplicate assignments are ignored.

    Returns summary with counts.
    """
    if not course_ids:
        raise AppException("At least one course must be selected.", status_code=400, error_code="NO_COURSES_SELECTED")

    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            # Validate teacher exists and has Teacher role
            cursor.execute(teacher_course_queries.GET_TEACHER_BY_ID, (teacher_id,))
            teacher_row = cursor.fetchone()
            if not teacher_row:
                raise AppException("Invalid teacher ID.", status_code=404, error_code="TEACHER_NOT_FOUND")

            inserted_courses: List[int] = []
            skipped_courses: List[int] = []

            for course_id in course_ids:
                cursor.execute(teacher_course_queries.GET_ACTIVE_COURSE_BY_ID, (course_id,))
                course_row = cursor.fetchone()
                if not course_row:
                    raise AppException(
                        f"Course with id {course_id} not found or is inactive.",
                        status_code=404,
                        error_code="COURSE_NOT_FOUND"
                    )

                cursor.execute(teacher_course_queries.INSERT_TEACHER_COURSE, (course_id, teacher_id))
                inserted_row = cursor.fetchone()
                if inserted_row:
                    inserted_courses.append(course_id)
                else:
                    skipped_courses.append(course_id)

            conn.commit()

            return {
                "teacher_id": teacher_id,
                "assigned_course_ids": inserted_courses,
                "skipped_course_ids": skipped_courses,
                "assigned_count": len(inserted_courses),
                "skipped_count": len(skipped_courses),
            }
    except AppException:
        raise
    except Exception as exc:
        logger.error("Error assigning courses to teacher: %s", exc)
        raise AppException("Failed to assign courses.", status_code=500, error_code="DATABASE_ERROR")


def get_courses_for_teacher(teacher_id: int) -> List[Dict[str, Any]]:
    """Return courses assigned to the specified teacher."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            cursor.execute(teacher_course_queries.GET_TEACHER_BY_ID, (teacher_id,))
            teacher_row = cursor.fetchone()
            if not teacher_row:
                raise AppException("Invalid teacher ID.", status_code=404, error_code="TEACHER_NOT_FOUND")

            cursor.execute(teacher_course_queries.GET_COURSES_BY_TEACHER, (teacher_id,))
            rows = cursor.fetchall()

            courses: List[Dict[str, Any]] = []
            for row in rows:
                courses.append({
                    "id": row[0],
                    "code": row[1],
                    "name": row[2],
                    "description": row[3],
                    "credits": row[4],
                    "created_at": row[5],
                    "updated_at": row[6],
                })
            return courses
    except AppException:
        raise
    except Exception as exc:
        logger.error("Error fetching teacher courses: %s", exc)
        raise AppException("Failed to fetch teacher courses.", status_code=500, error_code="DATABASE_ERROR")

