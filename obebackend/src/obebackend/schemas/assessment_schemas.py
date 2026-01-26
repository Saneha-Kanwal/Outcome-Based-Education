"""Pydantic schemas for assessment endpoints."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class AssessmentResponse(BaseModel):
    """Assessment response schema."""
    id: int
    course_id: int
    teacher_id: int
    name: str
    type: str
    description: Optional[str] = None
    weight: float
    max_score: float
    due_date: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class CreateAssessmentRequest(BaseModel):
    """Create assessment request schema."""
    course_id: int
    name: str = Field(..., min_length=1)
    type: str = Field(..., description="Quiz, Assignment, Exam, Project")
    description: Optional[str] = None
    weight: float = Field(..., ge=0, le=100, description="Percentage weight")
    max_score: float = Field(..., gt=0)
    due_date: Optional[datetime] = None


class UpdateAssessmentRequest(BaseModel):
    """Update assessment request schema."""
    name: Optional[str] = Field(None, min_length=1)
    type: Optional[str] = None
    description: Optional[str] = None
    weight: Optional[float] = Field(None, ge=0, le=100)
    max_score: Optional[float] = Field(None, gt=0)
    due_date: Optional[datetime] = None

