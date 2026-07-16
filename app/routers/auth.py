from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

from app.dependencies import get_db

from app.models import UsuarioDB

from app.schemas import LoginRequest, LoginResponse

from app.security import verificar_senha

from app.auth import criar_token


router = APIRouter(
    prefix="/login",
    tags=["Autenticação"],
)


@router.post(
    "/",
    response_model=LoginResponse,
)
def login(
    login: LoginRequest,
    db: Session = Depends(get_db),
):

    usuario = (
        db.query(UsuarioDB)
        .filter(UsuarioDB.email == login.email)
        .first()
    )

    if not usuario:

        raise HTTPException(
            status_code=401,
            detail="Email ou senha inválidos.",
        )

    if not verificar_senha(
        login.senha,
        usuario.senha_hash,
    ):

        raise HTTPException(
            status_code=401,
            detail="Email ou senha inválidos.",
        )

    token = criar_token(
        {
            "sub": str(usuario.id),
        }
    )

    return LoginResponse(
        access_token=token,
    )