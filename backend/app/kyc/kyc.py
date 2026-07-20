from datetime import datetime
import uuid

from pydantic import BaseModel
from enum import Enum


class KYCStatus(str, Enum):
    PENDING = "pending"
    APPROVED = "approved"
    REJECTED = "rejected"
    DRAFT = "draft"


class KYCApplicationCreate(BaseModel):
    fullName: str
    email: str
    idFileHash: str


class KYCApplicationSummary(KYCApplicationCreate):
    id: uuid.UUID
    status: KYCStatus
    submittedAt: datetime
    expiringAt: datetime | None = None


class KYCApplicationStatistics(BaseModel):
    total_applications: int
    pending_applications: int
    approved_applications: int
    rejected_applications: int
