import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { FaCar, FaClock, FaSyncAlt } from "react-icons/fa";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);

  // Estado único para tudo
  const [dashboardData, setDashboardData] = useState({
    veiculosNoPatio: 0,
    frotaEmAcao: 0,
    entradasHoje: 0,
    saidasHoje: 0,
    recentes: [],
  });

  async function loadDashboardData() {
    setLoading(true);
    try {
      // Apenas UMA requisição agora! Muito mais eficiente.
      const response = await api.get("/dashboard/resumo");
      setDashboardData(response.data);
    } catch (error) {
      console.error("Erro ao carregar dashboard", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboardData();
  }, []);

  return (
    <div>
      {/* Cabeçalho */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Visão geral do sistema</p>
        </div>

        <button
          onClick={loadDashboardData}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors"
        >
          <FaSyncAlt className={loading ? "animate-spin" : ""} />
          Atualizar
        </button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-gray-600 text-sm font-medium">
              Veículos no Pátio
            </span>
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <FaCar />
            </div>
          </div>
          <span className="text-3xl font-bold text-gray-900">
            {loading ? "..." : dashboardData.veiculosNoPatio}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-gray-600 text-sm font-medium">
              Frota em Ação
            </span>
            <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600">
              <FaCar />
            </div>
          </div>
          <span className="text-3xl font-bold text-gray-900">
            {loading ? "..." : dashboardData.frotaEmAcao}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-gray-600 text-sm font-medium">
              Entradas Hoje
            </span>
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <FaCar />
            </div>
          </div>
          <span className="text-3xl font-bold text-gray-900">
            {loading ? "..." : dashboardData.entradasHoje}
          </span>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm flex flex-col justify-between h-32 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start">
            <span className="text-gray-600 text-sm font-medium">
              Saídas Hoje
            </span>
            <div className="p-2 bg-red-100 rounded-lg text-red-600">
              <FaCar />
            </div>
          </div>
          <span className="text-3xl font-bold text-gray-900">
            {loading ? "..." : dashboardData.saidasHoje}
          </span>
        </div>
      </div>

      {/* Seção Movimentação Recente */}
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">
            Movimentação Recente
          </h2>
        </div>

        {dashboardData.recentes.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-300">
            <FaClock size={48} className="mb-4 opacity-50" />
            <p className="text-sm font-medium">
              Nenhuma movimentação registrada
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">Horário</th>
                  <th className="px-6 py-3">Pessoa</th>
                  <th className="px-6 py-3">Veículo</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentes.map((item) => (
                  <tr
                    key={item.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {new Date(item.data_hora_entrada).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">{item.pessoa_nome}</td>
                    <td className="px-6 py-4">
                      {item.veiculo_modelo
                        ? `${item.veiculo_modelo} (${item.veiculo_placa})`
                        : "A pé"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          item.status === "patio"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {item.status === "patio" ? "No Pátio" : "Saiu"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
