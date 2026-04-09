# backend/app/models.py

from sqlalchemy import Column, Integer, String, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.database import Base

class Academia(Base):
    __tablename__ = "academias"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    equipamentos = Column(String)
    
    # Relação: Uma academia tem muitos alunos
    alunos = relationship("Aluno", back_populates="academia")

class Aluno(Base):
    __tablename__ = "alunos"
    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    objetivo = Column(String) # Ex: Hipertrofia, Emagrecimento
    data_cadastro = Column(DateTime, default=datetime.utcnow)
    
    academia_id = Column(Integer, ForeignKey("academias.id"))
    
    # Relações
    academia = relationship("Academia", back_populates="alunos")
    fichas = relationship("FichaTreino", back_populates="aluno")

class FichaTreino(Base):
    __tablename__ = "fichas_treino"
    id = Column(Integer, primary_key=True, index=True)
    treino_gerado = Column(Text) # Markdown do Gemini
    data_criacao = Column(DateTime, default=datetime.utcnow)
    
    aluno_id = Column(Integer, ForeignKey("alunos.id"))
    
    # Relação: A ficha pertence a um aluno
    aluno = relationship("Aluno", back_populates="fichas")