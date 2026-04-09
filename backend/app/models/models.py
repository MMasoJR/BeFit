# backend/app/models/models.py
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base

class Academia(Base):
    __tablename__ = "academias"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    senha_hash = Column(String)
    plano_ativo = Column(Boolean, default=True)

    # RELACIONAMENTO: Uma academia tem vários equipamentos
    equipamentos = relationship("Equipamento", back_populates="academia")

class Equipamento(Base):
    __tablename__ = "equipamentos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, index=True) 
    grupo_muscular = Column(String)   
    
    # CHAVE ESTRANGEIRA: Diz de qual academia é este equipamento
    academia_id = Column(Integer, ForeignKey("academias.id")) 

    # RELACIONAMENTO: Este equipamento pertence a uma academia
    academia = relationship("Academia", back_populates="equipamentos")