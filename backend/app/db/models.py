import uuid
from datetime import datetime

from sqlalchemy import DateTime, Uuid, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class SQLBase(DeclarativeBase):
    pass


class KYCApplicationDB(SQLBase):
    __tablename__ = "kyc_applications"

    id: Mapped[uuid.UUID] = mapped_column(Uuid(as_uuid=True), primary_key=True)
    fullName: Mapped[str] = mapped_column()
    email: Mapped[str] = mapped_column()
    idFileHash: Mapped[str] = mapped_column()
    blockchainAddress: Mapped[str] = mapped_column(index=True, unique=True)
    createdAt: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updatedAt: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=datetime.now,
    )
    submittedAt: Mapped[datetime] = mapped_column(DateTime(timezone=True))
    expiringAt: Mapped[datetime | None] = mapped_column(
        DateTime(timezone=True), nullable=True
    )

    def __repr__(self) -> str:
        return f"KYCApplication(id={self.id}, fullName='{self.fullName}', email='{self.email}', idFileHash='{self.idFileHash}', createdAt='{self.createdAt}', updatedAt='{self.updatedAt}', submittedAt='{self.submittedAt}', expiringAt='{self.expiringAt}')"
