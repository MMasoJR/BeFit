from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

# Importes internos do seu projeto
from app.models import models # Importa o arquivo models.py de dentro da pasta models
from app.db.database import SessionLocal, engine # Importa do arquivo database.py dentro da pasta db
from app.service.ai_service import gerar_treino # Importa do arquivo ai_service.py dentro da pasta service

# Cria as tabelas no banco de dados se elas não existirem
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="BeFit API - Gestão de Treinos com IA")

# Configuração de CORS para permitir que o Next.js (Porta 3001) acesse a API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependência para abrir/fechar a conexão com o banco de dados
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# ESQUEMAS DE DADOS (Pydantic)
# ==========================================

class AcademiaCreate(BaseModel):
    nome: str
    email: str
    senha: str

class AcademiaResponse(BaseModel):
    id: int
    nome: str
    class Config:
        from_attributes = True

class AlunoCreate(BaseModel):
    nome: str
    objetivo: str
    academia_id: int

class AlunoResponse(BaseModel):
    id: int
    nome: str
    objetivo: str
    academia_id: int
    class Config:
        from_attributes = True

class PedidoTreino(BaseModel):
    academia_id: int
    aluno_id: int
    perfil_aluno: str # Descrição adicional (ex: "estou com dor no joelho hoje")

class SalvarTreinoRequest(BaseModel):
    aluno_id: int
    treino_gerado: str

# ==========================================
# ROTAS DE ACADEMIA
# ==========================================

@app.post("/academias/", response_model=AcademiaResponse)
def criar_academia(academia: AcademiaCreate, db: Session = Depends(get_db)):
    # Criamos a academia com alguns equipamentos padrão para teste
    nova_academia = models.Academia(
        nome=academia.nome,
        equipamentos="Supino Reto, Cadeira Extensora, Halteres" # Equipamentos iniciais
    )
    db.add(nova_academia)
    db.commit()
    db.refresh(nova_academia)
    return nova_academia

# ==========================================
# ROTAS DE ALUNOS
# ==========================================

@app.post("/alunos/", response_model=AlunoResponse)
def cadastrar_aluno(aluno: AlunoCreate, db: Session = Depends(get_db)):
    novo_aluno = models.Aluno(
        nome=aluno.nome,
        objetivo=aluno.objetivo,
        academia_id=aluno.academia_id
    )
    db.add(novo_aluno)
    db.commit()
    db.refresh(novo_aluno)
    return novo_aluno

@app.get("/academias/{id_academia}/alunos", response_model=List[AlunoResponse])
def listar_alunos_da_academia(id_academia: int, db: Session = Depends(get_db)):
    return db.query(models.Aluno).filter(models.Aluno.academia_id == id_academia).all()

# ==========================================
# ROTAS DE IA E TREINOS
# ==========================================

@app.post("/treinos/gerar")
def endpoint_gerar_treino(pedido: PedidoTreino, db: Session = Depends(get_db)):
    # 1. Busca a academia e seus equipamentos
    academia = db.query(models.Academia).filter(models.Academia.id == pedido.academia_id).first()
    if not academia:
        raise HTTPException(status_code=404, detail="Academia não encontrada")
    
    # 2. Busca os dados do aluno para dar contexto à IA
    aluno = db.query(models.Aluno).filter(models.Aluno.id == pedido.aluno_id).first()
    if not aluno:
        raise HTTPException(status_code=404, detail="Aluno não encontrado")

    # 3. Monta o perfil completo para o Gemini
    perfil_completo = f"Nome: {aluno.nome}. Objetivo principal: {aluno.objetivo}. Detalhes adicionais: {pedido.perfil_aluno}"
    
    # 4. Chama o serviço de IA
    lista_equipamentos = academia.equipamentos.split(", ")
    treino_texto = gerar_treino(perfil_completo, lista_equipamentos)
    
    return {
        "treino": treino_texto, 
        "equipamentos_utilizados": lista_equipamentos,
        "aluno_nome": aluno.nome
    }

@app.post("/treinos/salvar")
def endpoint_salvar_treino(dados: SalvarTreinoRequest, db: Session = Depends(get_db)):
    nova_ficha = models.FichaTreino(
        aluno_id=dados.aluno_id,
        treino_gerado=dados.treino_gerado
    )
    db.add(nova_ficha)
    db.commit()
    return {"status": "sucesso", "mensagem": "Treino salvo no histórico do aluno!"}

@app.get("/alunos/{id_aluno}/historico")
def ver_historico_aluno(id_aluno: int, db: Session = Depends(get_db)):
    fichas = db.query(models.FichaTreino).filter(models.FichaTreino.aluno_id == id_aluno).all()
    return fichas

@app.get("/academias/{id_academia}/alunos/buscar")
def buscar_aluno_por_nome(id_academia: int, nome: str, db: Session = Depends(get_db)):
    # O filter(models.Aluno.nome.contains(nome)) permite buscar nomes parciais (ex: "Jo" traz "João")
    alunos = db.query(models.Aluno.models).filter(
        models.Aluno.models.academia_id == id_academia,
        models.Aluno.models.nome.contains(nome)
    ).all()
    return alunos