import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoutes() {
  const { signed, loading } = useAuth();

  // 1. Enquanto verifica o token no localStorage, mostra "Carregando..."
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 2. Se não estiver logado, manda pro Login
  // O 'replace' evita que o usuário volte para a página restrita clicando em 'Voltar'
  return signed ? <Outlet /> : <Navigate to="/" replace />;
}
