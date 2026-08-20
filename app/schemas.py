from datetime import date
from enum import Enum

from pydantic import BaseModel, Field, field_validator, ConfigDict, EmailStr


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


def validar_texto_obrigatorio(
    valor,
    mensagem_obrigatorio: str,
    mensagem_tamanho: str,
    tamanho_maximo: int = 200,
):
    if valor is None:
        raise ValueError(mensagem_obrigatorio)

    valor = valor.strip()

    if not valor:
        raise ValueError(mensagem_obrigatorio)

    if len(valor) > tamanho_maximo:
        raise ValueError(mensagem_tamanho)

    return valor


def validar_numero_entre(
    valor: float | None,
    minimo: float,
    maximo: float,
    mensagem: str,
):
    if valor is None:
        return valor

    if valor < minimo or valor > maximo:
        raise ValueError(mensagem)

    return valor


def validar_numero_maior_que_zero(valor: float | None, mensagem: str):
    if valor is None:
        return valor

    if valor <= 0:
        raise ValueError(mensagem)

    return valor


def validar_empresa_cafe(valor):
    return validar_texto_obrigatorio(
        valor,
        "Empresa é obrigatória",
        "Empresa deve possuir no máximo 200 caracteres",
    )


def validar_nome_do_cafe(valor):
    return validar_texto_obrigatorio(
        valor,
        "Nome do café é obrigatório",
        "Nome do café deve possuir no máximo 200 caracteres",
    )


def validar_pontuacao_cafe(valor: float | None):
    return validar_numero_entre(
        valor,
        0,
        100,
        "Pontuação deve estar entre 0 e 100",
    )


def validar_proporcao_receita(valor: float | None):
    return validar_numero_maior_que_zero(
        valor,
        "Proporção deve ser maior que zero",
    )


def validar_cafe_g_receita(valor: float | None):
    return validar_numero_maior_que_zero(
        valor,
        "Quantidade de café deve ser maior que zero",
    )


def validar_agua_ml_receita(valor: float | None):
    return validar_numero_maior_que_zero(
        valor,
        "Quantidade de água deve ser maior que zero",
    )


def validar_metodo_receita(valor):
    if valor is None:
        return valor

    return valor


def validar_avaliacao_receita(valor: float | None):
    return validar_numero_entre(
        valor,
        0,
        5,
        "Avaliação deve estar entre 0 e 5",
    )


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
        return validar_empresa_cafe(valor)

    @field_validator("nome_cafe")
    @classmethod
    def validar_nome_cafe(cls, valor):
        return validar_nome_do_cafe(valor)

    @field_validator("pontuacao")
    @classmethod
    def validar_pontuacao(cls, valor):
        return validar_pontuacao_cafe(valor)


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
    comentarios: str | None = Field(default=None, max_length=2000)

    @field_validator("proporcao")
    @classmethod
    def validar_proporcao(cls, valor):
        return validar_proporcao_receita(valor)

    @field_validator("cafe_g")
    @classmethod
    def validar_cafe_g(cls, valor):
        return validar_cafe_g_receita(valor)

    @field_validator("agua_ml")
    @classmethod
    def validar_agua_ml(cls, valor):
        return validar_agua_ml_receita(valor)

    @field_validator("metodo")
    @classmethod
    def validar_metodo(cls, valor):
        return validar_metodo_receita(valor)

    @field_validator("avaliacao")
    @classmethod
    def validar_avaliacao(cls, valor):
        return validar_avaliacao_receita(valor)


class CafeUpdate(BaseModel):

    empresa: str | None = None
    nome_cafe: str | None = None
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
        return validar_empresa_cafe(valor)

    @field_validator("nome_cafe")
    @classmethod
    def validar_nome_cafe(cls, valor):
        return validar_nome_do_cafe(valor)

    @field_validator("pontuacao")
    @classmethod
    def validar_pontuacao(cls, valor):
        return validar_pontuacao_cafe(valor)


class ReceitaUpdate(BaseModel):

    cafe_id: int | None = None
    metodo: MetodoCafe | None = None
    moedor: str | None = None
    clique: str | None = None
    proporcao: float | None = None
    agua_ml: float | None = None
    cafe_g: float | None = None
    data_receita: date | None = None
    avaliacao: float | None = None
    favorita: bool | None = None
    comentarios: str | None = Field(default=None, max_length=2000)

    @field_validator("proporcao")
    @classmethod
    def validar_proporcao(cls, valor):
        return validar_proporcao_receita(valor)

    @field_validator("cafe_g")
    @classmethod
    def validar_cafe_g(cls, valor):
        return validar_cafe_g_receita(valor)

    @field_validator("agua_ml")
    @classmethod
    def validar_agua_ml(cls, valor):
        return validar_agua_ml_receita(valor)

    @field_validator("metodo")
    @classmethod
    def validar_metodo(cls, valor):
        return validar_metodo_receita(valor)

    @field_validator("avaliacao")
    @classmethod
    def validar_avaliacao(cls, valor):
        return validar_avaliacao_receita(valor)
    
class Usuario(BaseModel):

    nome: str
    email: EmailStr
    senha: str

    @field_validator("nome")
    @classmethod
    def validar_texto(cls, valor):
        valor = valor.strip()

        if not valor:
            raise ValueError("O campo não pode ser vazio.")

        return valor

    @field_validator("senha")
    @classmethod
    def validar_senha(cls, valor):
        if not valor.strip():
            raise ValueError("A senha não pode ser vazia.")

        return valor

class UsuarioResponse(BaseModel):

    id: int
    nome: str
    email: str
    role: str

    model_config = ConfigDict(from_attributes=True)

class UsuarioUpdate(BaseModel):

    nome: str
    email: EmailStr

    @field_validator("nome")
    @classmethod
    def validar_texto(cls, valor):
        valor = valor.strip()

        if not valor:
            raise ValueError("O campo não pode ser vazio.")

        return valor

class UsuarioUpdateParcial(BaseModel):

    nome: str | None = None
    email: EmailStr | None = None

    @field_validator("nome")
    @classmethod
    def validar_texto(cls, valor):
        if valor is None:
            return None

        valor = valor.strip()

        if not valor:
            raise ValueError("O campo não pode ser vazio.")

        return valor

class UsuarioRoleUpdate(BaseModel):

    role: str

    @field_validator("role")
    @classmethod
    def validar_role(cls, valor):
        valor = valor.strip()

        if valor not in ("user", "admin"):
            raise ValueError(
                "A role deve ser 'user' ou 'admin'."
            )

        return valor

class LoginRequest(BaseModel):

    email: str
    senha: str

class LoginResponse(BaseModel):

    access_token: str
    token_type: str = "bearer"

class UsuarioAlterarSenha(BaseModel):

    senha_atual: str
    nova_senha: str

    @field_validator("senha_atual", "nova_senha")
    @classmethod
    def validar_senha(cls, valor):
        if not valor.strip():
            raise ValueError("A senha não pode ser vazia.")

        return valor


class UsuarioAdminAlterarSenha(BaseModel):

    nova_senha: str

    @field_validator("nova_senha")
    @classmethod
    def validar_senha(cls, valor):
        if not valor.strip():
            raise ValueError("A senha não pode ser vazia.")

        return valor