"""Pydantic schemas for teacher-course assignments."""

from pydantic import BaseModel, Field, validator
from typing import List


class AssignCoursesRequest(BaseModel):
    """Request body for assigning courses to a teacher."""

    teacher_id: int = Field(..., gt=0, description="Teacher user ID")
    course_ids: List[int] = Field(..., min_items=1, description="List of course IDs to assign")

    @validator("course_ids")
    def validate_course_ids(cls, value: List[int]) -> List[int]:
        cleaned = [course_id for course_id in value if course_id is not None]
        if not cleaned:
            raise ValueError("At least one course ID is required.")
        if len(set(cleaned)) != len(cleaned):
            raise ValueError("Duplicate course IDs are not allowed in the request.")
        for course_id in cleaned:
            if course_id <= 0:
                raise ValueError("Course IDs must be positive integers.")
        return cleaned


class AssignCoursesResponse(BaseModel):
    """Response payload summarizing assignment results."""

    teacher_id: int
    assigned_course_ids: List[int]
    skipped_course_ids: List[int]
    assigned_count: int
    skipped_count: int

