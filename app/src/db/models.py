from datetime import datetime

from sqlalchemy import TIMESTAMP, DateTime, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

from ..kyc.kyc import KYCStatus


class SQLBase(DeclarativeBase):
    pass


class KYCApplicationDB(SQLBase):
    __tablename__ = "kyc_applications"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    fullName: Mapped[str] = mapped_column()
    email: Mapped[str] = mapped_column()
    status: Mapped[KYCStatus] = mapped_column()
    # folderCid: Mapped[str] = mapped_column()
    createdAt: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updatedAt: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=datetime.now,
    )
    submittedAt: Mapped[datetime] = mapped_column(DateTime(timezone=True))

    def __repr__(self) -> str:
        return f"KYCApplication(id={self.id}, fullName='{self.fullName}', email='{self.email}', status='{self.status}', createdAt='{self.createdAt}', updatedAt='{self.updatedAt}', submittedAt='{self.submittedAt}')"
