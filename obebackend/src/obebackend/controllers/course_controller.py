"""Course management controller for OBE System."""

from typing import Optional, Dict, Any, List
import logging
import math

from obebackend.database.connection import get_db_connection
from obebackend.database.queries import course_queries
from obebackend.middleware.error_handler import AppException

logger = logging.getLogger(__name__)


def get_course_by_id(course_id: int) -> Optional[Dict[str, Any]]:
    """Get course by ID."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(course_queries.GET_COURSE_BY_ID, (course_id,))
            row = cursor.fetchone()
            
            if not row:
                return None
            
            return {
                "id": row[0],
                "code": row[1],
                "name": row[2],
                "description": row[3],
                "credits": row[4],
                "created_at": row[6],
                "updated_at": row[7]
            }
    except Exception as e:
        logger.error(f"Error getting course: {e}")
        raise AppException("Failed to get course", status_code=500, error_code="DATABASE_ERROR")


def get_courses(search: Optional[str] = None, page: int = 1, per_page: int = 20) -> Dict[str, Any]:
    """Get paginated list of courses."""
    try:
        search_pattern = f"%{search}%" if search else None
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            offset = (page - 1) * per_page
            
            cursor.execute(
                course_queries.GET_ALL_COURSES,
                (search_pattern, search_pattern, search_pattern, per_page, offset)
            )
            rows = cursor.fetchall()
            
            cursor.execute(
                course_queries.COUNT_COURSES,
                (search_pattern, search_pattern, search_pattern)
            )
            count_row = cursor.fetchone()
            total = count_row[0] if count_row else 0
            
            courses = []
            for row in rows:
                courses.append({
                    "id": row[0],
                    "code": row[1],
                    "name": row[2],
                    "description": row[3],
                    "credits": row[4],
                    "created_at": row[6],
                    "updated_at": row[7]
                })
            
            total_pages = math.ceil(total / per_page) if per_page > 0 else 0
            
            return {
                "courses": courses,
                "total": total,
                "page": page,
                "per_page": per_page,
                "total_pages": total_pages
            }
    except Exception as e:
        logger.error(f"Error getting courses: {e}")
        raise AppException("Failed to get courses", status_code=500, error_code="DATABASE_ERROR")


def create_course(code: str, name: str, description: Optional[str] = None, credits: Optional[int] = None) -> Dict[str, Any]:
    """Create a new course."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                course_queries.CREATE_COURSE,
                (code, name, description, credits)
            )
            row = cursor.fetchone()
            conn.commit()
            
            return {
                "id": row[0],
                "code": row[1],
                "name": row[2],
                "description": row[3],
                "credits": row[4],
                "created_at": row[6],
                "updated_at": row[7]
            }
    except Exception as e:
        logger.error(f"Error creating course: {e}")
        raise AppException("Failed to create course", status_code=500, error_code="DATABASE_ERROR")


def update_course(course_id: int, code: Optional[str] = None, name: Optional[str] = None,
                  description: Optional[str] = None, credits: Optional[int] = None) -> Dict[str, Any]:
    """Update course."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(
                course_queries.UPDATE_COURSE,
                (code, name, description, credits, course_id)
            )
            row = cursor.fetchone()
            conn.commit()
            
            if not row:
                raise AppException("Course not found", status_code=404, error_code="COURSE_NOT_FOUND")
            
            return {
                "id": row[0],
                "code": row[1],
                "name": row[2],
                "description": row[3],
                "credits": row[4],
                "created_at": row[6],
                "updated_at": row[7]
            }
    except AppException:
        raise
    except Exception as e:
        logger.error(f"Error updating course: {e}")
        raise AppException("Failed to update course", status_code=500, error_code="DATABASE_ERROR")


def delete_course(course_id: int) -> None:
    """Soft delete course."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(course_queries.DELETE_COURSE, (course_id,))
            conn.commit()
    except Exception as e:
        logger.error(f"Error deleting course: {e}")
        raise AppException("Failed to delete course", status_code=500, error_code="DATABASE_ERROR")


def assign_teacher(course_id: int, teacher_id: int) -> Dict[str, Any]:
    """Assign teacher to course."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(course_queries.ASSIGN_TEACHER, (course_id, teacher_id))
            row = cursor.fetchone()
            conn.commit()
            
            if not row:
                raise AppException("Teacher already assigned", status_code=409, error_code="ALREADY_ASSIGNED")
            
            return {"id": row[0], "course_id": row[1], "teacher_id": row[2]}
    except AppException:
        raise
    except Exception as e:
        logger.error(f"Error assigning teacher: {e}")
        raise AppException("Failed to assign teacher", status_code=500, error_code="DATABASE_ERROR")


def get_course_students(course_id: int) -> List[Dict[str, Any]]:
    """Get students enrolled in course."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(course_queries.GET_COURSE_STUDENTS, (course_id,))
            rows = cursor.fetchall()
            
            students = []
            for row in rows:
                students.append({
                    "id": row[0],
                    "email": row[1],
                    "first_name": row[2],
                    "last_name": row[3],
                    "enrollment_date": row[4],
                    "status": row[5]
                })
            
            return students
    except Exception as e:
        logger.error(f"Error getting course students: {e}")
        raise AppException("Failed to get course students", status_code=500, error_code="DATABASE_ERROR")


def get_active_courses() -> List[Dict[str, Any]]:
    """Return all active (non-deleted) courses."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(course_queries.GET_ACTIVE_COURSES)
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
    except Exception as exc:
        logger.error(f"Error getting active courses: {exc}")
        raise AppException("Failed to get courses", status_code=500, error_code="DATABASE_ERROR")


def get_courses_for_student(student_id: int) -> List[Dict[str, Any]]:
    """Return courses a student is enrolled in."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(course_queries.GET_COURSES_FOR_STUDENT, (student_id,))
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
                    "enrollment_date": row[7],
                    "status": row[8],
                })
            return courses
    except Exception as exc:
        logger.error(f"Error getting student courses: {exc}")
        raise AppException("Failed to get student courses", status_code=500, error_code="DATABASE_ERROR")


def enroll_student_in_course(student_id: int, course_id: int) -> Dict[str, Any]:
    """Enroll a student in a course."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()

            cursor.execute(course_queries.GET_ACTIVE_COURSE_BY_ID, (course_id,))
            if not cursor.fetchone():
                raise AppException("Course not found or inactive.", status_code=404, error_code="COURSE_NOT_FOUND")

            cursor.execute(
                course_queries.ENROLL_STUDENT,
                (student_id, course_id)
            )
            row = cursor.fetchone()
            if not row:
                raise AppException("Student is already enrolled in this course.", status_code=409, error_code="ALREADY_ENROLLED")
            conn.commit()
            return {
                "id": row[0],
                "student_id": row[1],
                "course_id": row[2],
                "enrollment_date": row[3],
                "status": row[4],
            }
    except AppException:
        raise
    except Exception as exc:
        logger.error(f"Error enrolling student: {exc}")
        raise AppException("Failed to enroll in course", status_code=500, error_code="DATABASE_ERROR")


def remove_student_enrollment(student_id: int, course_id: int) -> None:
    """Remove a student's enrollment from a course."""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(course_queries.REMOVE_STUDENT_ENROLLMENT, (student_id, course_id))
            row = cursor.fetchone()
            if not row:
                raise AppException("Enrollment not found.", status_code=404, error_code="ENROLLMENT_NOT_FOUND")
            conn.commit()
    except AppException:
        raise
    except Exception as exc:
        logger.error(f"Error removing student enrollment: {exc}")
        raise AppException("Failed to remove enrollment", status_code=500, error_code="DATABASE_ERROR")

