"""Result routes for OBE System."""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Dict, Any

from obebackend.schemas.result_schemas import (
    ResultResponse,
    CreateResultRequest,
    BulkResultRequest,
    UpdateResultRequest,
    FeedbackResponse,
    CreateFeedbackRequest
)
from obebackend.controllers.result_controller import (
    get_results_by_assessment,
    get_results_by_student,
    create_result,
    create_bulk_results,
    update_result,
    create_feedback,
    get_students_for_teacher
)
from obebackend.middleware.auth_middleware import require_auth
from obebackend.middleware.rbac_middleware import require_teacher, require_admin_or_teacher
from obebackend.middleware.error_handler import AppException

router = APIRouter()


@router.get("/assessments/{assessment_id}/results", response_model=List[ResultResponse])
async def get_assessment_results(
    assessment_id: int,
    current_user: dict = Depends(require_teacher)
):
    """Get results for assessment (Teacher)."""
    try:
        return get_results_by_assessment(assessment_id, requester_id=current_user["id"])
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/students/{student_id}/results", response_model=List[ResultResponse])
async def get_student_results(
    student_id: int,
    current_user: dict = Depends(require_auth)
):
    """Get student results (Teacher/Student)."""
    try:
        user_role = current_user.get("role", {}).get("name") or current_user.get("role_name")

        # Students can only view their own results
        if user_role == "Student" and current_user["id"] != student_id:
            raise HTTPException(status_code=403, detail="Access denied")

        # Teachers/Admins can view any student's results
        return get_results_by_student(student_id)
    except HTTPException:
        raise
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("", response_model=ResultResponse, status_code=status.HTTP_201_CREATED)
async def create_new_result(
    request: CreateResultRequest,
    current_user: dict = Depends(require_teacher)
):
    """Create result entry (Teacher)."""
    try:
        return create_result(
            student_id=request.student_id,
            assessment_id=request.assessment_id,
            clo_id=request.clo_id,
            score=request.score,
            max_score=request.max_score,
            teacher_id=current_user["id"]
        )
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/bulk", response_model=List[ResultResponse], status_code=status.HTTP_201_CREATED)
async def create_bulk_result_entries(
    request: BulkResultRequest,
    current_user: dict = Depends(require_teacher)
):
    """Bulk result entry (Teacher)."""
    try:
        results = [{"student_id": r.student_id, "assessment_id": r.assessment_id,
                    "clo_id": r.clo_id, "score": r.score, "max_score": r.max_score}
                   for r in request.results]
        return create_bulk_results(results, teacher_id=current_user["id"])
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.put("/{result_id}", response_model=ResultResponse)
async def update_existing_result(
    result_id: int,
    request: UpdateResultRequest,
    current_user: dict = Depends(require_teacher)
):
    """Update result (Teacher)."""
    try:
        return update_result(
            result_id=result_id,
            score=request.score,
            max_score=request.max_score,
            teacher_id=current_user["id"]
        )
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/{result_id}/feedback", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
async def add_feedback_to_result(
    result_id: int,
    request: CreateFeedbackRequest,
    current_user: dict = Depends(require_teacher)
):
    """Add feedback to result (Teacher)."""
    try:
        return create_feedback(
            result_id=result_id,
            comment=request.comment,
            created_by=current_user["id"]
        )
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.get("/teachers/{teacher_id}/students", response_model=List[Dict[str, Any]])
async def list_teacher_students(
    teacher_id: int,
    current_user: dict = Depends(require_teacher)
):
    """List students enrolled in the teacher's courses."""
    try:
        if int(current_user["id"]) != int(teacher_id):
            raise HTTPException(status_code=403, detail="Access denied")
        return get_students_for_teacher(teacher_id)
    except HTTPException:
        raise
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

