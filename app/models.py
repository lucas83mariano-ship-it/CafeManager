from sqlalchemy.orm import DeclarativeBase, relationship
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

    usuario_id = Column(Integer, ForeignKey("usuarios.id"))

    usuario = relationship("UsuarioDB", back_populates="cafes")

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

    usuario_id = Column(Integer, ForeignKey("usuarios.id"))

    usuario = relationship("UsuarioDB", back_populates="receitas")

class UsuarioDB(Base):

    __tablename__ = "usuarios"

    id = Column(Integer, primary_key=True, index=True)

    nome = Column(String(200), nullable=False)

    email = Column(String(200), unique=True, nullable=False)

    senha_hash = Column(String(255), nullable=False)

    cafes = relationship("CafeDB", back_populates="usuario")

    receitas = relationship("ReceitaDB", back_populates="usuario")