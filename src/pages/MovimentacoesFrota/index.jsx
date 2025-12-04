import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Autocomplete from "../../components/Autocomplete";
import { FaSignInAlt, FaPlus, FaMapMarkerAlt, FaRoad } from "react-icons/fa";

export default function MovimentacoesFrota() {
  const [activeTab, setActiveTab] = useState("saida"); // 'saida' (Início) ou 'viagens' (Em andamento)

  // Listas de Dados
  const [pessoas, setPessoas] = useState([]);
  const [veiculosFrota, setVeiculosFrota] = useState([]); // Só carros da empresa
  const [cidades, setCidades] = useState([]);
  const [postos, setPostos] = useState([]);
  const [viagens, setViagens] = useState([]); // Lista de viagens em andamento

  // Form de Saída (Início da Viagem)
  const [formSaida, setFormSaida] = useState({
    pessoa: null,
    veiculo: null,
    posto_id: "",
    cidade_id: "",
    km_saida: "", // No banco é km_entrada (início do registro), mas na tela chamamos de Km Saída da Empresa
    motivo: "",
    observacao: "",
  });

  // Modal de Retorno (Fim da Viagem)
  const [modalRetornoOpen, setModalRetornoOpen] = useState(false);
  const [retornoItem, setRetornoItem] = useState(null);
  const [formRetorno, setFormRetorno] = useState({
    posto_id: "",
    km_chegada: "", // No banco é km_saida (fim do registro)
    observacao: "",
  });

  // Carregar dados iniciais
  useEffect(() => {
    loadCadastros();
    loadViagens();
  }, []);

  async function loadCadastros() {
    try {
      const [resPessoas, resVeiculos, resCidades, resPostos] =
        await Promise.all([
          api.get("/pessoas"),
          api.get("/veiculos?frota=true"), // <--- Filtro: Só frota própria
          api.get("/cidades"),
          api.get("/postos"),
        ]);
      setPessoas(resPessoas.data);
      setVeiculosFrota(resVeiculos.data);
      setCidades(resCidades.data);
      setPostos(resPostos.data);
    } catch (error) {
      console.error("Erro ao carregar cadastros", error);
    }
  }

  async function loadViagens() {
    try {
      const response = await api.get("/movimentacoes/frota?status=saiu");
      setViagens(response.data);
    } catch (error) {
      console.error("Erro ao carregar viagens", error);
    }
  }

  // Helper para adicionar cidade rápido
  async function handleAddCidade() {
    const nome = window.prompt("Nome da nova cidade:");
    if (nome) {
      try {
        await api.post("/cidades", { nome, uf: "BR" }); // UF genérico por simplicidade
        // Recarrega lista
        const res = await api.get("/cidades");
        setCidades(res.data);
      } catch (err) {
        alert("Erro ao criar cidade.");
      }
    }
  }

  // --- Registrar Saída (Início da Viagem) ---
  async function handleRegistrarSaida(e) {
    e.preventDefault();

    if (
      !formSaida.pessoa ||
      !formSaida.veiculo ||
      !formSaida.posto_id ||
      !formSaida.cidade_id ||
      !formSaida.km_saida
    ) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    try {
      await api.post("/movimentacoes/frota/saida", {
        id_pessoa: formSaida.pessoa.id,
        id_veiculo: formSaida.veiculo.id,
        id_posto_controle_entrada: formSaida.posto_id,
        km_entrada: formSaida.km_saida, // Backend espera km_entrada como "KM inicial"
        id_cidade_de_destino: formSaida.cidade_id,
        motivo_saida: formSaida.motivo,
        observacao: formSaida.observacao,
      });

      alert("Viagem iniciada com sucesso!");

      // Limpa form
      setFormSaida({
        pessoa: null,
        veiculo: null,
        posto_id: "",
        cidade_id: "",
        km_saida: "",
        motivo: "",
        observacao: "",
      });

      loadViagens();
      setActiveTab("viagens");
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao iniciar viagem";
      alert(msg);
    }
  }

  // --- Registrar Retorno (Fim da Viagem) ---
  function openModalRetorno(viagem) {
    setRetornoItem(viagem);
    setFormRetorno({
      posto_id: "",
      km_chegada: "",
      observacao: "",
    });
    setModalRetornoOpen(true);
  }

  async function handleRegistrarRetorno(e) {
    e.preventDefault();

    if (!formRetorno.posto_id || !formRetorno.km_chegada) {
      return alert("Preencha Posto e KM de Chegada.");
    }

    // Validação Frontend de KM (O Backend também valida)
    if (Number(formRetorno.km_chegada) <= Number(retornoItem.km_entrada)) {
      return alert(
        `A KM de chegada (${formRetorno.km_chegada}) deve ser maior que a de saída (${retornoItem.km_entrada}).`
      );
    }

    try {
      await api.put(`/movimentacoes/frota/retorno/${retornoItem.id}`, {
        id_posto_controle_saida: formRetorno.posto_id,
        km_saida: formRetorno.km_chegada, // Backend espera km_saida como "KM final"
        observacao: formRetorno.observacao,
      });

      alert("Retorno registrado! Veículo disponível no pátio.");
      setModalRetornoOpen(false);
      loadViagens();
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao registrar retorno";
      alert(msg);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Controle de Frota
      </h1>

      {/* Abas */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("saida")}
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "saida"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Nova Saída (Viagem)
        </button>
        <button
          onClick={() => {
            setActiveTab("viagens");
            loadViagens();
          }}
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "viagens"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Viagens em Andamento ({viagens.length})
        </button>
      </div>

      {/* Aba: Nova Saída */}
      {activeTab === "saida" && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-4xl">
          <form
            onSubmit={handleRegistrarSaida}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Motorista */}
            <div className="md:col-span-2">
              <Autocomplete
                label="Motorista *"
                items={pessoas}
                selectedItem={formSaida.pessoa}
                onChange={(item) =>
                  setFormSaida({ ...formSaida, pessoa: item })
                }
                displayKey="nome"
                placeholder="Busque o motorista..."
              />
            </div>

            {/* Veículo (Apenas Frota) */}
            <div>
              <Autocomplete
                label="Veículo da Frota *"
                items={veiculosFrota}
                selectedItem={formSaida.veiculo}
                onChange={(item) =>
                  setFormSaida({ ...formSaida, veiculo: item })
                }
                displayKey="modelo" // Mostra modelo no input
                placeholder="Busque o carro..."
              />
              {/* Mostra a placa embaixo para confirmar */}
              {formSaida.veiculo && (
                <p className="text-xs text-blue-600 mt-1 font-bold">
                  Placa: {formSaida.veiculo.placa}
                </p>
              )}
            </div>

            {/* Cidade Destino (Com botão de +) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cidade Destino *
              </label>
              <div className="flex gap-2">
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                  value={formSaida.cidade_id}
                  onChange={(e) =>
                    setFormSaida({ ...formSaida, cidade_id: e.target.value })
                  }
                  required
                >
                  <option value="">Selecione...</option>
                  {cidades.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nome}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddCidade}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 rounded-md border border-gray-300"
                  title="Cadastrar nova cidade"
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            {/* KM e Posto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                KM Atual (Saída) *
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Ex: 50000"
                value={formSaida.km_saida}
                onChange={(e) =>
                  setFormSaida({ ...formSaida, km_saida: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posto de Saída *
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                value={formSaida.posto_id}
                onChange={(e) =>
                  setFormSaida({ ...formSaida, posto_id: e.target.value })
                }
                required
              >
                <option value="">Selecione...</option>
                {postos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Motivo e Obs */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo da Viagem
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Ex: Visita ao Cliente X"
                value={formSaida.motivo}
                onChange={(e) =>
                  setFormSaida({ ...formSaida, motivo: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observação
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                rows="2"
                value={formSaida.observacao}
                onChange={(e) =>
                  setFormSaida({ ...formSaida, observacao: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                <FaRoad /> Iniciar Viagem
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Aba: Viagens em Andamento */}
      {activeTab === "viagens" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {viagens.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              Nenhuma viagem em andamento. Toda a frota está no pátio.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500">
                <thead className="bg-gray-50 border-b uppercase">
                  <tr>
                    <th className="px-6 py-3">Saída</th>
                    <th className="px-6 py-3">Motorista</th>
                    <th className="px-6 py-3">Veículo</th>
                    <th className="px-6 py-3">Destino</th>
                    <th className="px-6 py-3">KM Saída</th>
                    <th className="px-6 py-3 text-right">Ação</th>
                  </tr>
                </thead>
                <tbody>
                  {viagens.map((v) => (
                    <tr key={v.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {new Date(v.data_hora_entrada).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">{v.motorista_nome}</td>
                      <td className="px-6 py-4">
                        {v.modelo}{" "}
                        <span className="text-gray-400 text-xs">
                          ({v.placa})
                        </span>
                      </td>
                      <td className="px-6 py-4 flex items-center gap-1">
                        <FaMapMarkerAlt className="text-red-400" />{" "}
                        {v.cidade_destino}
                      </td>
                      <td className="px-6 py-4">{v.km_entrada} km</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openModalRetorno(v)}
                          className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded-md text-xs font-bold border border-green-200 flex items-center gap-1 ml-auto"
                        >
                          <FaSignInAlt /> Registrar Retorno
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal de Retorno */}
      {modalRetornoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-lg mb-2 text-gray-900">
              Registrar Retorno
            </h3>
            <div className="bg-gray-50 p-3 rounded mb-4 text-sm text-gray-600 border border-gray-200">
              <p>
                <strong>Motorista:</strong> {retornoItem?.motorista_nome}
              </p>
              <p>
                <strong>Veículo:</strong> {retornoItem?.modelo} (
                {retornoItem?.placa})
              </p>
              <p>
                <strong>KM de Saída:</strong> {retornoItem?.km_entrada}
              </p>
            </div>

            <form onSubmit={handleRegistrarRetorno} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Posto de Chegada *
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                  value={formRetorno.posto_id}
                  onChange={(e) =>
                    setFormRetorno({ ...formRetorno, posto_id: e.target.value })
                  }
                  required
                >
                  <option value="">Selecione...</option>
                  {postos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  KM de Chegada *
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder={`Maior que ${retornoItem?.km_entrada}`}
                  value={formRetorno.km_chegada}
                  onChange={(e) =>
                    setFormRetorno({
                      ...formRetorno,
                      km_chegada: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observação
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Ex: Abastecido com 50L"
                  value={formRetorno.observacao}
                  onChange={(e) =>
                    setFormRetorno({
                      ...formRetorno,
                      observacao: e.target.value,
                    })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setModalRetornoOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded text-gray-700 hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Confirmar Chegada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
