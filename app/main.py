from fastapi import (FastAPI, HTTPException)
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import (engine, SessionLocal)
from app.models import (Base, CafeDB, ReceitaDB)
from app.schemas import Cafe, Receita, MetodoCafe
from datetime import date
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


# Rotas para cafés
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

@app.get("/cafes/resumo")
def listar_cafes_resumo():

    db: Session = SessionLocal()

    try:

        cafes = db.query(CafeDB).all()

        return [
            {
                "id": cafe.id,
                "nome_cafe": cafe.nome_cafe
            }
            for cafe in cafes
        ]

    finally:

        db.close()


# Rotas para receitas
@app.post("/receitas")
def cadastrar_receita(receita: Receita):

    db: Session = SessionLocal()

    try:

        if receita.cafe_id:

            cafe = (
                db.query(CafeDB)
                .filter(
                    CafeDB.id == receita.cafe_id
                )
                .first()
            )

            if not cafe:

                raise HTTPException(
                    status_code=404,
                    detail="Café informado não existe"
                )

        data_receita = (
            receita.data_receita
            if receita.data_receita
            else date.today()
        )

        nova_receita = ReceitaDB(

            cafe_id=receita.cafe_id,

            metodo=receita.metodo,

            moedor=receita.moedor,

            clique=receita.clique,

            proporcao=receita.proporcao,

            agua_ml=receita.agua_ml,

            cafe_g=receita.cafe_g,

            data_receita=data_receita,

            comentarios=receita.comentarios
        )

        db.add(nova_receita)

        db.commit()

        db.refresh(nova_receita)

        return {

            "id": nova_receita.id,
            "cafe_id": nova_receita.cafe_id,
            "metodo": nova_receita.metodo,
            "moedor": nova_receita.moedor,
            "clique": nova_receita.clique,
            "proporcao": nova_receita.proporcao,
            "agua_ml": nova_receita.agua_ml,
            "cafe_g": nova_receita.cafe_g,
            "data_receita": nova_receita.data_receita,
            "avaliacao": nova_receita.avaliacao,
            "favorita": nova_receita.favorita,
            "comentarios": nova_receita.comentarios
        }

    finally:

        db.close()

@app.get("/receitas")
def listar_receitas():

    db: Session = SessionLocal()

    try:

        receitas = db.query(ReceitaDB).all()

        return [
            {
                "id": receita.id,
                "cafe_id": receita.cafe_id,
                "metodo": receita.metodo,
                "moedor": receita.moedor,
                "clique": receita.clique,
                "proporcao": receita.proporcao,
                "agua_ml": receita.agua_ml,
                "cafe_g": receita.cafe_g,
                "data_receita": receita.data_receita,
                "avaliacao": receita.avaliacao,
                "favorita": receita.favorita,
                "comentarios": receita.comentarios
            }
            for receita in receitas
        ]

    finally:

        db.close()

@app.get("/receitas/{id}")
def buscar_receita(id: int):

    db: Session = SessionLocal()

    try:

        receita = (
            db.query(ReceitaDB)
            .filter(
                ReceitaDB.id == id
            )
            .first()
        )

        if not receita:

            raise HTTPException(
                status_code=404,
                detail="Receita não encontrada"
            )

        return {
            "id": receita.id,
            "cafe_id": receita.cafe_id,
            "metodo": receita.metodo,
            "moedor": receita.moedor,
            "clique": receita.clique,
            "proporcao": receita.proporcao,
            "agua_ml": receita.agua_ml,
            "cafe_g": receita.cafe_g,
            "data_receita": receita.data_receita,
            "avaliacao": receita.avaliacao,
            "favorita": receita.favorita,
            "comentarios": receita.comentarios
        }

    finally:

        db.close()

@app.delete("/receitas/{id}")
def deletar_receita(id: int):

    db: Session = SessionLocal()

    try:

        receita = (
            db.query(ReceitaDB)
            .filter(
                ReceitaDB.id == id
            )
            .first()
        )

        if not receita:

            raise HTTPException(
                status_code=404,
                detail="Receita não encontrada"
            )

        db.delete(receita)

        db.commit()

        return {
            "mensagem": "Receita removida com sucesso"
        }

    finally:

        db.close()

# Rota para listar receitas de um café específico
@app.get("/cafes/{id}/receitas")
def listar_receitas_do_cafe(id: int):

    db: Session = SessionLocal()

    try:

        cafe = (
            db.query(CafeDB)
            .filter(
                CafeDB.id == id
            )
            .first()
        )

        if not cafe:

            raise HTTPException(
                status_code=404,
                detail="Café não encontrado"
            )

        receitas = (
            db.query(ReceitaDB)
            .filter(
                ReceitaDB.cafe_id == id
            )
            .all()
        )

        return {
            "cafe": {
                "id": cafe.id,
                "empresa": cafe.empresa,
                "nome_cafe": cafe.nome_cafe
            },
            "receitas": [
                {
                    "id": receita.id,
                    "metodo": receita.metodo,
                    "moedor": receita.moedor,
                    "clique": receita.clique,
                    "proporcao": receita.proporcao,
                    "agua_ml": receita.agua_ml,
                    "cafe_g": receita.cafe_g,
                    "data_receita": receita.data_receita,
                    "avaliacao": receita.avaliacao,
                    "favorita": receita.favorita,
                    "comentarios": receita.comentarios
                }
                for receita in receitas
            ]
        }

    finally:

        db.close()

@app.get("/metodos")
def listar_metodos():

    return {

        "Filtragem": [
            "Melitta",
            "Hario V60",
            "Chemex",
            "Kalita Wave",
            "Coador de Pano",
            "Koar",
            "Origami",
            "Tricolate"
        ],

        "Imersão": [
            "Prensa Francesa",
            "Cafeteira Clever",
            "Aeropress"
        ],

        "Pressão e Calor": [
            "Cafeteira Italiana (Moka)",
            "Máquina de Espresso",
            "Globinho (Siphon)",
            "Cafeteira Turca (Ibrik)"
        ],

        "Extração a Frio": [
            "Cold Brew"
        ],

        "Outros": [
            "Hario Switch"
        ]
    }