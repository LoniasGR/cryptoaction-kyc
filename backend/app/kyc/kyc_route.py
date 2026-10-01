import uuid
from typing import Annotated

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status
from sqlalchemy.exc import IntegrityError

from ..auth.deps import adminDependency, is_user_admin, userDependency
from ..db.db import SessionDep
from ..db.kyc_repository import (
    create_kyc_application,
    get_all_applications_db,
    get_single_application_by_id_db,
    get_single_application_db,
)
from ..ipfs.client import add_file
from .kyc import (
    KYCApplicationCreate,
    KYCApplicationSummary,
)

router = APIRouter(prefix="/kyc", tags=["kyc"])


@router.post("", status_code=status.HTTP_201_CREATED)
async def create_kyc_application_route(
    session: SessionDep,
    user: userDependency,
    idFile: Annotated[UploadFile, File()],
    fullName: Annotated[str, Form()],
    email: Annotated[str, Form()],
    blockchainAddress: Annotated[str, Form()],
):
    if is_user_admin(user):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin users cannot create KYC applications",
        )

    id_hash = await add_file(idFile.file.read())
    kyc = KYCApplicationCreate(
        fullName=fullName,
        email=email,
        idFileHash=id_hash,
        blockchainAddress=blockchainAddress,
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
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"An error occurred while creating the KYC application: {e}",
        )


@router.get("", response_model=list[KYCApplicationSummary])
def get_kyc_applications(session: SessionDep, admin: adminDependency):
    apps = []
    for app in get_all_applications_db(session):
        kycBase = KYCApplicationCreate.model_validate({**app.__dict__})
        apps.append(
            KYCApplicationSummary.model_validate(
                {
                    **app.__dict__,
                    "digest": kycBase.create_digest(),
                }
            )
        )
    return apps


@router.get("/me", response_model=KYCApplicationSummary)
def get_my_kyc_application(session: SessionDep, user: userDependency):
    user_id = user.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="User ID not found"
        )
    app = get_single_application_by_id_db(session, uuid.UUID(user_id))
    if app is None:
        raise HTTPException(status_code=404, detail="KYC application not found")
    kycBase = KYCApplicationCreate.model_validate({**app.__dict__})
    return KYCApplicationSummary.model_validate(
        {
            **app.__dict__,
            "digest": kycBase.create_digest(),
        }
    )


@router.get("/{blockchain_address}", response_model=KYCApplicationSummary)
def get_kyc_application(
    session: SessionDep, blockchain_address: str, user: adminDependency
):
    app = get_single_application_db(session, blockchain_address)
    if app is None:
        raise HTTPException(status_code=404, detail="KYC application not found")
    kycBase = KYCApplicationCreate.model_validate({**app.__dict__})
    return KYCApplicationSummary.model_validate(
        {
            **app.__dict__,
            "digest": kycBase.create_digest(),
        }
    )
