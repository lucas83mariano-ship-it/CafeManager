from datetime import datetime, timedelta, timezone

from fastapi.security import OAuth2PasswordBearer

from fastapi import Depends, HTTPException

from jose import JWTError, jwt

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models import UsuarioDB

SECRET_KEY = "trocar-por-chave-segura-no-futuro"

ALGORITHM = "HS256"

ACCESS_TOKEN_EXPIRE_MINUTES = 60

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")


def criar_token(dados: dict):

    dados_token = dados.copy()

    expira = datetime.now(timezone.utc) + timedelta(
        minutes=ACCESS_TOKEN_EXPIRE_MINUTES
    )

    dados_token.update({"exp": expira})

    return jwt.encode(
        dados_token,
        SECRET_KEY,
        algorithm=ALGORITHM,
    )

def get_current_user(

    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),

):

    credenciais_invalidas = HTTPException(
        status_code=401,
        detail="Credenciais inválidas.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:

        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM],
        )

        usuario_id = payload.get("sub")

        if usuario_id is None:
            raise credenciais_invalidas

    except JWTError:

        raise credenciais_invalidas

    usuario = (
        db.query(UsuarioDB)
        .filter(UsuarioDB.id == int(usuario_id))
        .first()
    )

    if usuario is None:
        raise credenciais_invalidas

    return usuario

def get_current_admin(

    usuario: UsuarioDB = Depends(get_current_user),

):

    if usuario.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Apenas administradores podem executar esta operação.",
        )

    return usuario