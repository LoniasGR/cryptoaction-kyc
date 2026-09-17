import logging
import uuid
from datetime import datetime, timedelta

from fastapi import HTTPException, status
from sqlalchemy import select

from ..config import EXPIRATION_TIME
from ..db.db import SessionDep
from ..db.kyc_repository import get_single_application_db
from ..db.models import KYCApplicationDB
from ..web3.contract import (
    getAllApplicationsByStatus,
    getAllKycApplications,
    getKycApplication,
    getKycStatus,
    updateKycStatus,
)
from .kyc import KYCApplicationCreate, KYCApplicationSummary, KYCStatus

logger = logging.getLogger(__name__)


def get_all_applications_count_by_status(status: KYCStatus):
    apps = getAllApplicationsByStatus(status.value)
    return len(apps)


def change_application_status(
    session: SessionDep, application_id: uuid.UUID, new_status: KYCStatus
):
    stmt = select(KYCApplicationDB).where(KYCApplicationDB.id == application_id)
    kyc_application = session.scalars(stmt).first()
    if kyc_application is None:
        return None
    status = getKycStatus(kyc_application.blockchainAddress)
    if status == KYCStatus.APPROVED.value:
        kyc_application.expiringAt = None
    if new_status == KYCStatus.APPROVED.value:
        kyc_application.expiringAt = datetime.now() + timedelta(seconds=EXPIRATION_TIME)
    approved = new_status == KYCStatus.APPROVED
    logger.info(
        f"Updating KYC status for {kyc_application.blockchainAddress} to {new_status.name} (approved: {approved})"
    )
    updateKycStatus(kyc_application.blockchainAddress, approved)
    session.commit()
    return kyc_application


def get_all_applications(session: SessionDep):
    applications = getAllKycApplications()
    complete_applications = []
    for app in applications:
        stmt = select(KYCApplicationDB).where(
            KYCApplicationDB.blockchainAddress == app[0]
        )
        kyc_application = session.scalars(stmt).first()
        if kyc_application is None:
            logger.warning(f"KYC application not found for blockchain address {app[0]}")
            continue
        kycBase = KYCApplicationCreate.model_validate({**kyc_application.__dict__})
        verified = kycBase.verify_digest(app[1].hex())
        complete_app = KYCApplicationSummary.model_validate(
            {
                **kyc_application.__dict__,
                "status": KYCStatus(app[2]).name,
                "verified": verified,
                "digest": app[1].hex(),
            }
        )
        complete_applications.append(complete_app)
    return complete_applications


def get_single_application(session: SessionDep, application_id: uuid.UUID):

    kyc_application = get_single_application_db(session, application_id)
    print(f"kyc_application: {kyc_application}")
    if kyc_application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="KYC application not found"
        )
    user_address = kyc_application.blockchainAddress
    application_blockchain = getKycApplication(user_address)
    kycBase = KYCApplicationCreate.model_validate({**kyc_application.__dict__})
    verified = kycBase.verify_digest(application_blockchain[1].hex())
    return KYCApplicationSummary.model_validate(
        {
            **kyc_application.__dict__,
            "status": KYCStatus(application_blockchain[2]).name,
            "verified": verified,
            "digest": application_blockchain[1].hex(),
        }
    )
