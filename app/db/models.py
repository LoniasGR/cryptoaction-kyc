from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column


class SQLBase(DeclarativeBase):
    pass


class KYCApplicationDB(SQLBase):
    __tablename__ = "kyc_applications"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    fullName: Mapped[str] = mapped_column()
    email: Mapped[str] = mapped_column()
    idNumber: Mapped[str] = mapped_column()
    # status: Mapped[str] = mapped_column()

    def __repr__(self) -> str:
        return f"KYCApplication(id={self.id}, fullName='{self.fullName}', email='{self.email}', idNumber='{self.idNumber}')"
