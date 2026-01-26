"""Pydantic schemas for mapping endpoints."""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class MappingResponse(BaseModel):
    """CO-PO mapping response schema."""
    id: int
    clo_id: int
    plo_id: int
    strength: str = Field(default="Moderate", description="Strong, Moderate, or Weak")
    created_at: datetime


class CreateMappingRequest(BaseModel):
    """Create mapping request schema."""
    clo_id: int
    plo_id: int
    strength: str = Field(default="Moderate", description="Strong, Moderate, or Weak")


class UpdateMappingRequest(BaseModel):
    """Update mapping request schema."""
    strength: str = Field(..., description="Strong, Moderate, or Weak")

