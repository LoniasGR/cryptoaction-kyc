from fastapi import APIRouter, status

from ..db.db import SessionDep
from .kyc import KYCApplicationCreate, KYCApplication
from ..db.models import KYCApplicationDB

router = APIRouter()


@router.post("/kyc", tags=["kyc"], status_code=status.HTTP_201_CREATED)
async def create_kyc_application(session: SessionDep, kyc: KYCApplicationCreate):
    kyc_db = KYCApplicationDB(**kyc.model_dump())
    session.add(kyc_db)
    session.commit()
    session.refresh(kyc_db)
    return kyc_db


@router.get("/kyc", tags=["kyc"])
async def get_kyc_applications(session: SessionDep):
    kyc_applications = session.query(KYCApplicationDB).all()
    kyc_list: list[KYCApplication] = []
    for kyc in kyc_applications:
        kyc_list.append(KYCApplication.model_validate(kyc.__dict__))
    return kyc_list
