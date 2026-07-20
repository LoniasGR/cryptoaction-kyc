import uuid
from datetime import datetime, timedelta

from sqlalchemy import func, select

from ..config import EXPIRATION_TIME
from ..kyc.kyc import KYCApplicationCreate, KYCStatus
from .db import SessionDep
from .models import KYCApplicationDB


def create_kyc_application(
    session: SessionDep, kyc: KYCApplicationCreate, user_id: str
):
    kyc_db = KYCApplicationDB(**kyc.model_dump())
    kyc_db.status = KYCStatus.PENDING
    kyc_db.submittedAt = datetime.now()
    kyc_db.id = uuid.UUID(user_id)
    session.add(kyc_db)
    session.commit()
    session.refresh(kyc_db)
    return kyc_db


def get_all_applications(session: SessionDep):
    kyc_applications = session.scalars(select(KYCApplicationDB)).all()
    return kyc_applications


def get_single_application(session: SessionDep, application_id: uuid.UUID):
    stmt = select(KYCApplicationDB).where(KYCApplicationDB.id == application_id)
    kyc_application = session.scalars(stmt).first()
    return kyc_application


def change_application_status(
    session: SessionDep, application_id: uuid.UUID, new_status: KYCStatus
):
    stmt = select(KYCApplicationDB).where(KYCApplicationDB.id == application_id)
    kyc_application = session.scalars(stmt).first()
    if kyc_application is None:
        return None
    if kyc_application.status == KYCStatus.APPROVED:
        kyc_application.expiringAt = None
    kyc_application.status = new_status
    if new_status == KYCStatus.APPROVED:
        kyc_application.expiringAt = datetime.now() + timedelta(seconds=EXPIRATION_TIME)
    session.commit()
    return kyc_application


def get_all_applications_count(session: SessionDep):
    total_applications = session.scalar(
        select(func.count("*")).select_from(KYCApplicationDB)
    )
    return total_applications


def get_all_applications_count_by_status(session: SessionDep, status: KYCStatus):
    stmt = select(func.count()).where(KYCApplicationDB.status == status)
    result = session.scalar(stmt)
    return result
