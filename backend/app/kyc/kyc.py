import hashlib
import json
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

    def to_deterministic_json(self) -> str:
        # Convert the model to a deterministic JSON string with sorted keys and no extra spaces
        return json.dumps(self.model_dump(), sort_keys=True, separators=(",", ":"))

    def create_digest(self) -> str:
        return hashlib.sha256(self.to_deterministic_json().encode()).hexdigest()

    def verify_digest(self, digest: str) -> bool:
        return self.create_digest() == digest


class KYCApplicationSummary(KYCApplicationCreate):
    id: uuid.UUID
    status: str
    digest: str
    verified: bool
    submittedAt: datetime
    expiringAt: datetime | None = None


class KYCApplicationStatistics(BaseModel):
    total_applications: int
    pending_applications: int
    approved_applications: int
    rejected_applications: int
