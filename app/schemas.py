from pydantic import BaseModel


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