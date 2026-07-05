from fastapi import FastAPI

from app.database import engine
from app.models import Base
from app.routers import cafes, receitas


app = FastAPI()

Base.metadata.create_all(bind=engine)

app.include_router(cafes.router)
app.include_router(receitas.router)


@app.get("/")
def raiz():
    return {
        "mensagem": "API CafeManager funcionando!",
    }


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
            "Tricolate",
        ],
        "Imersão": [
            "Prensa Francesa",
            "Cafeteira Clever",
            "Aeropress",
        ],
        "Pressão e Calor": [
            "Cafeteira Italiana (Moka)",
            "Máquina de Espresso",
            "Globinho (Siphon)",
            "Cafeteira Turca (Ibrik)",
        ],
        "Extração a Frio": [
            "Cold Brew",
        ],
        "Outros": [
            "Hario Switch",
        ],
    }
