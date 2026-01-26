"""Mapping routes for OBE System."""

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from obebackend.schemas.mapping_schemas import (
    MappingResponse,
    CreateMappingRequest,
    UpdateMappingRequest
)
from obebackend.controllers.mapping_controller import (
    get_all_mappings,
    get_mappings_by_course,
    create_mapping,
    update_mapping,
    delete_mapping
)
from obebackend.middleware.auth_middleware import require_auth
from obebackend.middleware.rbac_middleware import require_admin
from obebackend.middleware.error_handler import AppException

router = APIRouter()


@router.get("", response_model=List[MappingResponse])
async def list_mappings(current_user: dict = Depends(require_auth)):
    """List all CO-PO mappings."""
    try:
        return get_all_mappings()
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


# Course mappings route (under /api/courses/{id}/mappings)
course_mappings_router = APIRouter()


@course_mappings_router.get("/{course_id}/mappings", response_model=List[MappingResponse])
async def get_course_mappings(
    course_id: int,
    current_user: dict = Depends(require_auth)
):
    """Get mappings for course."""
    try:
        return get_mappings_by_course(course_id)
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.post("", response_model=MappingResponse, status_code=status.HTTP_201_CREATED)
async def create_new_mapping(
    request: CreateMappingRequest,
    current_user: dict = Depends(require_admin)
):
    """Create CO-PO mapping (Admin only)."""
    try:
        return create_mapping(
            clo_id=request.clo_id,
            plo_id=request.plo_id,
            strength=request.strength
        )
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.put("/{mapping_id}", response_model=MappingResponse)
async def update_existing_mapping(
    mapping_id: int,
    request: UpdateMappingRequest,
    current_user: dict = Depends(require_admin)
):
    """Update mapping (Admin only)."""
    try:
        return update_mapping(mapping_id, strength=request.strength)
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)


@router.delete("/{mapping_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_existing_mapping(
    mapping_id: int,
    current_user: dict = Depends(require_admin)
):
    """Delete mapping (Admin only)."""
    try:
        delete_mapping(mapping_id)
        return None
    except AppException as e:
        raise HTTPException(status_code=e.status_code, detail=e.message)

