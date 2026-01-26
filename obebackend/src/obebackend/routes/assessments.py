"""Assessment routes for OBE System."""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from obebackend.schemas.assessment_schemas import (
    AssessmentResponse,
    CreateAssessmentRequest,
    UpdateAssessmentRequest
)
from obebackend.controllers.assessment_controller import (
    get_assessment_by_id,
    get_assessments_by_course,
    create_assessment,
    update_assessment,
    delete_assessment
)
from obebackend.middleware.auth_middleware import require_auth
from obebackend.middleware.rbac_middleware import require_teacher
from obebackend.middleware.error_handler import AppException
from obebackend.database.connection import get_db_connection
from obebackend.database.queries import teacher_course_queries

router = APIRouter()


@router.get("/{course_id}/assessments", response_model=List[AssessmentResponse])
async def list_course_assessments(
    course_id: int,
    current_user: dict = Depends(require_auth)
):
    """List assessments for course."""
    try:
        role_name = current_user.get("role", {}).get("name")
        if role_name == "Teacher":
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    teacher_course_queries.CHECK_TEACHER_ASSIGNED_TO_COURSE,
                    (course_id, current_user["id"])
                )
                if not cursor.fetchone():
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="You are not assigned to this course."
                    )
        elif role_name == "Student":
            with get_db_connection() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    teacher_course_queries.CHECK_STUDENT_ENROLLED_IN_COURSE,
                    (course_id, current_user["id"])
                )
                if not cursor.fetchone():
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail="You are not enrolled in this course."
                    )
        elif role_name not in ("Admin", "Teacher"):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied.")

        return get_assessments_by_course(course_id)
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


# Separate router for assessment details (under /api/assessments)
assessment_detail_router = APIRouter()


@assessment_detail_router.get("/{assessment_id}", response_model=AssessmentResponse)
async def get_assessment(
    assessment_id: int,
    current_user: dict = Depends(require_auth)
):
    """Get assessment details."""
    try:
        assessment = get_assessment_by_id(assessment_id)
        if not assessment:
            raise HTTPException(status_code=404, detail="Assessment not found")
        return assessment
    except HTTPException:
        raise
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@assessment_detail_router.post("", response_model=AssessmentResponse, status_code=status.HTTP_201_CREATED)
async def create_new_assessment(
    request: CreateAssessmentRequest,
    current_user: dict = Depends(require_teacher)
):
    """Create assessment (Teacher)."""
    try:
        return create_assessment(
            course_id=request.course_id,
            teacher_id=current_user["id"],
            name=request.name,
            type=request.type,
            description=request.description,
            weight=request.weight,
            max_score=request.max_score,
            due_date=request.due_date
        )
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@assessment_detail_router.put("/{assessment_id}", response_model=AssessmentResponse)
async def update_existing_assessment(
    assessment_id: int,
    request: UpdateAssessmentRequest,
    current_user: dict = Depends(require_teacher)
):
    """Update assessment (Teacher)."""
    try:
        return update_assessment(
            assessment_id=assessment_id,
            teacher_id=current_user["id"],
            name=request.name,
            type=request.type,
            description=request.description,
            weight=request.weight,
            max_score=request.max_score,
            due_date=request.due_date
        )
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@assessment_detail_router.delete("/{assessment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_assessment(
    assessment_id: int,
    current_user: dict = Depends(require_teacher)
):
    """Delete assessment (Teacher)."""
    try:
        delete_assessment(assessment_id, teacher_id=current_user["id"])
        return None
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

