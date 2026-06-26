from fastapi import APIRouter, status, HTTPException
from ..db.kyc_repository import (
    change_application_status,
    create_kyc_application,
    get_all_applications,
    get_all_applications_count,
    get_all_applications_count_by_status,
    get_single_application,
)
from ..db.db import SessionDep
from .kyc import (
    KYCApplicationCreate,
    KYCApplicationStatistics,
    KYCApplicationSummary,
    KYCStatus,
)

router = APIRouter(prefix="/kyc")


@router.post("", tags=["kyc"], status_code=status.HTTP_201_CREATED)
def create_kyc_application_route(session: SessionDep, kyc: KYCApplicationCreate):
    return create_kyc_application(session, kyc)


@router.get("", tags=["kyc"])
def get_kyc_applications(session: SessionDep):
    kyc_applications = get_all_applications(session)
    kyc_list: list[KYCApplicationSummary] = []
    for kyc in kyc_applications:
        kyc_list.append(KYCApplicationSummary.model_validate(kyc.__dict__))
    return kyc_list


@router.get("/statistics", tags=["kyc"], response_model=KYCApplicationStatistics)
def get_kyc_statistics(session: SessionDep):
    print("TEST")
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


@router.get("/{application_id}", tags=["kyc"])
def get_kyc_application(session: SessionDep, application_id: int):
    kyc_application = get_single_application(session, application_id)
    if kyc_application is None:
        raise HTTPException(status_code=404, detail="KYC application not found")
    return KYCApplicationSummary.model_validate(kyc_application.__dict__)


@router.put("/{application_id}/approve", tags=["kyc"])
def approve_kyc_application(session: SessionDep, application_id: int):
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


@router.put("/{application_id}/reject", tags=["kyc"])
def reject_kyc_application(session: SessionDep, application_id: int):
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
