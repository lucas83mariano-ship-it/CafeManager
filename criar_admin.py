# criar_admin.py

from app.database import SessionLocal
from app.models import UsuarioDB
from app.helpers import gerar_hash

db = SessionLocal()

try:
    admin = (
        db.query(UsuarioDB)
        .filter(UsuarioDB.email == "admin@admin.com")
        .first()
    )

    if admin:
        print(f"Admin já existe: {admin.email}")

    else:
        novo_admin = UsuarioDB(
            nome="Admin",
            email="admin@admin.com",
            senha_hash=gerar_hash("AdminUsu123*"),
            role="admin"
        )

        db.add(novo_admin)
        db.commit()

        print("Admin criado com sucesso.")

finally:
    db.close()