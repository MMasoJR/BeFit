# backend/app/service/ai_service.py
import os
from google import genai
from dotenv import load_dotenv

# Carrega as variáveis do arquivo .env
load_dotenv()

# Configura o cliente da API do Gemini (Novo Padrão)
CHAVE_API = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=CHAVE_API)

def gerar_treino(perfil_aluno: str, lista_equipamentos: list[str]) -> str:
    """
    Função com MOCK (Simulação) ativado enquanto o Google resfria a chave de API.
    """
    
    # Texto falso em Markdown para testarmos o Front-end!
    treino_mock = f"""
### 🚨 **AVISO DE DESENVOLVIMENTO**
*A API do Google está em tempo de recarga. Este é um treino simulado (Mock) para testarmos a interface visual, navegação e PDF.*

---

## **FICHA DE TREINO (SIMULAÇÃO)**

### **TREINO A: Foco em Força**

1. **Supino Reto (Máquina)**
   * **Séries:** 3
   * **Repetições:** 10-12
   * **Foco Biomecânico:** Contração máxima do peitoral, descida controlada em 3 segundos.

2. **Agachamento Livre (Peso Corporal)**
   * **Séries:** 4
   * **Repetições:** 15
   * **Foco Biomecânico:** Calcanhares firmes no chão, postura ereta.

### **TREINO B: Foco em Resistência**

1. **Cadeira Extensora**
   * **Séries:** 3
   * **Repetições:** Até a falha (aprox. 20)
   * **Foco Biomecânico:** Segurar 2 segundos no pico de contração.

2. **Prancha Abdominal (Peso Corporal)**
   * **Séries:** 3
   * **Tempo:** 45 segundos
   * **Foco Biomecânico:** Core travado, respiração constante.
"""
    return treino_mock
    
    # Faz a chamada para a IA usando o novo pacote
    resposta = client.models.generate_content(
        model='gemini-2.0-flash', 
        contents=prompt
    )
    
    return resposta.text