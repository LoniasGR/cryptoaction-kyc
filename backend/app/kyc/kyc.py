import uuid
from datetime import datetime
from enum import Enum

from pydantic import BaseModel


class KYCStatus(Enum):
    UNKNOWN = 0
    APPROVED = 1
    REJECTED = 2
    PENDING = 3


class KYCApplicationCreate(BaseModel):
    fullName: str
    email: str
    idFileHash: str
    blockchainAddress: str


class KYCApplicationSummary(KYCApplicationCreate):
    id: uuid.UUID
    status: str
    submittedAt: datetime
    expiringAt: datetime | None = None


class KYCApplicationStatistics(BaseModel):
    total_applications: int
    pending_applications: int
    approved_applications: int
    rejected_applications: int
