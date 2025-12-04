import React from "react";
import { FaCar, FaClock, FaSyncAlt } from "react-icons/fa";

export default function Dashboard() {
  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Visão geral do sistema</p>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-gray-600 text-sm font-medium">
              Veículos no Pátio
            </span>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <FaCar />
            </div>
          </div>
          <span className="text-3xl font-bold text-gray-900">0</span>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-gray-600 text-sm font-medium">
              Frota em Ação
            </span>
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
              <FaCar />
            </div>
          </div>
          <span className="text-3xl font-bold text-gray-900">0</span>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-gray-600 text-sm font-medium">
              Entradas Hoje
            </span>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <FaCar />
            </div>
          </div>
          <span className="text-3xl font-bold text-gray-900">0</span>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-gray-600 text-sm font-medium">
              Saídas Hoje
            </span>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <FaCar />
            </div>
          </div>
          <span className="text-3xl font-bold text-gray-900">0</span>
        </div>
      </div>

      {/* Seção Movimentação Recente */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-900">
            Movimentação Recente
          </h2>
          <button className="text-gray-400 hover:text-blue-600 transition-colors">
            <FaSyncAlt />
          </button>
        </div>

        {/* Placeholder de "Nenhum dado" igual à imagem */}
        <div className="p-12 flex flex-col items-center justify-center text-gray-300">
          <FaClock size={48} className="mb-4 opacity-50" />
          <p className="text-sm font-medium">Nenhuma movimentação registrada</p>
        </div>
      </div>
    </div>
  );
}
