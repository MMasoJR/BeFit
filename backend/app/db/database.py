# backend/app/db/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker

# Aqui é onde a mágica acontece. No futuro, trocaremos essa URL para a do PostgreSQL.
SQLALCHEMY_DATABASE_URL = "sqlite:///./befit_database.db"

# connect_args={"check_same_thread": False} é necessário apenas para o SQLite no FastAPI
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Função para abrir e fechar a conexão com o banco em cada requisição
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()