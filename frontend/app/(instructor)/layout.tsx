"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SidebarConteudo() {
  const searchParams = useSearchParams();
  const academiaId = searchParams.get("id") || "";

  // ATUALIZADO: Agora todos os links apontam para as pastas reais
  const links = [
    { name: "📊 Dashboard", href: `/dashboard?id=${academiaId}` },
    { name: "🏋️ Gerador", href: `/gerador?id=${academiaId}` },
    { name: "👥 Meus Alunos", href: `/alunos?id=${academiaId}` }, // <--- CAMINHO CORRIGIDO
  ];

  return (
    <aside className="w-64 bg-gray-800 border-r border-gray-700 p-6 flex flex-col print:hidden shadow-2xl">
      <div className="mb-10">
        <h2 className="text-2xl font-bold text-blue-400">BeFit Pro</h2>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Gestão de Treinos</p>
      </div>

      <nav className="flex-1 space-y-2">
        {links.map((link) => (
          <Link 
            key={link.name} 
            href={link.href} 
            className="block px-4 py-3 rounded-xl hover:bg-blue-600/10 hover:text-blue-400 transition-all border border-transparent hover:border-blue-500/20 font-medium"
          >
            {link.name}
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <div className="text-[10px] text-gray-500 mb-1">UNIDADE ATIVA</div>
        <div className="bg-gray-900 rounded-lg px-3 py-2 text-xs font-mono text-blue-300">
          ID: {academiaId}
        </div>
      </div>
    </aside>
  );
}

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white selection:bg-blue-500/30">
      <Suspense fallback={<div className="w-64 bg-gray-800 border-r border-gray-700"></div>}>
        <SidebarConteudo />
      </Suspense>
      
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}