from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.models import CafeDB, ReceitaDB


MEDIDAS_RECEITA_OBRIGATORIAS = (
    "Informe pelo menos dois dos campos: "
    "proporcao, agua_ml e cafe_g"
)


def serializar_cafe(cafe: CafeDB):
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
        "link_produto": cafe.link_produto,
    }


def serializar_receita(receita: ReceitaDB):
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
        "comentarios": receita.comentarios,
    }


def serializar_receita_do_cafe(receita: ReceitaDB):
    return {
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
        "comentarios": receita.comentarios,
    }


def buscar_cafe_ou_404(db: Session, cafe_id: int):
    cafe = db.query(CafeDB).filter(CafeDB.id == cafe_id).first()

    if not cafe:
        raise HTTPException(
            status_code=404,
            detail="Café não encontrado",
        )

    return cafe


def buscar_receita_ou_404(db: Session, receita_id: int):
    receita = db.query(ReceitaDB).filter(ReceitaDB.id == receita_id).first()

    if not receita:
        raise HTTPException(
            status_code=404,
            detail="Receita não encontrada",
        )

    return receita


def validar_cafe_informado(db: Session, cafe_id: int):
    cafe = db.query(CafeDB).filter(CafeDB.id == cafe_id).first()

    if not cafe:
        raise HTTPException(
            status_code=404,
            detail="Café informado não existe",
        )

    return cafe


def validar_nome_cafe_disponivel(
    db: Session,
    nome_cafe: str,
    cafe_id_atual: int | None = None,
):
    consulta = db.query(CafeDB).filter(CafeDB.nome_cafe.ilike(nome_cafe))

    if cafe_id_atual is not None:
        consulta = consulta.filter(CafeDB.id != cafe_id_atual)

    cafe_existente = consulta.first()

    if cafe_existente:
        raise HTTPException(
            status_code=409,
            detail="Já existe um café com esse nome",
        )


def calcular_medidas_receita(
    proporcao: float | None,
    agua_ml: float | None,
    cafe_g: float | None,
    *,
    validar_zero: bool = False,
):
    campos_preenchidos = sum(
        [
            proporcao is not None,
            agua_ml is not None,
            cafe_g is not None,
        ]
    )

    if campos_preenchidos < 2:
        raise HTTPException(
            status_code=422,
            detail=MEDIDAS_RECEITA_OBRIGATORIAS,
        )

    if campos_preenchidos == 2:
        if validar_zero and proporcao == 0:
            raise HTTPException(
                status_code=422,
                detail="Proporção deve ser maior que zero",
            )

        if validar_zero and cafe_g == 0:
            raise HTTPException(
                status_code=422,
                detail="Quantidade de café deve ser maior que zero",
            )

        if proporcao is None:
            proporcao = agua_ml / cafe_g
        elif agua_ml is None:
            agua_ml = proporcao * cafe_g
        elif cafe_g is None:
            cafe_g = agua_ml / proporcao

    return (
        round(proporcao, 2),
        round(agua_ml, 2),
        round(cafe_g, 2),
    )


def arredondar_medida(valor: float | None):
    if valor is None:
        return valor

    return round(valor, 2)


def calcular_medidas_atualizacao_receita(
    receita_atual: ReceitaDB,
    dados_atualizacao: dict,
):
    campos_medida = ("proporcao", "agua_ml", "cafe_g")

    medidas_enviadas = {
        campo: dados_atualizacao[campo]
        for campo in campos_medida
        if campo in dados_atualizacao
    }

    quantidade_enviada = len(medidas_enviadas)

    # Nenhum campo de medida enviado:
    # mantém exatamente o que já existe
    if quantidade_enviada == 0:
        return (
            arredondar_medida(receita_atual.proporcao),
            arredondar_medida(receita_atual.agua_ml),
            arredondar_medida(receita_atual.cafe_g),
        )

    # Apenas um campo enviado:
    # atualiza somente ele, preservando os demais
    if quantidade_enviada == 1:
        return (
            arredondar_medida(
                medidas_enviadas.get("proporcao", receita_atual.proporcao)
            ),
            arredondar_medida(
                medidas_enviadas.get("agua_ml", receita_atual.agua_ml)
            ),
            arredondar_medida(
                medidas_enviadas.get("cafe_g", receita_atual.cafe_g)
            ),
        )

    # Dois campos enviados:
    # calcula somente o terceiro utilizando APENAS os dois enviados
    if quantidade_enviada == 2:
        return calcular_medidas_receita(
            medidas_enviadas.get("proporcao"),
            medidas_enviadas.get("agua_ml"),
            medidas_enviadas.get("cafe_g"),
        )

    # Três campos enviados:
    # respeita exatamente os valores enviados
    return (
        arredondar_medida(medidas_enviadas["proporcao"]),
        arredondar_medida(medidas_enviadas["agua_ml"]),
        arredondar_medida(medidas_enviadas["cafe_g"]),
    )


def data_receita_ou_hoje(data_receita: date | None):
    return data_receita if data_receita else date.today()
