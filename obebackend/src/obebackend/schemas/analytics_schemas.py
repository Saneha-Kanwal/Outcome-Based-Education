"""Pydantic schemas for analytics endpoints."""

from pydantic import BaseModel
from typing import Optional, Dict, Any, List


class CourseAnalyticsResponse(BaseModel):
    """Course analytics response schema."""
    course_id: int
    total_students: int
    total_assessments: int
    average_score: Optional[float] = None
    outcome_achievement: Dict[str, Any] = {}


class ProgramAnalyticsResponse(BaseModel):
    """Program analytics response schema."""
    total_courses: int
    total_students: int
    total_plos: int
    plo_achievement: Dict[str, Any] = {}


class StudentProgressResponse(BaseModel):
    """Student progress response schema."""
    student_id: int
    enrolled_courses: int
    completed_assessments: int
    overall_average: Optional[float] = None
    outcome_progress: Dict[str, Any] = {}


class OutcomeAnalyticsResponse(BaseModel):
    """Outcome achievement analytics response schema."""
    outcome_id: int
    outcome_code: str
    total_students: int
    achievement_rate: Optional[float] = None
    distribution: Dict[str, Any] = {}


class AdminSummaryResponse(BaseModel):
    """Admin dashboard summary analytics."""
    total_students: int
    total_teachers: int
    total_courses: int
    total_plos: int
    total_clos: int
    total_outcomes: int

