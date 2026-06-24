from pydantic import (BaseModel, field_validator)
from datetime import date

from enum import Enum

class MetodoCafe(str, Enum):

    # Filtragem

    MELITTA = "Melitta"
    HARIO_V60 = "Hario V60"
    CHEMEX = "Chemex"
    KALITA_WAVE = "Kalita Wave"
    COADOR_PANO = "Coador de Pano"
    KOAR = "Koar"
    ORIGAMI = "Origami"
    TRICOLATE = "Tricolate"
    
    # Imersão

    PRENSA_FRANCESA = "Prensa Francesa"
    CLEVER = "Cafeteira Clever"
    AEROPRESS = "Aeropress"

    # Pressão e calor

    MOKA = "Cafeteira Italiana (Moka)"
    ESPRESSO = "Máquina de Espresso"
    SIPHON = "Globinho (Siphon)"
    IBRIK = "Cafeteira Turca (Ibrik)"

    # Frio

    COLD_BREW = "Cold Brew"

    # Outros

    SWITCH = "Hario Switch"

class Cafe(BaseModel):

    empresa: str

    nome_cafe: str

    pontuacao: float | None = None

    fazenda: str | None = None

    produtor: str | None = None

    altitude: int | None = None

    torra: str | None = None

    aroma: str | None = None

    sabor: str | None = None

    retrogosto: str | None = None

    tipo_cafe: str | None = None

    processamento: str | None = None

    origem: str | None = None

    link_produto: str | None = None

    @field_validator("empresa")
    @classmethod
    def validar_empresa(cls, valor):

        if not valor.strip():

            raise ValueError(
                "Empresa é obrigatória"
            )

        if len(valor.strip()) > 200:

            raise ValueError(
                "Empresa deve possuir no máximo 200 caracteres"
            )
        
        return valor.strip()

    @field_validator("nome_cafe")
    @classmethod
    def validar_nome_cafe(cls, valor):

        if not valor.strip():

            raise ValueError(
                "Nome do café é obrigatório"
            )
        
        if len(valor.strip()) > 200:

            raise ValueError(
                "Nome do café deve possuir no máximo 200 caracteres"
            )

        return valor.strip()
    
    @field_validator("pontuacao")
    @classmethod
    def validar_pontuacao(cls, valor):

        if valor is None:
            return valor

        if valor < 0 or valor > 100:

            raise ValueError(
                "Pontuação deve estar entre 0 e 100"
            )

        return valor
    
class Receita(BaseModel):

    cafe_id: int | None = None

    metodo: MetodoCafe

    moedor: str | None = None

    clique: str | None = None

    proporcao: float | None = None

    agua_ml: float | None = None

    cafe_g: float | None = None
    
    data_receita: date | None = None

    avaliacao: float | None = None

    favorita: bool | None = None

    comentarios: str | None = None

    @field_validator("proporcao")
    @classmethod
    def validar_proporcao(cls, valor):

        if valor is None:

            raise ValueError(
                "Proporção deve ser maior que zero"
            )
        
        if valor <= 0:

            raise ValueError(
                "Proporção deve ser maior que zero"
            )

        return valor

    @field_validator("cafe_g")
    @classmethod
    def validar_cafe_g(cls, valor):

        if valor is None:

            raise ValueError(
                "Proporção deve ser maior que zero"
            )
        
        if valor <= 0:

            raise ValueError(
                "Quantidade de café deve ser maior que zero"
            )

        return valor

    @field_validator("agua_ml")
    @classmethod
    def validar_agua_ml(cls, valor):

        if valor is None:

            raise ValueError(
                "Proporção deve ser maior que zero"
            )
        
        if valor <= 0:

            raise ValueError(
                "Quantidade de água deve ser maior que zero"
            )

        return valor

    @field_validator("metodo")
    @classmethod
    def validar_metodo(cls, valor):

        if not valor.strip():

            raise ValueError(
                "Método é obrigatório"
            )

        return valor.strip()
    
    @field_validator("avaliacao")
    @classmethod
    def validar_avaliacao(cls, valor):

        if valor is None:
            return valor

        if valor < 0 or valor > 5:
            raise ValueError(
                "Avaliação deve estar entre 0 e 5"
            )

        return valor