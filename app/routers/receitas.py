from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.helpers import (
    buscar_receita_ou_404,
    calcular_medidas_atualizacao_receita,
    calcular_medidas_receita,
    data_receita_ou_hoje,
    serializar_receita,
    validar_cafe_informado,
)
from app.models import ReceitaDB
from app.schemas import Receita, ReceitaUpdate


router = APIRouter()


@router.post("/receitas")
def cadastrar_receita(receita: Receita, db: Session = Depends(get_db)):
    if receita.cafe_id is not None:
        validar_cafe_informado(db, receita.cafe_id)

    proporcao, agua_ml, cafe_g = calcular_medidas_receita(
        receita.proporcao,
        receita.agua_ml,
        receita.cafe_g,
        validar_zero=True,
    )

    nova_receita = ReceitaDB(
        cafe_id=receita.cafe_id,
        metodo=receita.metodo,
        moedor=receita.moedor,
        clique=receita.clique,
        proporcao=proporcao,
        agua_ml=agua_ml,
        cafe_g=cafe_g,
        data_receita=data_receita_ou_hoje(receita.data_receita),
        avaliacao=receita.avaliacao,
        favorita=receita.favorita,
        comentarios=receita.comentarios,
    )

    db.add(nova_receita)
    db.commit()
    db.refresh(nova_receita)

    return serializar_receita(nova_receita)


@router.get("/receitas")
def listar_receitas(db: Session = Depends(get_db)):
    receitas = db.query(ReceitaDB).all()

    return [serializar_receita(receita) for receita in receitas]


@router.get("/receitas/{id}")
def buscar_receita(id: int, db: Session = Depends(get_db)):
    receita = buscar_receita_ou_404(db, id)

    return serializar_receita(receita)


@router.put("/receitas/{id}")
def atualizar_receita(
    id: int,
    receita: Receita,
    db: Session = Depends(get_db),
):
    receita_db = buscar_receita_ou_404(db, id)
    dados_atualizacao = {
        campo: getattr(receita, campo)
        for campo in receita.model_fields_set
    }

    if receita.cafe_id:
        validar_cafe_informado(db, receita.cafe_id)

    proporcao, agua_ml, cafe_g = calcular_medidas_atualizacao_receita(
        receita_db,
        dados_atualizacao,
    )

    if "cafe_id" in dados_atualizacao:
        receita_db.cafe_id = dados_atualizacao["cafe_id"]

    for campo in (
        "metodo",
        "moedor",
        "clique",
        "data_receita",
        "avaliacao",
        "favorita",
        "comentarios",
    ):
        valor = getattr(receita, campo)
        if valor is not None:
            setattr(receita_db, campo, valor)

    receita_db.proporcao = proporcao
    receita_db.agua_ml = agua_ml
    receita_db.cafe_g = cafe_g

    db.commit()
    db.refresh(receita_db)

    return serializar_receita(receita_db)


@router.patch("/receitas/{id}")
def atualizar_receita_parcial(
    id: int,
    receita: ReceitaUpdate,
    db: Session = Depends(get_db),
):
    receita_db = buscar_receita_ou_404(db, id)
    dados_atualizacao = receita.model_dump(exclude_unset=True)

    if (
        "cafe_id" in dados_atualizacao
        and dados_atualizacao["cafe_id"] is not None
    ):
        validar_cafe_informado(db, dados_atualizacao["cafe_id"])

    for campo, valor in dados_atualizacao.items():
        setattr(receita_db, campo, valor)

    proporcao, agua_ml, cafe_g = calcular_medidas_atualizacao_receita(
        receita_db,
        dados_atualizacao,
    )
    receita_db.proporcao = proporcao
    receita_db.agua_ml = agua_ml
    receita_db.cafe_g = cafe_g

    db.commit()
    db.refresh(receita_db)

    return serializar_receita(receita_db)


@router.delete("/receitas/{id}")
def deletar_receita(id: int, db: Session = Depends(get_db)):
    receita = buscar_receita_ou_404(db, id)

    db.delete(receita)
    db.commit()

    return {
        "mensagem": "Receita removida com sucesso",
    }
