import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";

export default function Layout() {
  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar Fixa */}
      <Sidebar />

      {/* Área de Conteúdo */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Renderizando as páginas filhas (Dashboard, Cadastros, etc.) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
