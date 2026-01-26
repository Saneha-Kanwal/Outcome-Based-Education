"""Routes for assigning courses to teachers."""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from obebackend.schemas.teacher_course_schemas import (
    AssignCoursesRequest,
    AssignCoursesResponse,
)
from obebackend.schemas.course_schemas import CourseResponse
from obebackend.controllers.teacher_course_controller import (
    assign_courses_to_teacher,
    get_courses_for_teacher,
)
from obebackend.middleware.auth_middleware import require_auth
from obebackend.middleware.rbac_middleware import require_admin, require_admin_or_teacher
from obebackend.middleware.error_handler import AppException

router = APIRouter()


@router.post("/teacher-courses/assign", response_model=AssignCoursesResponse, status_code=status.HTTP_201_CREATED)
async def assign_course(
    request: AssignCoursesRequest,
    current_user: dict = Depends(require_admin)
):
    """Assign one or more courses to a teacher (Admin only)."""
    try:
        result = assign_courses_to_teacher(
            teacher_id=request.teacher_id,
            course_ids=request.course_ids
        )
        return result
    except AppException as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message)


@router.get("/teacher/{teacher_id}/courses", response_model=List[CourseResponse])
async def list_teacher_courses(
    teacher_id: int,
    current_user: dict = Depends(require_admin_or_teacher)
):
    """
    Retrieve courses assigned to a teacher.

    Teachers can view their own assignments; admins can view any teacher.
    """
    try:
        # If caller is a teacher, ensure they are fetching their own data
        role_name = current_user.get("role", {}).get("name")
        current_user_id = current_user.get("id")
        if role_name == "Teacher" and int(current_user_id) != int(teacher_id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access denied"
            )

        return get_courses_for_teacher(teacher_id)
    except HTTPException:
        raise
    except AppException as exc:
        raise HTTPException(status_code=exc.status_code, detail=exc.message)

