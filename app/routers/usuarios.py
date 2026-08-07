from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

#from app.database import SessionLocal
from app.models import UsuarioDB
from app.schemas import Usuario, UsuarioUpdate, UsuarioUpdateParcial, UsuarioResponse, UsuarioRoleUpdate, UsuarioAlterarSenha, UsuarioAdminAlterarSenha
from app.security import gerar_hash, verificar_senha
from app.dependencies import get_db
from app.auth import get_current_user, get_current_admin
from app.helpers import buscar_usuario_ou_404, alterar_senha_usuario

router = APIRouter(
    prefix="/usuarios",
    tags=["Usuários"]
)

@router.post("/", response_model=UsuarioResponse, status_code=201)
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
        role="user"

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

@router.get(
    "/me",
    response_model=UsuarioResponse,
)
def buscar_usuario_logado(
    usuario: UsuarioDB = Depends(get_current_user),
):

    return usuario

@router.put(
    "/me",
    response_model=UsuarioResponse,
)
def atualizar_usuario(
    dados: UsuarioUpdate,
    db: Session = Depends(get_db),
    usuario: UsuarioDB = Depends(get_current_user),
):

    usuario_existente = (
        db.query(UsuarioDB)
        .filter(
            UsuarioDB.email == dados.email,
            UsuarioDB.id != usuario.id,
        )
        .first()
    )

    if usuario_existente:

        raise HTTPException(
            status_code=400,
            detail="Já existe um usuário com este e-mail.",
        )

    usuario.nome = dados.nome.strip()

    usuario.email = dados.email.strip()

    db.commit()

    db.refresh(usuario)

    return usuario

@router.patch(
    "/me",
    response_model=UsuarioResponse,
)
def atualizar_usuario_parcial(
    dados: UsuarioUpdateParcial,
    db: Session = Depends(get_db),
    usuario: UsuarioDB = Depends(get_current_user),
):

    atualizacao = dados.model_dump(exclude_unset=True)

    if not atualizacao:

        raise HTTPException(
            status_code=422,
            detail="Informe pelo menos um campo para atualização.",
        )

    if "email" in atualizacao:

        email = atualizacao["email"].strip()

        usuario_existente = (
            db.query(UsuarioDB)
            .filter(
                UsuarioDB.email == email,
                UsuarioDB.id != usuario.id,
            )
            .first()
        )

        if usuario_existente:

            raise HTTPException(
                status_code=400,
                detail="Já existe um usuário com este e-mail.",
            )

        usuario.email = email

    if "nome" in atualizacao:

        usuario.nome = atualizacao["nome"].strip()

    db.commit()

    db.refresh(usuario)

    return usuario

@router.patch("/me/senha")
def alterar_minha_senha(
    dados: UsuarioAlterarSenha,
    db: Session = Depends(get_db),
    usuario: UsuarioDB = Depends(get_current_user),
):

    if not verificar_senha(
        dados.senha_atual,
        usuario.senha_hash,
    ):

        raise HTTPException(
            status_code=400,
            detail="Senha atual incorreta.",
        )

    alterar_senha_usuario(
        db,
        usuario,
        dados.nova_senha,
    )

    return {
        "mensagem": "Senha alterada com sucesso."
    }

@router.patch("/{id}/senha")
def admin_alterar_senha(
    id: int,
    dados: UsuarioAdminAlterarSenha,
    db: Session = Depends(get_db),
    admin: UsuarioDB = Depends(get_current_user),
):

    if admin.role != "admin":

        raise HTTPException(
            status_code=403,
            detail="Acesso negado.",
        )

    usuario = buscar_usuario_ou_404(
        db,
        id,
    )

    alterar_senha_usuario(
        db,
        usuario,
        dados.nova_senha,
    )

    return {
        "mensagem": "Senha alterada com sucesso."
    }

@router.patch("/{id}/role")
def alterar_role(

    id: int,
    dados: UsuarioRoleUpdate,
    db: Session = Depends(get_db),
    admin: UsuarioDB = Depends(get_current_admin),

):

    if dados.role not in ("user", "admin"):

        raise HTTPException(
            status_code=400,
            detail="Role inválida.",
        )

    usuario = (
        db.query(UsuarioDB)
        .filter(UsuarioDB.id == id)
        .first()
    )

    if not usuario:

        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado.",
        )

    usuario.role = dados.role

    db.commit()

    db.refresh(usuario)

    return usuario

@router.delete("/me")
def excluir_usuario(
    db: Session = Depends(get_db),
    usuario: UsuarioDB = Depends(get_current_user),
):
    
    db.delete(usuario)

    db.commit()

    return {
        "mensagem": (
            "Conta removida com sucesso. "
            "Todos os cafés e receitas cadastrados também foram excluídos."
        )
    }

@router.delete("/{id}")
def excluir_usuario_por_id(

    id: int,
    db: Session = Depends(get_db),
    admin: UsuarioDB = Depends(get_current_admin),

):

    usuario = buscar_usuario_ou_404(
        db,
        id,
    )

    if usuario.id == admin.id:

        raise HTTPException(
            status_code=400,
            detail="Utilize DELETE /usuarios/me para excluir sua própria conta.",
        )

    if usuario.role == "admin":

        total_admins = (
            db.query(UsuarioDB)
            .filter(UsuarioDB.role == "admin")
            .count()
        )

        if total_admins == 1:

            raise HTTPException(
                status_code=400,
                detail="Não é permitido excluir o último administrador.",
            )

    db.delete(usuario)

    db.commit()

    return {
        "mensagem": (
            "Usuário removido com sucesso. "
            "Todos os cafés e receitas cadastrados também foram excluídos."
        )
    }