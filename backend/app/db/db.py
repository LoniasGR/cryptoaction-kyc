from typing import Annotated

from fastapi import Depends
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from ..config import DB_URL
from .models import SQLBase

engine = create_engine(DB_URL, connect_args={"connect_timeout": 10}, echo=True)


def create_db_and_tables():
    SQLBase.metadata.create_all(engine)


def get_session():
    with Session(engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
