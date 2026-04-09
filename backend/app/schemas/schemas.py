# backend/app/schemas/schemas.py
from pydantic import BaseModel

# Base com os campos comuns
class AcademiaBase(BaseModel):
    nome: str
    email: str

# Schema para RECEBER dados (quando o usuário preenche o formulário de cadastro)
class AcademiaCreate(AcademiaBase):
    senha: str

# Schema para DEVOLVER dados (nunca devolvemos a senha para o front-end!)
class AcademiaResponse(AcademiaBase):
    id: int
    plano_ativo: bool

    class Config:
        # Isso diz ao Pydantic para entender os objetos do banco de dados (SQLAlchemy)
        from_attributes = True

# Base para Equipamentos
class EquipamentoBase(BaseModel):
    nome: str
    grupo_muscular: str

# Schema para RECEBER dados
class EquipamentoCreate(EquipamentoBase):
    academia_id: int # Precisamos saber em qual academia cadastrar

# Schema para DEVOLVER dados
class EquipamentoResponse(EquipamentoBase):
    id: int
    academia_id: int

    class Config:
        from_attributes = True