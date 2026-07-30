import uuid
from datetime import datetime

from sqlalchemy import func, select

from ..kyc.kyc import KYCApplicationCreate
from .db import SessionDep
from .models import KYCApplicationDB


def create_kyc_application(
    session: SessionDep, kyc: KYCApplicationCreate, user_id: str
):
    kyc_db = KYCApplicationDB(**kyc.model_dump())
    kyc_db.submittedAt = datetime.now()
    kyc_db.id = uuid.UUID(user_id)
    session.add(kyc_db)
    session.commit()
    session.refresh(kyc_db)
    return kyc_db


def get_all_applications_db(session: SessionDep):
    kyc_applications = session.scalars(select(KYCApplicationDB)).all()
    return kyc_applications


def get_single_application_db(session: SessionDep, application_id: uuid.UUID):
    stmt = select(KYCApplicationDB).where(KYCApplicationDB.id == application_id)
    kyc_application = session.scalars(stmt).first()
    return kyc_application


def get_all_applications_count_db(session: SessionDep):
    total_applications = session.scalar(
        select(func.count("*")).select_from(KYCApplicationDB)
    )
    return total_applications
