from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Date, Boolean
from datetime import date
from pydantic import field_validator


class Base(DeclarativeBase):
    pass


class CafeDB(Base):

    __tablename__ = "cafes"

    id = Column(Integer, primary_key=True, index=True)

    empresa = Column(String(200), nullable=False)

    nome_cafe = Column(String(200), nullable=False, unique=True)

    pontuacao = Column(Float)

    fazenda = Column(String(200))

    produtor = Column(String(200))

    altitude = Column(Integer)

    torra = Column(String(200))

    aroma = Column(String(200))

    sabor = Column(String(200))

    retrogosto = Column(String(200))

    tipo_cafe = Column(String(200))

    processamento = Column(String(200))

    origem = Column(String(200))

    link_produto = Column(String(300))

class ReceitaDB(Base):

    __tablename__ = "receitas"

    id = Column(Integer, primary_key=True, index=True)

    cafe_id = Column(Integer, ForeignKey("cafes.id"))

    metodo = Column(String(200))

    moedor = Column(String(200))

    clique = Column(String(200))

    proporcao = Column(Float)

    agua_ml = Column(Float)

    cafe_g = Column(Float)

    data_receita = Column(Date)

    avaliacao = Column(Float, nullable=True)

    favorita = Column(Boolean, default=False)
    
    comentarios = Column(String(2000))