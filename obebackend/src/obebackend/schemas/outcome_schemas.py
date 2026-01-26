"""Pydantic schemas for outcome management endpoints."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# PLO Schemas
class PLOResponse(BaseModel):
    """PLO response schema."""
    id: int
    code: str
    description: str
    created_at: datetime
    updated_at: Optional[datetime] = None


class CreatePLORequest(BaseModel):
    """Create PLO request schema."""
    code: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)


class UpdatePLORequest(BaseModel):
    """Update PLO request schema."""
    code: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)


# CLO Schemas
class CLOResponse(BaseModel):
    """CLO response schema."""
    id: int
    course_id: int
    code: str
    description: str
    created_at: datetime
    updated_at: Optional[datetime] = None


class CreateCLORequest(BaseModel):
    """Create CLO request schema."""
    code: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)


class UpdateCLORequest(BaseModel):
    """Update CLO request schema."""
    code: str = Field(..., min_length=1)
    description: str = Field(..., min_length=1)

