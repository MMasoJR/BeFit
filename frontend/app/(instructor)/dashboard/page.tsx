"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const academiaId = searchParams.get("id");
  const [totalAlunos, setTotalAlunos] = useState(0);

  useEffect(() => {
    if (academiaId) {
      fetch(`http://127.0.0.1:8000/academias/${academiaId}/alunos`)
        .then(res => res.json())
        .then(data => setTotalAlunos(data.length))
        .catch(() => setTotalAlunos(0));
    }
  }, [academiaId]);

  return (
    <div className="p-8 space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Bem-vindo, Instrutor!</h1>
        <p className="text-gray-400">Resumo da academia em tempo real.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-xl">
          <p className="text-gray-400 text-sm">Alunos Ativos</p>
          <h3 className="text-4xl font-bold mt-2 text-blue-400">{totalAlunos}</h3>
        </div>
        {/* Outros cards podem seguir a mesma lógica depois */}
      </div>
    </div>
  );
}