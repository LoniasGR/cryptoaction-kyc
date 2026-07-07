import logging
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import FastAPI, Security
from fastapi.middleware.cors import CORSMiddleware

from .auth.client_config import CLIENT_ID
from .auth.deps import validate_user
from .db.db import create_db_and_tables
from .ipfs import file_route
from .ipfs.client import get_ipfs_client
from .kyc.kyc_route import router as kyc_router

logger = logging.getLogger(__name__)

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s [%(name)s] %(levelname)s: %(message)s",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    await get_ipfs_client()
    yield


app = FastAPI(
    lifespan=lifespan,
    swagger_ui_init_oauth={
        "clientId": CLIENT_ID,
    },
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(kyc_router)
app.include_router(file_route.router)


@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/test")
async def test(
    user: Annotated[
        dict,
        Security(
            validate_user,
            scopes=["user"],
        ),
    ],
):
    return user
