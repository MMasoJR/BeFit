# Arquivo que roda o servidor

# backend/app/main.py
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.database import engine, Base, get_db
from app.models import models
from app.schemas import schemas

# Cria as tabelas no banco se não existirem
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="API BeFit",
    description="Backend para geração de treinos com IA"
)

# ROTAS DE TESTE
@app.get("/")
def read_root():
    return {"mensagem": "API do sistema de treinos está rodando!"}

# ROTAS DE ACADEMIA
@app.post("/academias/", response_model=schemas.AcademiaResponse)
def criar_academia(academia: schemas.AcademiaCreate, db: Session = Depends(get_db)):
    """Rota para cadastrar uma nova academia no sistema."""
    
    # 1. Verifica se o email já existe no banco
    db_academia = db.query(models.Academia).filter(models.Academia.email == academia.email).first()
    if db_academia:
        raise HTTPException(status_code=400, detail="Email já cadastrado no sistema.")

    # 2. Prepara os dados para salvar (IMPORTANTE: Faremos o hash real da senha depois)
    nova_academia = models.Academia(
        nome=academia.nome,
        email=academia.email,
        senha_hash=academia.senha + "_hash_temporario" # TODO: Implementar bcrypt
    )

    # 3. Salva no banco de dados
    db.add(nova_academia)
    db.commit()
    
    # 4. Atualiza o objeto para pegar o ID que o banco gerou
    db.refresh(nova_academia)

    return nova_academia

# ROTAS DE EQUIPAMENTO
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