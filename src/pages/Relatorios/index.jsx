import React, { useState } from "react";
import api from "../../services/api";
import { FaSearch, FaFilePdf, FaCalendarAlt } from "react-icons/fa";

export default function Relatorios() {
  const [tipoRelatorio, setTipoRelatorio] = useState("acessos"); // 'acessos' ou 'frota'
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [resultados, setResultados] = useState([]);
  const [loading, setLoading] = useState(false);

  // Define data padrão (início do mês até hoje) na primeira carga, se desejar
  // Ficará vazio para obrigar o usuário a escolher os períodos.

  async function handleGerarRelatorio(e) {
    e.preventDefault();
    setLoading(true);
    setResultados([]); // Limpa resultados anteriores

    try {
      let url = "";
      const params = {};

      if (dataInicio) params.data_inicio = dataInicio;
      if (dataFim) params.data_fim = dataFim;

      if (tipoRelatorio === "acessos") {
        url = "/movimentacoes/acessos";
      } else {
        url = "/movimentacoes/frota";
      }

      const response = await api.get(url, { params });
      setResultados(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao gerar relatório.");
    } finally {
      setLoading(false);
    }
  }

  // Função simples para impressão (Browser Print)
  function handlePrint() {
    window.print();
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Relatórios</h1>
          <p className="text-gray-500">Histórico de movimentações</p>
        </div>
        <button
          onClick={handlePrint}
          disabled={resultados.length === 0}
          className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 disabled:opacity-50"
        >
          <FaFilePdf /> Imprimir / PDF
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 print:hidden">
        <form
          onSubmit={handleGerarRelatorio}
          className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Relatório
            </label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:ring-2 focus:ring-blue-500"
              value={tipoRelatorio}
              onChange={(e) => {
                setTipoRelatorio(e.target.value);
                setResultados([]); // Limpa ao trocar tipo
              }}
            >
              <option value="acessos">Movimentação de Acessos</option>
              <option value="frota">Movimentação de Frota</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={dataInicio}
              onChange={(e) => setDataInicio(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fim
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={dataFim}
              onChange={(e) => setDataFim(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center gap-2"
          >
            {loading ? (
              "Buscando..."
            ) : (
              <>
                <FaSearch /> Gerar Relatório
              </>
            )}
          </button>
        </form>
      </div>

      {/* Resultados - Tabela Dinâmica */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden print:shadow-none print:border-none">
        {/* Cabeçalho do Relatório (Aparece só na impressão) */}
        <div className="hidden print:block p-4 text-center border-b">
          <h2 className="text-xl font-bold">
            Relatório de {tipoRelatorio === "acessos" ? "Acessos" : "Frota"}
          </h2>
          <p className="text-sm">
            Período: {dataInicio || "Início"} até {dataFim || "Hoje"}
          </p>
        </div>

        {resultados.length === 0 ? (
          <div className="p-12 text-center text-gray-400 print:hidden">
            <FaCalendarAlt size={48} className="mx-auto mb-4 opacity-30" />
            <p>Selecione os filtros e clique em gerar para ver os dados.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-50 border-b uppercase text-xs text-gray-700">
                <tr>
                  <th className="px-4 py-3">Data/Hora</th>
                  {tipoRelatorio === "acessos" ? (
                    <>
                      <th className="px-4 py-3">Pessoa / Documento</th>
                      <th className="px-4 py-3">Veículo</th>
                      <th className="px-4 py-3">Destino</th>
                      <th className="px-4 py-3">Status</th>
                    </>
                  ) : (
                    <>
                      <th className="px-4 py-3">Motorista</th>
                      <th className="px-4 py-3">Veículo</th>
                      <th className="px-4 py-3">Cidade Destino</th>
                      <th className="px-4 py-3">KM Percorrido</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {resultados.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3">
                      {new Date(item.data_hora_entrada).toLocaleString()}
                      {item.data_hora_saida && (
                        <div className="text-xs text-gray-400 mt-1">
                          Saída:{" "}
                          {new Date(item.data_hora_saida).toLocaleString()}
                        </div>
                      )}
                    </td>

                    {tipoRelatorio === "acessos" ? (
                      <>
                        <td className="px-4 py-3">
                          <p className="font-bold text-gray-700">
                            {item.pessoa_nome}
                          </p>
                          <span className="text-xs">
                            {item.pessoa_documento}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {item.veiculo_placa
                            ? `${item.veiculo_placa} (${item.veiculo_modelo})`
                            : "A pé"}
                        </td>
                        <td className="px-4 py-3">
                          {item.setor_nome} <br />
                          <span className="text-xs text-gray-400">
                            Posto: {item.posto_entrada_nome}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 rounded text-xs font-bold ${
                              item.status === "patio"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {item.status.toUpperCase()}
                          </span>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-bold text-gray-700">
                          {item.motorista_nome}
                        </td>
                        <td className="px-4 py-3">
                          {item.modelo} <br />
                          <span className="text-xs font-mono bg-gray-100 px-1">
                            {item.placa}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {item.cidade_destino} ({item.cidade_uf})
                        </td>
                        <td className="px-4 py-3">
                          <div>Saída: {item.km_entrada}</div>
                          {item.km_saida ? (
                            <>
                              <div>Chegada: {item.km_saida}</div>
                              <div className="font-bold text-blue-600 mt-1">
                                Total: {item.km_saida - item.km_entrada} km
                              </div>
                            </>
                          ) : (
                            <span className="text-yellow-600 text-xs">
                              Em viagem
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

      {/* Rodapé de Impressão */}
      <div className="hidden print:block mt-8 text-center text-xs text-gray-400">
        Relatório gerado em {new Date().toLocaleString()} pelo Sistema de
        Portaria.
      </div>
    </div>
  );
}
