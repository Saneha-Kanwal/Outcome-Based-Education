"""Analytics routes for OBE System."""

from fastapi import APIRouter, Depends, HTTPException, status

from obebackend.schemas.analytics_schemas import (
    CourseAnalyticsResponse,
    ProgramAnalyticsResponse,
    StudentProgressResponse,
    OutcomeAnalyticsResponse,
    AdminSummaryResponse,
)
from obebackend.controllers.analytics_controller import (
    get_course_analytics,
    get_program_analytics,
    get_student_progress,
    get_outcome_analytics,
    get_admin_summary,
)
from obebackend.middleware.auth_middleware import require_auth
from obebackend.middleware.rbac_middleware import require_admin, require_admin_or_teacher
from obebackend.middleware.error_handler import AppException

router = APIRouter()


@router.get("/course/{course_id}", response_model=CourseAnalyticsResponse)
async def get_course_analytics_data(
    course_id: int,
    current_user: dict = Depends(require_admin_or_teacher)
):
    """Course analytics (Teacher/Admin)."""
    try:
        return get_course_analytics(course_id)
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/program", response_model=ProgramAnalyticsResponse)
async def get_program_analytics_data(
    current_user: dict = Depends(require_admin)
):
    """Program-level analytics (Admin)."""
    try:
        return get_program_analytics()
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/student/{student_id}", response_model=StudentProgressResponse)
async def get_student_progress_data(
    student_id: int,
    current_user: dict = Depends(require_auth)
):
    """Student progress (Student/Teacher)."""
    try:
        # Students can only view their own progress
        if current_user.get("role", {}).get("name") == "Student" and current_user["id"] != student_id:
            raise HTTPException(status_code=403, detail="Access denied")
        return get_student_progress(student_id)
    except HTTPException:
        raise
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/outcomes/{outcome_id}", response_model=OutcomeAnalyticsResponse)
async def get_outcome_analytics_data(
    outcome_id: int,
    current_user: dict = Depends(require_auth)
):
    """Outcome achievement analytics."""
    try:
        return get_outcome_analytics(outcome_id)
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/summary", response_model=AdminSummaryResponse)
async def get_admin_summary_data(
    current_user: dict = Depends(require_admin)
):
    """Overall summary analytics for admin dashboard."""
    try:
        return get_admin_summary()
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

