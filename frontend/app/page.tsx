"use client"; // Isso diz ao Next.js que esta página interage com o usuário

import { useState } from "react";

export default function Home() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que a página recarregue

    try {
      // Aqui fazemos a chamada para a nossa API em Python!
      const response = await fetch("http://127.0.0.1:8000/academias/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (response.ok) {
        const data = await response.json();
        setMensagem(`Sucesso! Academia ${data.nome} cadastrada com ID: ${data.id}`);
        // Limpa os campos após o sucesso
        setNome("");
        setEmail("");
        setSenha("");
      } else {
        setMensagem("Erro ao cadastrar academia. Verifique se o e-mail já existe.");
      }
    } catch (error) {
      setMensagem("Erro de conexão com o servidor. O backend está rodando?");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-6 text-white">
      <div className="max-w-md w-full bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-blue-400">BeFit Admin</h1>
        <p className="text-center text-gray-400 mb-8">Cadastre sua academia no sistema</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome da Academia</label>
            <input 
              type="text" 
              required
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white" 
              placeholder="Ex: Iron Works"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">E-mail</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white" 
              placeholder="contato@academia.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Senha</label>
            <input 
              type="password" 
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white" 
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors mt-6"
          >
            Cadastrar Academia
          </button>
        </form>

        {mensagem && (
          <div className="mt-6 p-4 rounded-lg bg-gray-700 text-center font-medium">
            {mensagem}
          </div>
        )}
      </div>
    </div>
  );
}