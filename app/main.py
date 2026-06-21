from fastapi import (FastAPI, HTTPException)
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import (engine, SessionLocal)
from app.models import (Base, CafeDB, ReceitaDB)
from app.schemas import Cafe
#from pydantic import BaseModel
#from typing import Optional

app = FastAPI()

Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def raiz():
    return {
        "mensagem": "API CafeManager funcionando!"
    }

@app.post("/cafes")
def cadastrar_cafe(cafe: Cafe):

    db: Session = SessionLocal()

    try:

        empresa = cafe.empresa.strip()
        nome_cafe = cafe.nome_cafe.strip()

        if not empresa:

            raise HTTPException(
                status_code=400,
                detail="Empresa é obrigatória"
            )

        if not nome_cafe:

            raise HTTPException(
                status_code=400,
                detail="Nome do café é obrigatório"
            )

        cafe_existente = (
            db.query(CafeDB)
            .filter(
                CafeDB.nome_cafe.ilike(nome_cafe)
            )
            .first()
        )

        if cafe_existente:

            raise HTTPException(
                status_code=409,
                detail="Já existe um café com esse nome"
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

            link_produto=cafe.link_produto
        )

        db.add(novo_cafe)

        db.commit()

        db.refresh(novo_cafe)

        return {
            "id": novo_cafe.id,
            "empresa": novo_cafe.empresa,
            "nome_cafe": novo_cafe.nome_cafe,
            "pontuacao": novo_cafe.pontuacao,
            "altitude": novo_cafe.altitude,
            "origem": novo_cafe.origem,
            "link_produto": novo_cafe.link_produto
        }

    finally:

        db.close()

@app.get("/cafes/{id}")
def buscar_cafe(id: int):

    db: Session = SessionLocal()

    try:

        cafe = (
            db.query(CafeDB)
            .filter(CafeDB.id == id)
            .first()
        )

        if not cafe:

            raise HTTPException(
                status_code=404,
                detail="Café não encontrado"
            )

        return {
            "id": cafe.id,
            "empresa": cafe.empresa,
            "nome_cafe": cafe.nome_cafe,
            "pontuacao": cafe.pontuacao,
            "altitude": cafe.altitude,
            "origem": cafe.origem,
            "link_produto": cafe.link_produto
        }

    finally:

        db.close()

@app.get("/cafes")
def listar_cafes(nome_cafe: str = None):

    db: Session = SessionLocal()

    try:

        if nome_cafe:

            nome_procurado = nome_cafe.strip().lower()

            cafe = (
                db.query(CafeDB)
                .filter(
                    func.lower(CafeDB.nome_cafe)
                    == nome_procurado
                )
                .first()
            )

            if not cafe:

                raise HTTPException(
                    status_code=404,
                    detail="Café não encontrado"
                )

            return {
                "id": cafe.id,
                "empresa": cafe.empresa,
                "nome_cafe": cafe.nome_cafe,
                "pontuacao": cafe.pontuacao,
                "altitude": cafe.altitude,
                "origem": cafe.origem,
                "link_produto": cafe.link_produto
            }

        cafes = db.query(CafeDB).all()

        return [
            {
                "id": cafe.id,
                "empresa": cafe.empresa,
                "nome_cafe": cafe.nome_cafe,
                "id": cafe.id,
                "empresa": cafe.empresa,
                "nome_cafe": cafe.nome_cafe,
                "pontuacao": cafe.pontuacao,
                "altitude": cafe.altitude,
                "origem": cafe.origem,
                "link_produto": cafe.link_produto
            }
            for cafe in cafes
        ]

    finally:

        db.close()

@app.delete("/cafes/{id}")
def deletar_cafe(id: int):

    db: Session = SessionLocal()

    try:

        cafe = (
            db.query(CafeDB)
            .filter(CafeDB.id == id)
            .first()
        )

        if not cafe:

            raise HTTPException(
                status_code=404,
                detail="Café não encontrado"
            )

        db.delete(cafe)

        db.commit()

        return {
            "mensagem": "Café removido com sucesso"
        }

    finally:

        db.close()

@app.delete("/cafes")
def deletar_cafe_por_nome(nome_cafe: str):

    db: Session = SessionLocal()

    try:

        cafe = (
            db.query(CafeDB)
            .filter(
                CafeDB.nome_cafe.ilike(nome_cafe)
            )
            .first()
        )

        if not cafe:

            raise HTTPException(
                status_code=404,
                detail="Café não encontrado"
            )

        db.delete(cafe)

        db.commit()

        return {
            "mensagem": "Café removido com sucesso"
        }

    finally:

        db.close()