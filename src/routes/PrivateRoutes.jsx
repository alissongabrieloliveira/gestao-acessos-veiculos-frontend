import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

// Muda a prop de 'role' para 'tipo' para alinhar com o banco
export default function PrivateRoutes({ tipo }) {
  const { signed, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!signed) {
    return <Navigate to="/" replace />;
  }

  // Validação usando 'tipo_de_usuario'
  if (tipo && user.tipo_de_usuario !== tipo) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
