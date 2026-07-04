from fastapi import FastAPI, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import engine, SessionLocal
from app.models import Base, CafeDB, ReceitaDB
from app.schemas import Cafe, Receita, MetodoCafe, CafeUpdate, ReceitaUpdate
from datetime import date

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
            "fazenda": novo_cafe.fazenda,
            "produtor": novo_cafe.produtor,
            "altitude": novo_cafe.altitude,
            "torra": novo_cafe.torra,
            "aroma": novo_cafe.aroma,
            "sabor": novo_cafe.sabor,
            "retrogosto": novo_cafe.retrogosto,
            "tipo_cafe": novo_cafe.tipo_cafe,
            "processamento": novo_cafe.processamento,
            "origem": novo_cafe.origem,
            "link_produto": novo_cafe.link_produto
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
            "fazenda": cafe.fazenda,
            "produtor": cafe.produtor,
            "altitude": cafe.altitude,
            "torra": cafe.torra,
            "aroma": cafe.aroma,
            "sabor": cafe.sabor,
            "retrogosto": cafe.retrogosto,
            "tipo_cafe": cafe.tipo_cafe,
            "processamento": cafe.processamento,
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
                "fazenda": cafe.fazenda,
                "produtor": cafe.produtor,
                "altitude": cafe.altitude,
                "torra": cafe.torra,
                "aroma": cafe.aroma,
                "sabor": cafe.sabor,
                "retrogosto": cafe.retrogosto,
                "tipo_cafe": cafe.tipo_cafe,
                "processamento": cafe.processamento,
                "origem": cafe.origem,
                "link_produto": cafe.link_produto
            }

        cafes = db.query(CafeDB).all()

        return [
            {
                "id": cafe.id,
                "empresa": cafe.empresa,
                "nome_cafe": cafe.nome_cafe,
                "pontuacao": cafe.pontuacao,
                "fazenda": cafe.fazenda,
                "produtor": cafe.produtor,
                "altitude": cafe.altitude,
                "torra": cafe.torra,
                "aroma": cafe.aroma,
                "sabor": cafe.sabor,
                "retrogosto": cafe.retrogosto,
                "tipo_cafe": cafe.tipo_cafe,
                "processamento": cafe.processamento,
                "origem": cafe.origem,
                "link_produto": cafe.link_produto
            }
            for cafe in cafes
        ]

    finally:

        db.close()

@app.put("/cafes/{id}")
def atualizar_cafe(
    id: int,
    cafe: Cafe
):

    db: Session = SessionLocal()

    try:

        cafe_db = (
            db.query(CafeDB)
            .filter(
                CafeDB.id == id
            )
            .first()
        )

        if not cafe_db:

            raise HTTPException(
                status_code=404,
                detail="Café não encontrado"
            )

        cafe_existente = (
            db.query(CafeDB)
            .filter(
                CafeDB.nome_cafe == cafe.nome_cafe,
                CafeDB.id != id
            )
            .first()
        )

        if cafe_existente:

            raise HTTPException(
                status_code=409,
                detail="Já existe um café com esse nome"
            )

        cafe_db.empresa = cafe.empresa
        cafe_db.nome_cafe = cafe.nome_cafe

        if cafe.pontuacao is not None:
            cafe_db.pontuacao = cafe.pontuacao

        if cafe.fazenda is not None:
            cafe_db.fazenda = cafe.fazenda

        if cafe.produtor is not None:
            cafe_db.produtor = cafe.produtor

        if cafe.altitude is not None:
            cafe_db.altitude = cafe.altitude

        if cafe.torra is not None:
            cafe_db.torra = cafe.torra

        if cafe.aroma is not None:
            cafe_db.aroma = cafe.aroma

        if cafe.sabor is not None:
            cafe_db.sabor = cafe.sabor

        if cafe.retrogosto is not None:
            cafe_db.retrogosto = cafe.retrogosto

        if cafe.tipo_cafe is not None:
            cafe_db.tipo_cafe = cafe.tipo_cafe

        if cafe.processamento is not None:
            cafe_db.processamento = cafe.processamento

        if cafe.origem is not None:
            cafe_db.origem = cafe.origem

        if cafe.link_produto is not None:
            cafe_db.link_produto = cafe.link_produto

        db.commit()

        db.refresh(cafe_db)

        return {
            "id": cafe_db.id,
            "empresa": cafe_db.empresa,
            "nome_cafe": cafe_db.nome_cafe,
            "pontuacao": cafe_db.pontuacao,
            "fazenda": cafe_db.fazenda,
            "produtor": cafe_db.produtor,
            "altitude": cafe_db.altitude,
            "torra": cafe_db.torra,
            "aroma": cafe_db.aroma,
            "sabor": cafe_db.sabor,
            "retrogosto": cafe_db.retrogosto,
            "tipo_cafe": cafe_db.tipo_cafe,
            "processamento": cafe_db.processamento,
            "origem": cafe_db.origem,
            "link_produto": cafe_db.link_produto
        }

    finally:

        db.close()

@app.patch("/cafes/{id}")
def atualizar_cafe_parcial(
    id: int,
    cafe: CafeUpdate
):

    db: Session = SessionLocal()

    try:

        cafe_db = (
            db.query(CafeDB)
            .filter(
                CafeDB.id == id
            )
            .first()
        )

        if not cafe_db:

            raise HTTPException(
                status_code=404,
                detail="Café não encontrado"
            )

        dados_atualizacao = (
            cafe.model_dump(
                exclude_unset=True
            )
        )

        for campo, valor in dados_atualizacao.items():

            setattr(
                cafe_db,
                campo,
                valor
            )

        db.commit()

        db.refresh(cafe_db)

        return {
            "id": cafe_db.id,
            "empresa": cafe_db.empresa,
            "nome_cafe": cafe_db.nome_cafe,
            "pontuacao": cafe_db.pontuacao,
            "fazenda": cafe_db.fazenda,
            "produtor": cafe_db.produtor,
            "altitude": cafe_db.altitude,
            "torra": cafe_db.torra,
            "aroma": cafe_db.aroma,
            "sabor": cafe_db.sabor,
            "retrogosto": cafe_db.retrogosto,
            "tipo_cafe": cafe_db.tipo_cafe,
            "processamento": cafe_db.processamento,
            "origem": cafe_db.origem,
            "link_produto": cafe_db.link_produto
        }

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


# Rotas para receitas

@app.post("/receitas")
def cadastrar_receita(receita: Receita):

    db: Session = SessionLocal()

    try:

        if receita.cafe_id is not None:

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

        campos_preenchidos = sum([
            receita.proporcao is not None,
            receita.agua_ml is not None,
            receita.cafe_g is not None
        ])

        if campos_preenchidos < 2:
        
            raise HTTPException(
                status_code=422,
                detail=(
                    "Informe pelo menos dois dos campos: "
                    "proporcao, agua_ml e cafe_g"
                )
            )

        if campos_preenchidos == 2:
        
            if receita.proporcao == 0:

                raise HTTPException(
                    status_code=422,
                    detail="Proporção deve ser maior que zero"
                )

            if receita.cafe_g == 0:

                raise HTTPException(
                    status_code=422,
                    detail="Quantidade de café deve ser maior que zero"
                )
            
            if receita.proporcao is None:
            
                receita.proporcao = (
                    receita.agua_ml /
                    receita.cafe_g
                )

            elif receita.agua_ml is None:
            
                receita.agua_ml = (
                    receita.proporcao *
                    receita.cafe_g
                )

            elif receita.cafe_g is None:
            
                receita.cafe_g = (
                    receita.agua_ml /
                    receita.proporcao
                )

        receita.proporcao = round(
            receita.proporcao,
            2
        )

        receita.agua_ml = round(
            receita.agua_ml,
            2
        )

        receita.cafe_g = round(
            receita.cafe_g,
            2
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

            avaliacao=receita.avaliacao,

            favorita=receita.favorita,

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

@app.put("/receitas/{id}")
def atualizar_receita(
    id: int,
    receita: Receita
):

    db: Session = SessionLocal()

    try:

        receita_db = (
            db.query(ReceitaDB)
            .filter(
                ReceitaDB.id == id
            )
            .first()
        )

        if not receita_db:

            raise HTTPException(
                status_code=404,
                detail="Receita não encontrada"
            )

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

        proporcao = (
            receita.proporcao
            if receita.proporcao is not None
            else receita_db.proporcao
        )

        agua_ml = (
            receita.agua_ml
            if receita.agua_ml is not None
            else receita_db.agua_ml
        )

        cafe_g = (
            receita.cafe_g
            if receita.cafe_g is not None
            else receita_db.cafe_g
        )

        campos_preenchidos = sum([
            proporcao is not None,
            agua_ml is not None,
            cafe_g is not None
        ])

        if campos_preenchidos < 2:

            raise HTTPException(
                status_code=422,
                detail=(
                    "Informe pelo menos dois dos campos: "
                    "proporcao, agua_ml e cafe_g"
                )
            )

        if campos_preenchidos == 2:

            if proporcao is None:
                proporcao = agua_ml / cafe_g

            elif agua_ml is None:
                agua_ml = proporcao * cafe_g

            elif cafe_g is None:
                cafe_g = agua_ml / proporcao

        receita_db.cafe_id = receita.cafe_id

        if receita.metodo is not None:
            receita_db.metodo = receita.metodo

        if receita.moedor is not None:
            receita_db.moedor = receita.moedor

        if receita.clique is not None:
            receita_db.clique = receita.clique

        receita_db.proporcao = round(proporcao, 2)
        receita_db.agua_ml = round(agua_ml, 2)
        receita_db.cafe_g = round(cafe_g, 2)

        if receita.data_receita is not None:
            receita_db.data_receita = receita.data_receita

        if receita.avaliacao is not None:
            receita_db.avaliacao = receita.avaliacao

        if receita.favorita is not None:
            receita_db.favorita = receita.favorita

        if receita.comentarios is not None:
            receita_db.comentarios = receita.comentarios

        db.commit()

        db.refresh(receita_db)

        return {
            "id": receita_db.id,
            "cafe_id": receita_db.cafe_id,
            "metodo": receita_db.metodo,
            "moedor": receita_db.moedor,
            "clique": receita_db.clique,
            "proporcao": receita_db.proporcao,
            "agua_ml": receita_db.agua_ml,
            "cafe_g": receita_db.cafe_g,
            "data_receita": receita_db.data_receita,
            "avaliacao": receita_db.avaliacao,
            "favorita": receita_db.favorita,
            "comentarios": receita_db.comentarios
        }

    finally:

        db.close()

@app.patch("/receitas/{id}")
def atualizar_receita_parcial(
    id: int,
    receita: ReceitaUpdate
):

    db: Session = SessionLocal()

    try:

        receita_db = (
            db.query(ReceitaDB)
            .filter(
                ReceitaDB.id == id
            )
            .first()
        )

        if not receita_db:

            raise HTTPException(
                status_code=404,
                detail="Receita não encontrada"
            )

        dados_atualizacao = (
            receita.model_dump(
                exclude_unset=True
            )
        )

        # valida cafe_id caso tenha sido informado
        if (
            "cafe_id" in dados_atualizacao
            and
            dados_atualizacao["cafe_id"] is not None
        ):

            cafe = (
                db.query(CafeDB)
                .filter(
                    CafeDB.id ==
                    dados_atualizacao["cafe_id"]
                )
                .first()
            )

            if not cafe:

                raise HTTPException(
                    status_code=404,
                    detail="Café informado não existe"
                )

        # aplica alterações recebidas
        for campo, valor in dados_atualizacao.items():

            setattr(
                receita_db,
                campo,
                valor
            )

        campos_preenchidos = sum([
            receita_db.proporcao is not None,
            receita_db.agua_ml is not None,
            receita_db.cafe_g is not None
        ])

        if campos_preenchidos < 2:

            raise HTTPException(
                status_code=422,
                detail=(
                    "Informe pelo menos dois dos campos: "
                    "proporcao, agua_ml e cafe_g"
                )
            )

        # cálculo automático
        if campos_preenchidos == 2:

            if receita_db.proporcao is None:

                receita_db.proporcao = round(
                    receita_db.agua_ml /
                    receita_db.cafe_g,
                    2
                )

            elif receita_db.agua_ml is None:

                receita_db.agua_ml = round(
                    receita_db.proporcao *
                    receita_db.cafe_g,
                    2
                )

            elif receita_db.cafe_g is None:

                receita_db.cafe_g = round(
                    receita_db.agua_ml /
                    receita_db.proporcao,
                    2
                )

        db.commit()

        db.refresh(receita_db)

        return {
            "id": receita_db.id,
            "cafe_id": receita_db.cafe_id,
            "metodo": receita_db.metodo,
            "moedor": receita_db.moedor,
            "clique": receita_db.clique,
            "proporcao": receita_db.proporcao,
            "agua_ml": receita_db.agua_ml,
            "cafe_g": receita_db.cafe_g,
            "data_receita": receita_db.data_receita,
            "avaliacao": receita_db.avaliacao,
            "favorita": receita_db.favorita,
            "comentarios": receita_db.comentarios
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