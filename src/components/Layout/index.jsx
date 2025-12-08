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
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-8 no-scrollbar">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
