"""Common Pydantic schemas for OBE System API responses."""

from pydantic import BaseModel
from typing import Optional, Any, List
from datetime import datetime


class ErrorResponse(BaseModel):
    """Standard error response schema."""
    error: str
    code: str
    details: Optional[dict[str, Any]] = None


class SuccessResponse(BaseModel):
    """Standard success response schema."""
    message: str
    data: Optional[Any] = None


class PaginationMeta(BaseModel):
    """Pagination metadata."""
    total: int
    page: int
    per_page: int
    total_pages: int


class PaginatedResponse(BaseModel):
    """Paginated response wrapper."""
    items: List[Any]
    meta: PaginationMeta


class TimestampMixin(BaseModel):
    """Mixin for timestamps."""
    created_at: datetime
    updated_at: Optional[datetime] = None

