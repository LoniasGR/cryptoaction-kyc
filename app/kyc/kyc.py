from pydantic import BaseModel


class KYCApplicationCreate(BaseModel):
    fullName: str
    email: str
    idNumber: str


class KYCApplication(KYCApplicationCreate):
    id: int
