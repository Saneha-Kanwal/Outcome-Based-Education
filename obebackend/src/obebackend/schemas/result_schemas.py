"""Pydantic schemas for result endpoints."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ResultResponse(BaseModel):
    """Result response schema."""
    id: int
    student_id: int
    student_name: Optional[str] = None
    student_email: Optional[str] = None
    assessment_id: int
    assessment_name: Optional[str] = None
    assessment_type: Optional[str] = None
    assessment_due_date: Optional[datetime] = None
    course_id: Optional[int] = None
    course_name: Optional[str] = None
    course_code: Optional[str] = None
    clo_id: int
    clo_code: Optional[str] = None
    score: float
    max_score: float
    percentage: float
    created_at: datetime
    updated_at: Optional[datetime] = None


class CreateResultRequest(BaseModel):
    """Create result request schema."""
    student_id: int
    assessment_id: int
    clo_id: int
    score: float = Field(..., ge=0)
    max_score: float = Field(..., gt=0)


class BulkResultRequest(BaseModel):
    """Bulk result entry request schema."""
    assessment_id: int
    results: List[CreateResultRequest]


class UpdateResultRequest(BaseModel):
    """Update result request schema."""
    score: float = Field(..., ge=0)
    max_score: float = Field(..., gt=0)


class FeedbackResponse(BaseModel):
    """Feedback response schema."""
    id: int
    result_id: int
    comment: str
    created_by: int
    created_at: datetime
    updated_at: Optional[datetime] = None


class CreateFeedbackRequest(BaseModel):
    """Create feedback request schema."""
    comment: str = Field(..., min_length=1)

