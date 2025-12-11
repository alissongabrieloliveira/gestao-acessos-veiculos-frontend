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
  FaShieldAlt,
} from "react-icons/fa";

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState("acessos");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  const [buscaNome, setBuscaNome] = useState("");
  const [buscaPlaca, setBuscaPlaca] = useState("");

  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  // Guardamos os filtros usados para mostrar no PDF
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

      // Salva os filtros para o cabeçalho do PDF
      setFiltrosUsados({
        tipo:
          tipoRelatorio === "acessos"
            ? "Movimentação de Acessos"
            : "Movimentação de Frota",
        inicio: dataInicio
          ? new Date(dataInicio).toLocaleDateString()
          : "Início",
        fim: dataFim ? new Date(dataFim).toLocaleDateString() : "Hoje",
        nome: buscaNome,
        placa: buscaPlaca,
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
      {/* Cabeçalho de Impressão (SÓ APARECE NO PDF) Este bloco usa a classe 'hidden print:block'*/}
      <div className="hidden print:block mb-8 border-b-2 border-gray-800 pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            {/* Simulação de Logo */}
            <div className="w-16 h-16 bg-gray-800 text-white flex items-center justify-center rounded-lg text-2xl font-bold">
              P
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">PORTARIA PRO</h1>
              <p className="text-sm text-gray-600">
                Sistema de Gestão de Segurança e Frota
              </p>
            </div>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold uppercase text-gray-800">
              Relatório Analítico
            </h2>
            <p className="text-sm text-gray-500">
              Gerado em: {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Resumo dos Filtros no Papel */}
        {filtrosUsados && (
          <div className="mt-6 bg-gray-100 p-4 rounded border border-gray-300 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong className="text-gray-700">Tipo:</strong>{" "}
                {filtrosUsados.tipo}
              </p>
              <p>
                <strong className="text-gray-700">Período:</strong>{" "}
                {filtrosUsados.inicio} até {filtrosUsados.fim}
              </p>
            </div>
            <div className="text-right">
              {filtrosUsados.nome && (
                <p>
                  Filtro Nome: <strong>{filtrosUsados.nome}</strong>
                </p>
              )}
              {filtrosUsados.placa && (
                <p>
                  Filtro Placa: <strong>{filtrosUsados.placa}</strong>
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Interface de Tela (Some na impressão graças ao CSS global em index.css) */}

      {/* Cabeçalho Tela */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 print:hidden">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Relatórios
          </h1>
          <p className="text-gray-500 mt-1">
            Extraia dados e audite as movimentações do sistema.
          </p>
        </div>
        <button
          onClick={handlePrint}
          disabled={resultados.length === 0}
          className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg flex items-center gap-2 transition-all shadow-md disabled:opacity-50 disabled:shadow-none font-medium"
        >
          <FaFilePdf className="text-red-400" /> Exportar PDF
        </button>
      </div>

      {/* Card de Filtros */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8 print:hidden">
        <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
          <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
            <FaFilter />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Filtros de Busca</h2>
        </div>

        <form onSubmit={handleGerarRelatorio}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Coluna 1: Tipo e Datas */}
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
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-gray-700 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none appearance-none"
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

            {/* Coluna 2: Busca Específica */}
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

      {/* Área de Resultados (TABELA)*/}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden print:shadow-none print:border-2 print:border-gray-300 min-h-[300px]">
        {resultados.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center py-20 text-gray-400 print:hidden">
            <div
              className={`p-4 rounded-full mb-4 ${
                filtrosUsados ? "bg-red-50 text-red-400" : "bg-gray-50"
              }`}
            >
              {filtrosUsados ? <FaSearch size={32} /> : <FaFilter size={32} />}
            </div>
            <p className="text-lg font-medium text-gray-500">
              {filtrosUsados
                ? "Nenhum registro encontrado."
                : "Utilize os filtros para gerar o relatório."}
            </p>
          </div>
        ) : (
          <div>
            <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 flex justify-between items-center print:hidden">
              <span className="text-sm font-medium text-gray-500">
                Registros encontrados:
              </span>
              <span className="bg-white border border-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                {resultados.length}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200 print:bg-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:text-black print:border print:border-gray-400">
                      Data/Hora
                    </th>

                    {tipoRelatorio === "acessos" ? (
                      <>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:text-black print:border print:border-gray-400">
                          Pessoa / Veículo
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:text-black print:border print:border-gray-400">
                          Localização
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:text-black print:border print:border-gray-400">
                          KM Ent.
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:text-black print:border print:border-gray-400">
                          KM Sai.
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:text-black print:border print:border-gray-400">
                          Status
                        </th>
                      </>
                    ) : (
                      <>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:text-black print:border print:border-gray-400">
                          Motorista / Veículo
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:text-black print:border print:border-gray-400">
                          Destino
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:text-black print:border print:border-gray-400">
                          KM Saída
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:text-black print:border print:border-gray-400">
                          KM Cheg.
                        </th>
                        <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider print:text-black print:border print:border-gray-400">
                          Total
                        </th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 print:divide-gray-300">
                  {resultados.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-50/30 transition-colors print:border-b print:border-gray-300"
                    >
                      <td className="px-6 py-4 whitespace-nowrap print:px-2 print:py-2">
                        <div className="text-sm font-bold text-gray-900">
                          {new Date(
                            item.data_hora_entrada
                          ).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-gray-500 print:text-black">
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
                          <td className="px-6 py-4 print:px-2 print:py-2">
                            <div className="text-sm font-medium text-gray-900">
                              {item.pessoa_nome}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 print:text-black">
                              {item.veiculo_placa ? (
                                <>
                                  {item.veiculo_modelo} ({item.veiculo_placa})
                                </>
                              ) : (
                                <>A pé</>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 print:px-2 print:py-2">
                            <div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 print:bg-transparent print:text-black print:border print:border-black print:p-0">
                                {item.setor_nome}
                              </span>
                            </div>
                            <div className="text-xs text-gray-400 mt-1 print:text-black">
                              Posto: {item.posto_entrada_nome}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm font-mono text-gray-600 print:px-2 print:py-2 print:text-black">
                            {item.km_entrada || "-"}
                          </td>
                          <td className="px-6 py-4 text-sm font-mono text-gray-600 print:px-2 print:py-2 print:text-black">
                            {item.km_saida || "-"}
                          </td>
                          <td className="px-6 py-4 print:px-2 print:py-2">
                            <span
                              className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full print:bg-transparent print:text-black print:border print:border-black ${
                                item.status === "patio"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-green-100 text-green-800"
                              }`}
                            >
                              {item.status.toUpperCase()}
                            </span>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-6 py-4 print:px-2 print:py-2">
                            <div className="text-sm font-medium text-gray-900">
                              {item.motorista_nome}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center gap-1 print:text-black">
                              {item.modelo} ({item.placa})
                            </div>
                          </td>
                          <td className="px-6 py-4 print:px-2 print:py-2">
                            <div className="text-sm text-gray-900 font-medium">
                              {item.cidade_destino}
                            </div>
                            <div className="text-xs text-gray-500 print:text-black">
                              {item.cidade_uf}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-mono print:px-2 print:py-2">
                            {item.km_entrada}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900 font-mono print:px-2 print:py-2">
                            {item.km_saida || "---"}
                          </td>
                          <td className="px-6 py-4 print:px-2 print:py-2">
                            {item.km_saida ? (
                              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded print:bg-transparent print:text-black">
                                {(item.km_saida - item.km_entrada).toFixed(2)}{" "}
                                km
                              </span>
                            ) : (
                              <span className="text-xs font-bold">VIAGEM</span>
                            )}
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Rodapé Impressão */}
      <div className="hidden print:block mt-8 text-center text-xs text-gray-500 border-t border-gray-300 pt-2">
        Documento gerado eletronicamente.
      </div>
    </div>
  );
}
