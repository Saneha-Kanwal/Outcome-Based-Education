"""Outcome management routes for OBE System."""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from obebackend.schemas.outcome_schemas import (
    PLOResponse,
    CreatePLORequest,
    UpdatePLORequest,
    CLOResponse,
    CreateCLORequest,
    UpdateCLORequest
)
from obebackend.controllers.outcome_controller import (
    get_all_plos,
    create_plo,
    update_plo,
    delete_plo,
    get_clos_by_course,
    create_clo,
    update_clo,
    delete_clo
)
from obebackend.middleware.auth_middleware import require_auth
from obebackend.middleware.rbac_middleware import require_admin, require_admin_or_teacher
from obebackend.middleware.error_handler import AppException

router = APIRouter()


# PLO Routes (under /api/plos)
@router.get("/plos", response_model=List[PLOResponse])
async def list_plos(current_user: dict = Depends(require_auth)):
    """List all PLOs."""
    try:
        return get_all_plos()
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/plos", response_model=PLOResponse, status_code=status.HTTP_201_CREATED)
async def create_new_plo(
    request: CreatePLORequest,
    current_user: dict = Depends(require_admin)
):
    """Create PLO (Admin only)."""
    try:
        return create_plo(code=request.code, description=request.description)
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.put("/plos/{plo_id}", response_model=PLOResponse)
async def update_existing_plo(
    plo_id: int,
    request: UpdatePLORequest,
    current_user: dict = Depends(require_admin)
):
    """Update PLO (Admin only)."""
    try:
        return update_plo(plo_id, code=request.code, description=request.description)
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/plos/{plo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_plo(
    plo_id: int,
    current_user: dict = Depends(require_admin)
):
    """Delete PLO (Admin only)."""
    try:
        delete_plo(plo_id)
        return None
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


# CLO Routes (under /api/courses/{id}/clos and /api/clos/{id})
@router.get("/courses/{course_id}/clos", response_model=List[CLOResponse])
async def list_course_clos(
    course_id: int,
    current_user: dict = Depends(require_auth)
):
    """Get CLOs for course."""
    try:
        return get_clos_by_course(course_id)
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("/courses/{course_id}/clos", response_model=CLOResponse, status_code=status.HTTP_201_CREATED)
async def create_new_clo(
    course_id: int,
    request: CreateCLORequest,
    current_user: dict = Depends(require_admin_or_teacher)
):
    """Create CLO (Admin/Teacher)."""
    try:
        return create_clo(course_id=course_id, code=request.code, description=request.description)
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.put("/clos/{clo_id}", response_model=CLOResponse)
async def update_existing_clo(
    clo_id: int,
    request: UpdateCLORequest,
    current_user: dict = Depends(require_admin_or_teacher)
):
    """Update CLO (Admin/Teacher)."""
    try:
        return update_clo(clo_id, code=request.code, description=request.description)
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/clos/{clo_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_clo(
    clo_id: int,
    current_user: dict = Depends(require_admin)
):
    """Delete CLO (Admin only)."""
    try:
        delete_clo(clo_id)
        return None
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

