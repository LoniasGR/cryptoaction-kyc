from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from typing_extensions import Annotated
from .models import SQLBase

from ..config import SQLITE_FILE_NAME

sqlite_url = f"sqlite:///{SQLITE_FILE_NAME}"

connect_args = {"check_same_thread": False}
engine = create_engine(sqlite_url, connect_args=connect_args, echo=True)


def create_db_and_tables():
    SQLBase.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
