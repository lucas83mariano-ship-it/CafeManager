from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.dependencies import get_db
from app.helpers import (
    buscar_cafe_ou_404,
    serializar_cafe,
    serializar_receita_do_cafe,
)
from app.models import CafeDB, ReceitaDB
from app.schemas import Cafe, CafeUpdate


router = APIRouter()


@router.post("/cafes")
def cadastrar_cafe(cafe: Cafe, db: Session = Depends(get_db)):
    empresa = cafe.empresa.strip()
    nome_cafe = cafe.nome_cafe.strip()

    if not empresa:
        raise HTTPException(
            status_code=400,
            detail="Empresa é obrigatória",
        )

    if not nome_cafe:
        raise HTTPException(
            status_code=400,
            detail="Nome do café é obrigatório",
        )

    cafe_existente = (
        db.query(CafeDB)
        .filter(CafeDB.nome_cafe.ilike(nome_cafe))
        .first()
    )

    if cafe_existente:
        raise HTTPException(
            status_code=409,
            detail="Já existe um café com esse nome",
        )

    novo_cafe = CafeDB(
        empresa=empresa,
        nome_cafe=nome_cafe,
        pontuacao=cafe.pontuacao,
        fazenda=cafe.fazenda,
        produtor=cafe.produtor,
        altitude=cafe.altitude,
        torra=cafe.torra,
        aroma=cafe.aroma,
        sabor=cafe.sabor,
        retrogosto=cafe.retrogosto,
        tipo_cafe=cafe.tipo_cafe,
        processamento=cafe.processamento,
        origem=cafe.origem,
        link_produto=cafe.link_produto,
    )

    db.add(novo_cafe)
    db.commit()
    db.refresh(novo_cafe)

    return serializar_cafe(novo_cafe)


@router.get("/cafes/resumo")
def listar_cafes_resumo(db: Session = Depends(get_db)):
    cafes = db.query(CafeDB).all()

    return [
        {
            "id": cafe.id,
            "nome_cafe": cafe.nome_cafe,
        }
        for cafe in cafes
    ]


@router.get("/cafes/{id}")
def buscar_cafe(id: int, db: Session = Depends(get_db)):
    cafe = buscar_cafe_ou_404(db, id)

    return serializar_cafe(cafe)


@router.get("/cafes")
def listar_cafes(nome_cafe: str = None, db: Session = Depends(get_db)):
    if nome_cafe:
        nome_procurado = nome_cafe.strip().lower()

        cafe = (
            db.query(CafeDB)
            .filter(func.lower(CafeDB.nome_cafe) == nome_procurado)
            .first()
        )

        if not cafe:
            raise HTTPException(
                status_code=404,
                detail="Café não encontrado",
            )

        return serializar_cafe(cafe)

    cafes = db.query(CafeDB).all()

    return [serializar_cafe(cafe) for cafe in cafes]


@router.put("/cafes/{id}")
def atualizar_cafe(id: int, cafe: Cafe, db: Session = Depends(get_db)):
    cafe_db = buscar_cafe_ou_404(db, id)

    cafe_existente = (
        db.query(CafeDB)
        .filter(
            CafeDB.nome_cafe == cafe.nome_cafe,
            CafeDB.id != id,
        )
        .first()
    )

    if cafe_existente:
        raise HTTPException(
            status_code=409,
            detail="Já existe um café com esse nome",
        )

    cafe_db.empresa = cafe.empresa
    cafe_db.nome_cafe = cafe.nome_cafe

    for campo in (
        "pontuacao",
        "fazenda",
        "produtor",
        "altitude",
        "torra",
        "aroma",
        "sabor",
        "retrogosto",
        "tipo_cafe",
        "processamento",
        "origem",
        "link_produto",
    ):
        valor = getattr(cafe, campo)
        if valor is not None:
            setattr(cafe_db, campo, valor)

    db.commit()
    db.refresh(cafe_db)

    return serializar_cafe(cafe_db)


@router.patch("/cafes/{id}")
def atualizar_cafe_parcial(
    id: int,
    cafe: CafeUpdate,
    db: Session = Depends(get_db),
):
    cafe_db = buscar_cafe_ou_404(db, id)
    dados_atualizacao = cafe.model_dump(exclude_unset=True)

    for campo, valor in dados_atualizacao.items():
        setattr(cafe_db, campo, valor)

    db.commit()
    db.refresh(cafe_db)

    return serializar_cafe(cafe_db)


@router.delete("/cafes/{id}")
def deletar_cafe(id: int, db: Session = Depends(get_db)):
    cafe = buscar_cafe_ou_404(db, id)

    db.delete(cafe)
    db.commit()

    return {
        "mensagem": "Café removido com sucesso",
    }


@router.delete("/cafes")
def deletar_cafe_por_nome(nome_cafe: str, db: Session = Depends(get_db)):
    cafe = (
        db.query(CafeDB)
        .filter(CafeDB.nome_cafe.ilike(nome_cafe))
        .first()
    )

    if not cafe:
        raise HTTPException(
            status_code=404,
            detail="Café não encontrado",
        )

    db.delete(cafe)
    db.commit()

    return {
        "mensagem": "Café removido com sucesso",
    }


@router.get("/cafes/{id}/receitas")
def listar_receitas_do_cafe(id: int, db: Session = Depends(get_db)):
    cafe = buscar_cafe_ou_404(db, id)
    receitas = (
        db.query(ReceitaDB)
        .filter(ReceitaDB.cafe_id == id)
        .all()
    )

    return {
        "cafe": {
            "id": cafe.id,
            "empresa": cafe.empresa,
            "nome_cafe": cafe.nome_cafe,
        },
        "receitas": [
            serializar_receita_do_cafe(receita)
            for receita in receitas
        ],
    }
