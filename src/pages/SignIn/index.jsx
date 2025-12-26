import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaUser,
  FaLock,
  FaSpinner,
  FaUserShield,
  FaEye,
  FaEyeSlash,
} from "react-icons/fa";
import { useNavigate, Link } from "react-router-dom";

export default function SignIn() {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loadingLocal, setLoadingLocal] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    setLoadingLocal(true);

    if (!email || !senha) {
      setError("Preencha e-mail e senha.");
      setLoadingLocal(false);
      return;
    }

    try {
      await signIn(email, senha);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError("E-mail ou senha inválidos.");
      setLoadingLocal(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 font-sans">
      {/* Container Principal Centralizado */}
      <div className="w-full max-w-[400px]">
        {/* Logo / Header (Fora do Card ou Integrado) */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-emerald-600 p-3 rounded-xl text-white shadow-lg mb-3">
            <FaUserShield size={32} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-wider">
            Gestão de Acesso
          </h1>
          <p className="text-gray-500 text-sm font-mono tracking-tight mt-1">
            Segurança com Simplicidade.
          </p>
        </div>

        {/* Card do Formulário */}
        <div className="bg-white p-8 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-3 text-sm mb-6 rounded-r">
              <p className="font-bold">Erro</p>
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Campo E-mail */}
            <div>
              <label
                className="block text-gray-600 text-xs font-bold mb-2 uppercase tracking-wide"
                htmlFor="email"
              >
                Entrar
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-600">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all bg-gray-50/50 focus:bg-white"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label
                className="block text-gray-600 text-xs font-bold mb-2 uppercase tracking-wide"
                htmlFor="senha"
              >
                Senha
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors group-focus-within:text-emerald-600">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="senha"
                  type={showPassword ? "text" : "password"}
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg text-gray-700 placeholder-gray-300 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all bg-gray-50/50 focus:bg-white"
                  placeholder="********"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                {/* Botão Olho (Mostrar Senha) */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-emerald-600 transition-colors cursor-pointer focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Botão Entrar */}
            <button
              type="submit"
              disabled={loadingLocal}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all transform active:scale-[0.98] ${
                loadingLocal ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loadingLocal ? (
                <FaSpinner className="animate-spin h-5 w-5" />
              ) : (
                "Entrar"
              )}
            </button>

            {/* Botão de Cadastro */}
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Não tem acesso?{" "}
                <Link
                  to="/register"
                  className="font-bold text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Crie sua conta
                </Link>
              </p>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-gray-100 pt-4">
            <p className="text-[10px] text-gray-400 font-mono">
              Esqueceu a senha? Contate o{" "}
              <span className="line-through decoration-emerald-500">
                administrador
              </span>{" "}
              suporte.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
