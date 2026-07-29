from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import UsuarioDB


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

#from app.database import SessionLocal
#
#def get_db():
#
#    db = SessionLocal()
#
#    print("CRIANDO SESSION:", id(db))
#
#    try:
#        yield db
#    finally:
#        print("FECHANDO SESSION:", id(db))
#        db.close()