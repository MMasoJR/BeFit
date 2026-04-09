"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function AlunosPage() {
  const searchParams = useSearchParams();
  const academiaId = searchParams.get("id");
  
  const [alunos, setAlunos] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. A FUNÇÃO DEVE SER DEFINIDA DENTRO DO COMPONENTE
  const carregarAlunos = async () => {
    if (!academiaId) return;
    setLoading(true);
    try {
      const res = await fetch(`http://127.0.0.1:8000/academias/${academiaId}/alunos`);
      if (res.ok) {
        const data = await res.json();
        setAlunos(data);
      }
    } catch (err) {
      console.error("Erro ao carregar alunos", err);
    } finally {
      setLoading(false);
    }
  };

  // 2. O useEffect chama a função que acabamos de definir acima
  useEffect(() => {
    if (academiaId) {
      carregarAlunos();
    }
  }, [academiaId]);

  // Lógica de busca em tempo real
  const alunosFiltrados = alunos.filter(aluno => 
    aluno.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <header className="flex justify-between items-end border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Meus Alunos</h1>
          <p className="text-gray-400 mt-1">Gerencie a base de alunos e consulte históricos.</p>
        </div>
        
        {/* Barra de busca moderna */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="🔍 Buscar aluno..." 
            className="bg-gray-800 border border-gray-700 rounded-xl px-4 py-2 w-64 outline-none focus:border-blue-500 transition-all text-white"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </header>

      {/* TABELA DE ALUNOS */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead className="bg-gray-900/50 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Nome do Aluno</th>
              <th className="px-6 py-4">Objetivo Principal</th>
              <th className="px-6 py-4 text-center">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {loading ? (
              <tr><td colSpan={3} className="px-6 py-10 text-center text-gray-500">Carregando alunos...</td></tr>
            ) : alunosFiltrados.length > 0 ? (
              alunosFiltrados.map((aluno) => (
                <tr key={aluno.id} className="hover:bg-gray-700/30 transition-colors group">
                  <td className="px-6 py-4 font-medium text-blue-300 group-hover:text-blue-100">{aluno.nome}</td>
                  <td className="px-6 py-4 text-gray-400">{aluno.objetivo}</td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => alert(`Abrindo histórico do ${aluno.nome}...`)}
                      className="bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all border border-blue-500/20"
                    >
                      📜 Ver Histórico
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={3} className="px-6 py-10 text-center text-gray-500 italic">Nenhum aluno encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}