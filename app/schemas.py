from pydantic import (BaseModel, field_validator)
from datetime import date

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

    metodo: str

    moedor: str | None = None

    clique: str | None = None

    proporcao: float

    agua_ml: float

    cafe_g: float
    
    data_receita: date | None = None

    comentarios: str | None = None

    @field_validator("proporcao")
    @classmethod
    def validar_proporcao(cls, valor):

        if valor <= 0:

            raise ValueError(
                "Proporção deve ser maior que zero"
            )

        return valor

    @field_validator("cafe_g")
    @classmethod
    def validar_cafe_g(cls, valor):

        if valor <= 0:

            raise ValueError(
                "Quantidade de café deve ser maior que zero"
            )

        return valor

    @field_validator("agua_ml")
    @classmethod
    def validar_agua_ml(cls, valor):

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