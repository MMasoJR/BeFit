# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.db.database import engine, Base, get_db
from app.models import models
from app.schemas import schemas

# Cria as tabelas no banco de dados se elas não existirem
models.Base.metadata.create_all(bind=engine)

# Inicializando a aplicação
app = FastAPI(
    title="API BeFit",
    description="Backend para geração de treinos com IA"
)

# CONFIGURAÇÃO DE CORS
# Isso permite que o frontend (Next.js na porta 3000) consiga conversar com a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000", 
        "http://localhost:3001"
    ], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# ==========================================
# ROTAS DE TESTE
# ==========================================
@app.get("/")
def read_root():
    return {"mensagem": "API do sistema de treinos está rodando!"}

@app.get("/status")
def health_check():
    return {"status": "ok", "banco_de_dados": "conectado (sqlite)", "ia": "pendente"}

# ==========================================
# ROTAS DE ACADEMIA
# ==========================================
@app.post("/academias/", response_model=schemas.AcademiaResponse)
def criar_academia(academia: schemas.AcademiaCreate, db: Session = Depends(get_db)):
    """Rota para cadastrar uma nova academia no sistema."""
    
    # 1. Verifica se o email já existe no banco
    db_academia = db.query(models.Academia).filter(models.Academia.email == academia.email).first()
    if db_academia:
        raise HTTPException(status_code=400, detail="Email já cadastrado no sistema.")

    # 2. Prepara os dados para salvar
    nova_academia = models.Academia(
        nome=academia.nome,
        email=academia.email,
        senha_hash=academia.senha + "_hash_temporario" # TODO: Implementar segurança real depois
    )

    # 3. Salva no banco de dados
    db.add(nova_academia)
    db.commit()
    db.refresh(nova_academia)

    return nova_academia

# ==========================================
# ROTAS DE EQUIPAMENTO
# ==========================================
@app.post("/equipamentos/", response_model=schemas.EquipamentoResponse)
def cadastrar_equipamento(equipamento: schemas.EquipamentoCreate, db: Session = Depends(get_db)):
    """Cadastra um novo equipamento vinculado a uma academia."""
    
    # 1. Verifica se a academia realmente existe antes de cadastrar a máquina
    db_academia = db.query(models.Academia).filter(models.Academia.id == equipamento.academia_id).first()
    if not db_academia:
        raise HTTPException(status_code=404, detail="Academia não encontrada.")

    # 2. Salva o equipamento no banco
    novo_equipamento = models.Equipamento(
        nome=equipamento.nome,
        grupo_muscular=equipamento.grupo_muscular,
        academia_id=equipamento.academia_id
    )
    
    db.add(novo_equipamento)
    db.commit()
    db.refresh(novo_equipamento)

    return novo_equipamento

@app.get("/academias/{academia_id}/equipamentos", response_model=list[schemas.EquipamentoResponse])
def listar_equipamentos_da_academia(academia_id: int, db: Session = Depends(get_db)):
    """Lista todos os equipamentos de uma academia específica."""
    
    equipamentos = db.query(models.Equipamento).filter(models.Equipamento.academia_id == academia_id).all()
    return equipamentos