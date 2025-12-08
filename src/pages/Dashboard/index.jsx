import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  FaCar,
  FaClock,
  FaSyncAlt,
  FaRoute,
  FaArrowDown,
  FaArrowUp,
  FaCalendarDay,
  FaTachometerAlt,
} from "react-icons/fa";

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

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
    const date = new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    setCurrentDate(date.charAt(0).toUpperCase() + date.slice(1));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          {/* Título alterado para "Dashboard" conforme solicitado */}
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <div className="flex items-center gap-2 text-gray-500 mt-1">
            <FaCalendarDay className="text-gray-400" />
            <p className="text-sm font-medium capitalize">{currentDate}</p>
          </div>
        </div>

        <button
          onClick={loadDashboardData}
          className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-bold shadow-sm hover:bg-gray-50 hover:text-blue-600 transition-all active:scale-95"
        >
          <FaSyncAlt
            className={loading ? "animate-spin text-blue-600" : "text-gray-400"}
          />
          <span>Atualizar Dados</span>
        </button>
      </div>

      {/* --- CARDS DE KPI (Indicadores) --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Card 1: Pátio */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Veículos no Pátio
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              {loading ? "..." : dashboardData.veiculosNoPatio}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <FaCar />
          </div>
        </div>

        {/* Card 2: Frota */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Frota em Ação
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              {loading ? "..." : dashboardData.frotaEmAcao}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <FaRoute />
          </div>
        </div>

        {/* Card 3: Entradas */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Entradas Hoje
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              {loading ? "..." : dashboardData.entradasHoje}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <FaArrowDown />
          </div>
        </div>

        {/* Card 4: Saídas */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
              Saídas Hoje
            </p>
            <h2 className="text-3xl font-black text-gray-900">
              {loading ? "..." : dashboardData.saidasHoje}
            </h2>
          </div>
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
            <FaArrowUp />
          </div>
        </div>
      </div>

      {/* --- SEÇÃO DE LISTAGEM RECENTE --- */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <div>
            <h3 className="text-lg font-bold text-gray-900">
              Atividade Recente
            </h3>
            <p className="text-sm text-gray-500">
              Últimas movimentações registradas.
            </p>
          </div>
        </div>

        {dashboardData.recentes.length === 0 ? (
          <div className="p-12 flex flex-col items-center justify-center text-gray-300">
            <FaClock size={48} className="mb-4 opacity-20" />
            <p className="text-sm font-medium text-gray-400">
              Nenhuma movimentação registrada ainda.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Horários
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Pessoa / Veículo
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Quilometragem (KM)
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {dashboardData.recentes.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    {/* Coluna Horários (Data + Ent/Sai) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg text-gray-400 mt-1">
                          <FaClock size={14} />
                        </div>
                        <div>
                          {/* Data Principal */}
                          <p className="text-sm font-bold text-gray-900 mb-1">
                            {new Date(
                              item.data_hora_entrada
                            ).toLocaleDateString()}
                          </p>

                          {/* Horários Detalhados */}
                          <div className="flex flex-col gap-0.5 text-xs">
                            <span className="text-emerald-600 font-medium">
                              Entrada:{" "}
                              {new Date(
                                item.data_hora_entrada
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                            {item.data_hora_saida ? (
                              <span className="text-rose-600 font-medium">
                                Saída:{" "}
                                {new Date(
                                  item.data_hora_saida
                                ).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            ) : (
                              <span className="text-gray-300">--:--</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Coluna Pessoa / Veículo */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-800">
                          {item.pessoa_nome}
                        </span>
                        <div className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          {item.veiculo_placa ? (
                            <>
                              <FaCar size={10} className="text-gray-400" />
                              {item.veiculo_modelo}{" "}
                              <span className="font-mono bg-gray-100 px-1 rounded text-gray-600 font-bold">
                                {item.veiculo_placa}
                              </span>
                            </>
                          ) : (
                            <span className="italic text-gray-400">
                              Entrada a pé
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Coluna Quilometragem */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        {item.km_entrada ? (
                          <div className="text-xs flex items-center gap-2">
                            <span className="text-gray-400 w-12">Entrada:</span>
                            <span className="font-mono text-gray-700 bg-gray-50 px-1 rounded">
                              {item.km_entrada} km
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-300 italic">
                            Sem KM
                          </span>
                        )}

                        {item.km_saida ? (
                          <div className="text-xs flex items-center gap-2">
                            <span className="text-gray-400 w-12">Saída:</span>
                            <span className="font-mono text-gray-700 bg-gray-50 px-1 rounded">
                              {item.km_saida} km
                            </span>
                          </div>
                        ) : item.status === "patio" && item.km_entrada ? (
                          <span className="text-xs text-blue-400 italic pl-14">
                            No pátio...
                          </span>
                        ) : null}
                      </div>
                    </td>

                    {/* Coluna Status (Pills) */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                          item.status === "patio"
                            ? "bg-blue-50 text-blue-700 border border-blue-100"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${
                            item.status === "patio"
                              ? "bg-blue-500"
                              : "bg-gray-400"
                          }`}
                        ></span>
                        {item.status === "patio" ? "NO PÁTIO" : "FINALIZADO"}
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
