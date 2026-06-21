from sqlalchemy.orm import DeclarativeBase
from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from datetime import datetime


class Base(DeclarativeBase):
    pass


class CafeDB(Base):

    __tablename__ = "cafes"

    id = Column(Integer, primary_key=True, index=True)

    empresa = Column(String, nullable=False)

    nome_cafe = Column(String, nullable=False, unique=True)

    pontuacao = Column(Float)

    fazenda = Column(String)

    produtor = Column(String)

    altitude = Column(Integer)

    torra = Column(String)

    aroma = Column(String)

    sabor = Column(String)

    retrogosto = Column(String)

    tipo_cafe = Column(String)

    processamento = Column(String)

    origem = Column(String)

    link_produto = Column(String)

class ReceitaDB(Base):

    __tablename__ = "receitas"

    id = Column(Integer, primary_key=True, index=True)

    cafe_id = Column(Integer, ForeignKey("cafes.id"))

    metodo = Column(String)

    proporcao = Column(String)

    agua_g = Column(Float)

    cafe_g = Column(Float)

    data_preparo = Column(DateTime, default=datetime.utcnow)

    comentarios = Column(String)