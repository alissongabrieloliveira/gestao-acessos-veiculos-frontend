import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import Sidebar from "../Sidebar";

export default function Layout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white">
      {/* --- 1. OVERLAY (Fundo escuro no mobile quando menu abre) --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- 2. WRAPPER DA SIDEBAR (Adiciona o comportamento responsivo) --- */}
      <div
        className={`
          fixed inset-y-0 left-0 h-full w-64 bg-blue-900 transition-transform duration-300 ease-in-out
          z-50 
          md:relative md:translate-x-0 
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Botão Fechar (X) */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-4 right-4 text-white text-2xl z-50 md:hidden"
        >
          <FaTimes />
        </button>

        {/* Função que fecha o menu para dentro do componente Sidebar (Só no Mobile) */}
        <Sidebar onClose={() => setIsSidebarOpen(false)} />
      </div>

      {/* --- 3. ÁREA DE CONTEÚDO --- */}
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        {/* HEADER MOBILE (Barra branca com botão Menu - Só aparece no Mobile) */}
        <header className="bg-white shadow-sm border-b p-4 flex items-center gap-4 md:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="text-gray-600 text-2xl focus:outline-none"
          >
            <FaBars />
          </button>
          <span className="font-bold text-gray-700">Menu</span>
        </header>

        {/* Conteúdo Principal (Mantendo suas cores e scroll) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-4 md:p-8 no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
