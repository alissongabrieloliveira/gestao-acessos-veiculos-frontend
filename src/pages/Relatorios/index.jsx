import React, { useState } from "react";
import api from "../../services/api";
import {
  FaSearch,
  FaFilePdf,
  FaCalendarAlt,
  FaEraser,
  FaFilter,
  FaCar,
  FaUser,
  FaExchangeAlt,
} from "react-icons/fa";

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState("acessos");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [buscaNome, setBuscaNome] = useState("");
  const [buscaPlaca, setBuscaPlaca] = useState("");

  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filtrosUsados, setFiltrosUsados] = useState(null);

  async function handleGerarRelatorio(e) {
    if (e) e.preventDefault();
    setLoading(true);
    setResultados([]);
    setFiltrosUsados(null);

    try {
      let url =
        tipoRelatorio === "acessos"
          ? "/movimentacoes/acessos"
          : "/movimentacoes/frota";
      const params = {};

      if (dataInicio) params.data_inicio = dataInicio;
      if (dataFim) params.data_fim = dataFim;
      if (buscaNome) params.nome = buscaNome;
      if (buscaPlaca) params.placa = buscaPlaca;

      const response = await api.get(url, { params });
      setResultados(response.data);

      setFiltrosUsados({
        tipo:
          tipoRelatorio === "acessos"
            ? "Movimentação de Acessos"
            : "Movimentação de Frota",
        inicio: dataInicio
          ? new Date(dataInicio).toLocaleDateString()
          : "Início",
        fim: dataFim ? new Date(dataFim).toLocaleDateString() : "Hoje",
        nome: buscaNome || "Todos",
        placa: buscaPlaca || "Todas",
        total: response.data.length,
      });
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar relatório.");
    } finally {
      setLoading(false);
    }
  }

  function limparFiltros() {
    setDataInicio("");
    setDataFim("");
    setBuscaNome("");
    setBuscaPlaca("");
    setResultados([]);
    setFiltrosUsados(null);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      {/* --- CABEÇALHO CORPORATIVO (SÓ NO PDF) --- */}
      <div className="hidden print:block font-sans text-gray-900 mb-4">
        <div className="flex justify-between items-end border-b-2 border-black pb-2 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-bold text-2xl rounded-sm">
              G
            </div>
            <div>
              <h1 className="text-2xl font-bold uppercase tracking-tight">
                Gestão de Acesso
              </h1>
              <p className="text-[10px] text-gray-600 uppercase tracking-widest">
                Segurança com Simplicidade
              </p>
            </div>
          </div>
          <div className="text-right text-xs">
            <p>
              <strong>Relatório Analítico</strong>
            </p>
            <p>Emissão: {new Date().toLocaleString()}</p>
          </div>
        </div>

        {/* Resumo dos Filtros (SÓ NO PDF) */}
        {filtrosUsados && (
          <div className="bg-gray-100 border border-gray-300 p-2 text-[10px] grid grid-cols-4 gap-4 mb-4">
            <div>
              <strong>RELATÓRIO:</strong> {filtrosUsados.tipo}
            </div>
            <div>
              <strong>PERÍODO:</strong> {filtrosUsados.inicio} a{" "}
              {filtrosUsados.fim}
            </div>
            <div>
              <strong>FILTRO:</strong> {filtrosUsados.nome}/
              {filtrosUsados.placa}
            </div>
            <div>
              <strong>TOTAL:</strong> {filtrosUsados.total} registros
            </div>
          </div>
        )}
      </div>

      {/* --- INTERFACE DE TELA (WEB) --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Relatórios
          </h1>
          <p className="text-gray-500 mt-1">
            Extraia dados e audite as movimentações.
          </p>
        </div>
        <button
          onClick={handlePrint}
          disabled={resultados.length === 0}
          className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md font-medium disabled:opacity-50"
        >
          <FaFilePdf className="text-red-400" /> Imprimir PDF
        </button>
      </div>

      {/* Filtros de Busca (WEB) */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8 print:hidden">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <FaFilter />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Filtros de Busca</h2>
        </div>

        <form onSubmit={handleGerarRelatorio}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Tipo de Relatório
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaExchangeAlt />
                  </div>
                  <select
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                    value={tipoRelatorio}
                    onChange={(e) => {
                      setTipoRelatorio(e.target.value);
                      setResultados([]);
                      setFiltrosUsados(null);
                    }}
                  >
                    <option value="acessos">Movimentação de Acessos</option>
                    <option value="frota">Movimentação de Frota</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Data Início
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaCalendarAlt />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={dataInicio}
                    onChange={(e) => setDataInicio(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                  Data Fim
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaCalendarAlt />
                  </div>
                  <input
                    type="date"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={dataFim}
                    onChange={(e) => setDataFim(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-px bg-gray-200 mx-auto h-full"></div>

            <div className="lg:col-span-6 flex flex-col justify-between">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Por Nome
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaUser />
                    </div>
                    <input
                      type="text"
                      placeholder="Ex: João Silva"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      value={buscaNome}
                      onChange={(e) => setBuscaNome(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                    Por Placa
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaCar />
                    </div>
                    <input
                      type="text"
                      placeholder="Ex: ABC"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none uppercase transition-all"
                      value={buscaPlaca}
                      onChange={(e) =>
                        setBuscaPlaca(e.target.value.toUpperCase())
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6 justify-end">
                <button
                  type="button"
                  onClick={limparFiltros}
                  className="px-6 py-2.5 rounded-lg text-gray-600 font-medium hover:bg-gray-100 transition-colors flex items-center gap-2"
                >
                  <FaEraser /> Limpar
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-md shadow-blue-200 transition-all flex items-center gap-2 disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">Buscando...</span>
                  ) : (
                    <>
                      <FaSearch /> Filtrar Resultados
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* --- TABELA DE RESULTADOS --- */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden print:shadow-none print:border-none">
        {resultados.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200 print:bg-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:px-1 print:py-1 print:text-black">
                    Data/Hora
                  </th>

                  {tipoRelatorio === "acessos" ? (
                    <>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:px-1 print:py-1 print:text-black">
                        {/* TELA */}{" "}
                        <span className="print:hidden">Pessoa / Veículo</span>
                        {/* PDF */}{" "}
                        <span className="hidden print:block">
                          Identificação
                        </span>
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:px-1 print:py-1 print:text-black">
                        {/* TELA */}{" "}
                        <span className="print:hidden">Localização</span>
                        {/* PDF */}{" "}
                        <span className="hidden print:block">Setor/Posto</span>
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center print:px-1 print:py-1 print:text-black">
                        {/* TELA */}{" "}
                        <span className="print:hidden">Quilometragem (KM)</span>
                        {/* PDF */}{" "}
                        <span className="hidden print:block">KM E/S</span>
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center print:px-1 print:py-1 print:text-black">
                        Status
                      </th>
                    </>
                  ) : (
                    <>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:px-1 print:py-1 print:text-black">
                        {/* TELA */}{" "}
                        <span className="print:hidden">
                          Motorista / Veículo
                        </span>
                        {/* PDF */}{" "}
                        <span className="hidden print:block">
                          Condutor/Veículo
                        </span>
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:px-1 print:py-1 print:text-black">
                        Destino
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center print:px-1 print:py-1 print:text-black">
                        {/* TELA */}{" "}
                        <span className="print:hidden">Quilometragem (KM)</span>
                        {/* PDF */}{" "}
                        <span className="hidden print:block">KM E/S</span>
                      </th>
                      <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-center print:px-1 print:py-1 print:text-black">
                        Total
                      </th>
                    </>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {resultados.map((item, index) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    {/* DATA */}
                    <td className="px-6 py-4 whitespace-nowrap print:px-1 print:py-1 border-b print:border-gray-300">
                      <div className="text-sm font-bold text-gray-900">
                        {new Date(item.data_hora_entrada).toLocaleDateString()}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(item.data_hora_entrada)
                          .toLocaleTimeString()
                          .slice(0, 5)}
                        {item.data_hora_saida &&
                          ` - ${new Date(item.data_hora_saida)
                            .toLocaleTimeString()
                            .slice(0, 5)}`}
                      </div>
                    </td>

                    {tipoRelatorio === "acessos" ? (
                      <>
                        <td className="px-6 py-4 print:px-1 print:py-1 border-b print:border-gray-300">
                          <div className="text-sm font-medium text-gray-900">
                            {item.pessoa_nome}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.veiculo_placa
                              ? `${item.veiculo_modelo} (${item.veiculo_placa})`
                              : "A pé"}
                          </div>
                        </td>
                        <td className="px-6 py-4 print:px-1 print:py-1 border-b print:border-gray-300">
                          <div className="text-sm text-gray-900">
                            {item.setor_nome}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.posto_entrada_nome}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center print:px-1 print:py-1 border-b print:border-gray-300">
                          <div className="text-xs font-mono">
                            E: {item.km_entrada || "-"}
                          </div>
                          <div className="text-xs font-mono">
                            S: {item.km_saida || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center print:px-1 print:py-1 border-b print:border-gray-300">
                          <span
                            className={`print:hidden inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              item.status === "patio"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {item.status.toUpperCase()}
                          </span>
                          <span className="hidden print:block text-xs font-bold">
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        {/* --- CELULAS DE FROTA --- */}
                        <td className="px-6 py-4 print:px-1 print:py-1 border-b print:border-gray-300">
                          <div className="text-sm font-medium text-gray-900">
                            {item.motorista_nome}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.modelo} ({item.placa})
                          </div>
                        </td>
                        <td className="px-6 py-4 print:px-1 print:py-1 border-b print:border-gray-300">
                          <div className="text-sm text-gray-900">
                            {item.cidade_destino}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center print:px-1 print:py-1 border-b print:border-gray-300">
                          <div className="text-xs font-mono">
                            S: {item.km_entrada}
                          </div>
                          <div className="text-xs font-mono">
                            C: {item.km_saida || "-"}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center print:px-1 print:py-1 border-b print:border-gray-300">
                          {item.km_saida ? (
                            <span className="font-bold text-sm">
                              {(item.km_saida - item.km_entrada).toFixed(0)} km
                            </span>
                          ) : (
                            <span className="text-xs font-bold text-yellow-700 bg-yellow-50 px-2 py-1 rounded print:text-black print:bg-transparent print:border print:border-black">
                              EM VIAGEM
                            </span>
                          )}
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Assinaturas (SÓ NO PDF) */}
      <div className="hidden print:grid grid-cols-2 gap-20 mt-16 px-10 text-gray-900">
        <div className="text-center">
          <div className="border-b border-black mb-2"></div>
          <p className="font-bold text-xs uppercase">
            Responsável pela Emissão
          </p>
        </div>
        <div className="text-center">
          <div className="border-b border-black mb-2"></div>
          <p className="font-bold text-xs uppercase">
            Responsável pela Auditoria
          </p>
        </div>
      </div>

      {/* Rodapé Impressão */}
      <div className="hidden print:block mt-8 text-center text-xs text-gray-500 border-t border-gray-300 pt-2">
        Documento gerado eletronicamente por Gestão de Acesso.
      </div>
    </div>
  );
}
