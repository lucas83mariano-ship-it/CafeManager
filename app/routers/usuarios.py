from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models import UsuarioDB
from app.schemas import Usuario
from app.security import gerar_hash

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post("/")
def cadastrar_usuario(
    usuario: Usuario,
    db: Session = Depends(get_db)
):

    usuario_existente = (
        db.query(UsuarioDB)
        .filter(UsuarioDB.email == usuario.email)
        .first()
    )

    if usuario_existente:

        raise HTTPException(
            status_code=400,
            detail="Já existe um usuário com este e-mail."
        )

    novo_usuario = UsuarioDB(

        nome=usuario.nome,
        email=usuario.email,
        senha_hash=gerar_hash(usuario.senha),

    )

    db.add(novo_usuario)

    db.commit()

    db.refresh(novo_usuario)

    return novo_usuario

@router.get("/")
def listar_usuarios(

    db: Session = Depends(get_db)

):

    return db.query(UsuarioDB).all()