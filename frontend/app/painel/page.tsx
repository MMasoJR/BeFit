"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

function PainelConteudo() {
  const searchParams = useSearchParams();
  
  // Estados de Identificação e Dados
  const [academiaId, setAcademiaId] = useState("");
  const [listaAlunos, setListaAlunos] = useState<any[]>([]);
  const [alunoSelecionadoId, setAlunoSelecionadoId] = useState("");
  const [perfilExtra, setPerfilExtra] = useState("");

  // Estados de Controle da Interface
  const [loading, setLoading] = useState(false);
  const [treinoGerado, setTreinoGerado] = useState("");
  const [equipamentosUsados, setEquipamentosUsados] = useState<string[]>([]);
  const [erro, setErro] = useState("");
  const [foiSalvo, setFoiSalvo] = useState(false);
  const [exibirModalAluno, setExibirModalAluno] = useState(false);

  // Estados para Novo Aluno
  const [novoNome, setNovoNome] = useState("");
  const [novoObjetivo, setNovoObjetivo] = useState("");

  // 1. Captura o ID da academia da URL e carrega os alunos
  useEffect(() => {
    const id = searchParams.get("id");
    if (id) {
      setAcademiaId(id);
      carregarAlunos(id);
    }
  }, [searchParams]);

  const carregarAlunos = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/academias/${id}/alunos`);
      if (response.ok) {
        const data = await response.json();
        setListaAlunos(data);
      }
    } catch (err) {
      console.error("Erro ao carregar lista de alunos", err);
    }
  };

  // 2. Função para cadastrar um novo aluno rapidamente
  const handleNovoAluno = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8000/alunos/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: novoNome,
          objetivo: novoObjetivo,
          academia_id: parseInt(academiaId)
        }),
      });

      if (response.ok) {
        setNovoNome("");
        setNovoObjetivo("");
        setExibirModalAluno(false);
        carregarAlunos(academiaId); // Atualiza a lista
        alert("Aluno cadastrado com sucesso!");
      }
    } catch (err) {
      alert("Erro ao cadastrar aluno.");
    }
  };

  // 3. Função para gerar o treino com IA
  const handleGerarTreino = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!alunoSelecionadoId) return alert("Selecione um aluno primeiro!");

    setLoading(true);
    setErro("");
    setTreinoGerado("");
    setFoiSalvo(false);

    try {
      const response = await fetch("http://127.0.0.1:8000/treinos/gerar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          academia_id: parseInt(academiaId), 
          aluno_id: parseInt(alunoSelecionadoId),
          perfil_aluno: perfilExtra 
        }),
      });

      if (!response.ok) throw new Error("Erro ao conectar com o motor de IA.");

      const data = await response.json();
      setTreinoGerado(data.treino);
      setEquipamentosUsados(data.equipamentos_utilizados);
    } catch (err: any) {
      setErro(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 4. Salvar no Banco e Exportar PDF
  const salvarNoBanco = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/treinos/salvar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          aluno_id: parseInt(alunoSelecionadoId),
          treino_gerado: treinoGerado
        }),
      });

      if (response.ok) {
        setFoiSalvo(true);
        alert("Treino gravado no histórico do aluno!");
      }
    } catch (error) {
      alert("Erro ao salvar no banco.");
    }
  };

  const baixarPDF = () => window.print();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 print:bg-white print:text-black print:p-0">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Cabeçalho */}
        <header className="flex justify-between items-end border-b border-gray-800 pb-6 print:hidden">
          <div>
            <h1 className="text-3xl font-bold text-blue-400">BeFit - Painel do Instrutor</h1>
            <p className="text-gray-400 mt-1">Gerencie seus alunos e crie treinos de elite.</p>
          </div>
          <div className="text-right text-xs text-gray-500 font-mono">
            Academia ID: {academiaId}
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 print:block">
          
          {/* Lado Esquerdo: Gestão de Aluno */}
          <div className="md:col-span-1 space-y-6 print:hidden">
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
              <h2 className="text-xl font-semibold mb-4 text-blue-300">Seleção de Aluno</h2>
              
              <form onSubmit={handleGerarTreino} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">Escolha o Aluno</label>
                  <select 
                    value={alunoSelecionadoId}
                    onChange={(e) => setAlunoSelecionadoId(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 text-white outline-none"
                    required
                  >
                    <option value="">Selecione pelo nome...</option>
                    {listaAlunos.map((aluno) => (
                      <option key={aluno.id} value={aluno.id}>{aluno.nome}</option>
                    ))}
                  </select>
                </div>

                <button 
                  type="button"
                  onClick={() => setExibirModalAluno(true)}
                  className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  + Cadastrar Novo Aluno
                </button>

                <hr className="border-gray-700 my-4" />

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-400">Contexto do Dia (Opcional)</label>
                  <textarea 
                    value={perfilExtra}
                    onChange={(e) => setPerfilExtra(e.target.value)}
                    rows={3}
                    placeholder="Ex: Aluno relatou cansaço ou dor lombar."
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:border-blue-500 text-white outline-none resize-none" 
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !alunoSelecionadoId}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all"
                >
                  {loading ? "Processando Biomecânica..." : "Gerar Treino com IA"}
                </button>
              </form>
            </div>
          </div>

          {/* Lado Direito: Exibição do Treino */}
          <div className="md:col-span-2 bg-gray-800 rounded-xl shadow-lg min-h-[600px] border border-gray-700 print:border-none print:bg-transparent print:shadow-none">
            {treinoGerado ? (
              <div className="p-8 space-y-6">
                <div id="area-do-treino" className="print:text-black">
                  <div className="hidden print:block mb-6 border-b-2 border-black pb-2">
                    <h2 className="text-3xl font-bold">BeFit - Ficha de Treino</h2>
                    <p className="text-sm italic">Aluno: {listaAlunos.find(a => a.id == alunoSelecionadoId)?.nome}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-6 print:hidden">
                    {equipamentosUsados.map((eq, i) => (
                      <span key={i} className="bg-blue-900/50 text-blue-300 text-[10px] uppercase px-2 py-1 rounded border border-blue-500/30">
                        {eq}
                      </span>
                    ))}
                  </div>

                  <div className="prose prose-invert max-w-none text-gray-300 print:text-black print:prose-headings:text-black print:prose-strong:text-black">
                    <ReactMarkdown>{treinoGerado}</ReactMarkdown>
                  </div>
                </div>

                <div className="flex gap-4 mt-8 print:hidden">
                  <button onClick={salvarNoBanco} disabled={foiSalvo} className="flex-1 bg-gray-700 hover:bg-gray-600 py-3 rounded-lg font-bold flex items-center justify-center gap-2 border border-gray-600">
                    {foiSalvo ? "✅ Treino Salvo" : "💾 Salvar no Histórico"}
                  </button>
                  <button onClick={baixarPDF} className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                    ⬇️ Baixar PDF
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500 space-y-4">
                <div className="text-5xl">🏋️‍♂️</div>
                <p>Selecione um aluno para começar a montagem da ficha.</p>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Cadastro de Aluno (Simples) */}
        {exibirModalAluno && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 p-8 rounded-2xl border border-gray-700 max-w-sm w-full">
              <h3 className="text-xl font-bold mb-4">Novo Aluno</h3>
              <form onSubmit={handleNovoAluno} className="space-y-4">
                <input 
                  type="text" placeholder="Nome Completo" required
                  value={novoNome} onChange={(e) => setNovoNome(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <input 
                  type="text" placeholder="Objetivo (ex: Hipertrofia)" required
                  value={novoObjetivo} onChange={(e) => setNovoObjetivo(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
                <div className="flex gap-2 pt-2">
                  <button type="submit" className="flex-1 bg-blue-600 py-2 rounded-lg font-bold">Cadastrar</button>
                  <button type="button" onClick={() => setExibirModalAluno(false)} className="flex-1 bg-gray-700 py-2 rounded-lg">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PainelInstrutor() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Carregando painel...</div>}>
      <PainelConteudo />
    </Suspense>
  );
}