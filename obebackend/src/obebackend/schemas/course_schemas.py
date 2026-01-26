"""Pydantic schemas for course management endpoints."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class CourseResponse(BaseModel):
    """Course response schema."""
    id: int
    code: str
    name: str
    description: Optional[str] = None
    credits: Optional[int] = None
    created_at: datetime
    updated_at: Optional[datetime] = None


class CreateCourseRequest(BaseModel):
    """Create course request schema."""
    code: str = Field(..., min_length=1, description="Course code")
    name: str = Field(..., min_length=1, description="Course name")
    description: Optional[str] = None
    credits: Optional[int] = Field(None, ge=1, le=10)


class UpdateCourseRequest(BaseModel):
    """Update course request schema."""
    code: Optional[str] = Field(None, min_length=1)
    name: Optional[str] = Field(None, min_length=1)
    description: Optional[str] = None
    credits: Optional[int] = Field(None, ge=1, le=10)


class CourseListResponse(BaseModel):
    """Paginated course list response."""
    courses: List[CourseResponse]
    total: int
    page: int
    per_page: int
    total_pages: int


class AssignTeacherRequest(BaseModel):
    """Assign teacher to course request."""
    teacher_id: int


class TeacherResponse(BaseModel):
    """Teacher response schema."""
    id: int
    email: str
    first_name: str
    last_name: str


class StudentResponse(BaseModel):
    """Student response schema."""
    id: int
    email: str
    first_name: str
    last_name: str
    enrollment_date: datetime
    status: str

