import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Autocomplete from "../../components/Autocomplete";
import {
  FaSignInAlt,
  FaPlus,
  FaMapMarkerAlt,
  FaRoad,
  FaCar,
  FaUser,
  FaTachometerAlt,
  FaRoute,
  FaCheckCircle,
  FaRegFlag,
} from "react-icons/fa";

export default function MovimentacoesFrota() {
  const [activeTab, setActiveTab] = useState("saida"); // 'saida' ou 'viagens'

  // Listas
  const [pessoas, setPessoas] = useState([]);
  const [veiculosFrota, setVeiculosFrota] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [postos, setPostos] = useState([]);
  const [viagens, setViagens] = useState([]);

  // Form Saída
  const [formSaida, setFormSaida] = useState({
    pessoa: null,
    veiculo: null,
    posto_id: "",
    cidade_id: "",
    km_saida: "",
    motivo: "",
    observacao: "",
  });

  // Modal Retorno
  const [modalRetornoOpen, setModalRetornoOpen] = useState(false);
  const [retornoItem, setRetornoItem] = useState(null);
  const [formRetorno, setFormRetorno] = useState({
    posto_id: "",
    km_chegada: "",
    observacao: "",
  });

  // Carregamento
  useEffect(() => {
    loadCadastros();
    loadViagens();
  }, []);

  async function loadCadastros() {
    try {
      const [resPessoas, resVeiculos, resCidades, resPostos] =
        await Promise.all([
          api.get("/pessoas"),
          api.get("/veiculos?frota=true"),
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

  async function handleAddCidade() {
    const nome = window.prompt("Nome da nova cidade:");
    if (nome) {
      try {
        await api.post("/cidades", { nome, uf: "BR" });
        const res = await api.get("/cidades");
        setCidades(res.data);
      } catch (err) {
        alert("Erro ao criar cidade.");
      }
    }
  }

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
        km_entrada: formSaida.km_saida,
        id_cidade_de_destino: formSaida.cidade_id,
        motivo_saida: formSaida.motivo,
        observacao: formSaida.observacao,
      });
      alert("Viagem iniciada com sucesso!");
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

  function openModalRetorno(viagem) {
    setRetornoItem(viagem);
    setFormRetorno({ posto_id: "", km_chegada: "", observacao: "" });
    setModalRetornoOpen(true);
  }

  async function handleRegistrarRetorno(e) {
    e.preventDefault();
    if (!formRetorno.posto_id || !formRetorno.km_chegada)
      return alert("Preencha Posto e KM de Chegada.");

    if (Number(formRetorno.km_chegada) <= Number(retornoItem.km_entrada)) {
      return alert(
        `A KM de chegada deve ser maior que a de saída (${retornoItem.km_entrada}).`
      );
    }

    try {
      await api.put(`/movimentacoes/frota/retorno/${retornoItem.id}`, {
        id_posto_controle_saida: formRetorno.posto_id,
        km_saida: formRetorno.km_chegada,
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
    <div className="min-h-screen bg-gray-50/50 pb-10">
      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Controle de Frota
          </h1>
          <p className="text-gray-500 mt-1">
            Gestão de viagens, quilometragem e motoristas.
          </p>
        </div>

        {/* --- TABS --- */}
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 flex">
          <button
            onClick={() => setActiveTab("saida")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "saida"
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaRoute /> Nova Viagem
          </button>
          <button
            onClick={() => {
              setActiveTab("viagens");
              loadViagens();
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "viagens"
                ? "bg-amber-50 text-amber-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaCar /> Em Andamento ({viagens.length})
          </button>
        </div>
      </div>

      {/* --- ABA NOVA VIAGEM --- */}
      {activeTab === "saida" && (
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            {/* Header Card */}
            <div className="bg-blue-600 px-8 py-6 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Iniciar Viagem</h2>
                <p className="text-blue-100 text-sm">
                  Liberação de veículo da frota.
                </p>
              </div>
              <div className="bg-blue-500/30 p-3 rounded-xl">
                <FaRoute size={28} className="text-white" />
              </div>
            </div>

            <form onSubmit={handleRegistrarSaida} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Seção Condutor/Veículo */}
                <div className="md:col-span-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                    Condutor e Veículo
                  </h3>
                </div>

                <div className="md:col-span-1">
                  <Autocomplete
                    label="Motorista *"
                    items={pessoas}
                    selectedItem={formSaida.pessoa}
                    onChange={(item) =>
                      setFormSaida({ ...formSaida, pessoa: item })
                    }
                    displayKey="nome"
                    placeholder="Quem vai dirigir?"
                  />
                </div>

                <div className="md:col-span-1 relative">
                  <Autocomplete
                    label="Veículo da Frota *"
                    items={veiculosFrota}
                    selectedItem={formSaida.veiculo}
                    onChange={(item) =>
                      setFormSaida({ ...formSaida, veiculo: item })
                    }
                    displayKey="modelo"
                    placeholder="Selecione o carro..."
                  />
                  {formSaida.veiculo && (
                    <div className="absolute top-0 right-0 mt-8 mr-10 text-xs font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded border border-blue-100">
                      {formSaida.veiculo.placa}
                    </div>
                  )}
                </div>

                {/* Seção Rota */}
                <div className="md:col-span-2 mt-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                    Dados da Rota
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Cidade Destino *
                  </label>
                  <div className="flex gap-2 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaMapMarkerAlt />
                    </div>
                    <select
                      className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                      value={formSaida.cidade_id}
                      onChange={(e) =>
                        setFormSaida({
                          ...formSaida,
                          cidade_id: e.target.value,
                        })
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
                      className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 rounded-lg border border-blue-200 transition-colors"
                      title="Nova Cidade"
                    >
                      <FaPlus />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    KM Atual (Saída) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaTachometerAlt />
                    </div>
                    <input
                      type="number"
                      className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                      placeholder="Ex: 15000"
                      value={formSaida.km_saida}
                      onChange={(e) =>
                        setFormSaida({ ...formSaida, km_saida: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Posto de Saída *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaRegFlag />
                    </div>
                    <select
                      className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
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
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Motivo / Observação
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    rows="2"
                    placeholder="Detalhes da viagem..."
                    value={formSaida.observacao}
                    onChange={(e) =>
                      setFormSaida({ ...formSaida, observacao: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
                >
                  <FaRoad /> Liberar Veículo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ABA VIAGENS EM ANDAMENTO --- */}
      {activeTab === "viagens" && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {viagens.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center text-gray-300">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <FaCar size={40} className="text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-400">
                Toda a frota está no pátio.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Saída
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Motorista / Veículo
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Destino
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      KM Inicial
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {viagens.map((v) => (
                    <tr
                      key={v.id}
                      className="hover:bg-amber-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">
                            {new Date(v.data_hora_entrada).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(v.data_hora_entrada).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center font-bold text-sm">
                            {v.motorista_nome.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {v.motorista_nome}
                            </p>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              <FaCar size={10} className="text-gray-400" />
                              {v.modelo}{" "}
                              <span className="font-mono bg-gray-100 px-1 rounded text-gray-600 font-bold">
                                {v.placa}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          <FaMapMarkerAlt className="text-gray-400" size={10} />{" "}
                          {v.cidade_destino}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm text-gray-600 bg-gray-50 w-fit px-2 rounded">
                          {v.km_entrada} km
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openModalRetorno(v)}
                          className="text-green-600 bg-green-50 hover:bg-green-100 hover:text-green-700 font-bold py-2 px-4 rounded-lg text-xs transition-colors shadow-sm border border-green-100 flex items-center gap-1 ml-auto"
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

      {/* --- MODAL DE RETORNO --- */}
      {modalRetornoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            {/* Header Modal */}
            <div className="bg-green-600 px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <FaSignInAlt /> Registrar Chegada
              </h3>
              <button
                onClick={() => setModalRetornoOpen(false)}
                className="text-white/80 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              <div className="bg-green-50 p-4 rounded-xl border border-green-100 mb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-green-800 font-bold">
                      Resumo da Viagem
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {retornoItem?.motorista_nome}
                    </p>
                    <p className="text-xs text-green-600">
                      {retornoItem?.modelo} ({retornoItem?.placa})
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-green-600">KM Inicial</p>
                    <p className="font-mono font-bold text-green-800 text-lg">
                      {retornoItem?.km_entrada}
                    </p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleRegistrarRetorno} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Posto de Chegada *
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-green-500"
                    value={formRetorno.posto_id}
                    onChange={(e) =>
                      setFormRetorno({
                        ...formRetorno,
                        posto_id: e.target.value,
                      })
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
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    KM Final (Chegada) *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaTachometerAlt />
                    </div>
                    <input
                      type="number"
                      className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-green-500"
                      placeholder={`> ${retornoItem?.km_entrada}`}
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
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Observação
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: Abastecido 40L, Pneu trocado..."
                    value={formRetorno.observacao}
                    onChange={(e) =>
                      setFormRetorno({
                        ...formRetorno,
                        observacao: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setModalRetornoOpen(false)}
                    className="px-5 py-2.5 bg-gray-100 rounded-lg text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 shadow-md shadow-green-200 transition-all flex items-center gap-2"
                  >
                    <FaCheckCircle /> Confirmar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
