import uuid
from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from sqlalchemy.exc import IntegrityError
from ..auth.deps import userDependency, adminDependency
from ..ipfs.client import add_file

from ..db.db import SessionDep
from ..db.kyc_repository import (
    change_application_status,
    create_kyc_application,
    get_all_applications,
    get_all_applications_count,
    get_all_applications_count_by_status,
    get_single_application,
)
from .kyc import (
    KYCApplicationCreate,
    KYCApplicationStatistics,
    KYCApplicationSummary,
    KYCStatus,
)

router = APIRouter(prefix="/kyc", tags=["kyc"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_kyc_application_route(
    session: SessionDep,
    user: userDependency,
    idFile: Annotated[UploadFile, File()],
    fullName: Annotated[str, Form()],
    email: Annotated[str, Form()],
):
    id_hash = await add_file(idFile.file.read())
    kyc = KYCApplicationCreate(
        fullName=fullName,
        email=email,
        idFileHash=id_hash,
    )
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User ID not found"
        )
    try:
        return create_kyc_application(session, kyc, user_id)
    except IntegrityError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Application for user {user_id} already exists",
        )
    except Exception as e:
        print(e)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the KYC application: {str(e)}",
        )


@router.get("", response_model=list[KYCApplicationSummary])
def get_kyc_applications(session: SessionDep, admin: adminDependency):
    kyc_applications = get_all_applications(session)
    kyc_list: list[KYCApplicationSummary] = []
    for kyc in kyc_applications:
        kyc_list.append(KYCApplicationSummary.model_validate(kyc.__dict__))
    return kyc_list


@router.get("/statistics", response_model=KYCApplicationStatistics)
def get_kyc_statistics(session: SessionDep, admin: adminDependency):
    total_application = get_all_applications_count(session)
    if total_application is None:
        total_application = 0

    pending_applications = get_all_applications_count_by_status(
        session, KYCStatus.PENDING
    )
    if pending_applications is None:
        pending_applications = 0

    approved_applications = get_all_applications_count_by_status(
        session, KYCStatus.APPROVED
    )
    if approved_applications is None:
        approved_applications = 0

    rejected_applications = get_all_applications_count_by_status(
        session, KYCStatus.REJECTED
    )
    if rejected_applications is None:
        rejected_applications = 0

    return {
        "total_applications": total_application,
        "pending_applications": pending_applications,
        "approved_applications": approved_applications,
        "rejected_applications": rejected_applications,
    }


@router.get("/{application_id}", response_model=KYCApplicationSummary)
def get_kyc_application(
    session: SessionDep, application_id: uuid.UUID, admin: adminDependency
):
    kyc_application = get_single_application(session, application_id)
    if kyc_application is None:
        raise HTTPException(status_code=404, detail="KYC application not found")
    return KYCApplicationSummary.model_validate(kyc_application.__dict__)


@router.put("/{application_id}/approve")
def approve_kyc_application(
    session: SessionDep, application_id: uuid.UUID, admin: adminDependency
):
    kyc_application_old = get_single_application(session, application_id)
    if kyc_application_old is None:
        raise HTTPException(status_code=404, detail="KYC application not found")
    if kyc_application_old.status != KYCStatus.PENDING:
        raise HTTPException(
            status_code=400,
            detail=f"KYC application cannot be approved. Current status: {kyc_application_old.status}",
        )
    change_application_status(session, application_id, KYCStatus.APPROVED)
    return {"message": "KYC application approved"}


@router.put("/{application_id}/reject")
def reject_kyc_application(
    session: SessionDep, application_id: uuid.UUID, admin: adminDependency
):
    kyc_application_old = get_single_application(session, application_id)
    if kyc_application_old is None:
        raise HTTPException(status_code=404, detail="KYC application not found")
    if kyc_application_old.status != KYCStatus.PENDING:
        raise HTTPException(
            status_code=400,
            detail=f"KYC application cannot be rejected. Current status: {kyc_application_old.status}",
        )
    change_application_status(session, application_id, KYCStatus.REJECTED)
    return {"message": "KYC application rejected"}
