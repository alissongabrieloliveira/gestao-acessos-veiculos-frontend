import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { FaUser, FaLock, FaSpinner } from "react-icons/fa"; // Ícones

export default function SignIn() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const [loadingLocal, setLoadingLocal] = useState(false);

  async function handleLogin(e) {
    e.preventDefault(); // Evita recarregar a página
    setError(""); // Limpa erros anteriores
    setLoadingLocal(true);

    if (!email || !senha) {
      setError("Preencha e-mail e senha.");
      setLoadingLocal(false);
      return;
    }

    try {
      await signIn(email, senha);
      // Se der certo, o AuthContext atualiza o estado 'user'
      // e o Roteador redireciona automaticamente para o Dashboard.
    } catch (err) {
      console.error(err);
      // Tratando o erro visualmente
      setError("E-mail ou senha inválidos. Verifique suas credenciais.");
      setLoadingLocal(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-md">
        {/* Cabeçalho do Card */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800">Portaria Pro</h1>
          <p className="text-slate-500 mt-2">Gerenciamento de Acessos</p>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4 text-sm text-center">
            {error}
          </div>
        )}

        {/* Formulário */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Campo E-mail */}
          <div>
            <label
              className="block text-slate-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              E-mail
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <label
              className="block text-slate-700 text-sm font-bold mb-2"
              htmlFor="senha"
            >
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="text-gray-400" />
              </div>
              <input
                id="senha"
                type="password"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                placeholder="********"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
              />
            </div>
          </div>

          {/* Botão de Entrar */}
          <button
            type="submit"
            disabled={loadingLocal}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ${
              loadingLocal ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loadingLocal ? (
              <FaSpinner className="animate-spin h-5 w-5" />
            ) : (
              "Entrar no Sistema"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Esqueceu a senha? Contate o administrador.
          </p>
        </div>
      </div>
    </div>
  );
}
