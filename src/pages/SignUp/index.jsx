import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaArrowLeft,
  FaCheckCircle,
} from "react-icons/fa";

export default function SignUp() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/register", { nome, email, senha });
      setSuccess(true);
      // Redirecionar após alguns segundos
      setTimeout(() => navigate("/"), 4000);
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao realizar cadastro.";
      alert(msg);
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        {/* Cabeçalho */}
        <div className="bg-blue-600 px-8 py-6 text-center">
          <h1 className="text-2xl font-bold text-white tracking-wide">
            Criar Conta
          </h1>
          <p className="text-blue-100 text-sm mt-1">
            Solicite seu acesso ao sistema.
          </p>
        </div>

        <div className="p-8">
          {success ? (
            <div className="text-center py-8 animate-fade-in">
              <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <FaCheckCircle size={32} />
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">
                Solicitação Enviada!
              </h2>
              <p className="text-gray-600 mb-6">
                Seu cadastro foi realizado com sucesso.
                <br />
                <span className="font-bold text-gray-800">
                  Aguarde a ativação
                </span>{" "}
                por um administrador para fazer login.
              </p>
              <Link to="/" className="text-blue-600 font-bold hover:underline">
                Voltar para o Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Nome Completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    placeholder="Seu nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  E-mail
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Senha
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-3 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    placeholder="******"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? "Enviando..." : "Cadastrar"}
              </button>

              <div className="text-center pt-4 border-t border-gray-100">
                <Link
                  to="/"
                  className="text-sm font-bold text-gray-500 hover:text-blue-600 flex items-center justify-center gap-2 transition-colors"
                >
                  <FaArrowLeft size={12} /> Já tenho uma conta
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
