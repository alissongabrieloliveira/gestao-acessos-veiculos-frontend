import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Autocomplete from "../../components/Autocomplete";
import {
  FaSignOutAlt,
  FaSearch,
  FaUserClock,
  FaParking,
  FaMapMarkerAlt,
  FaRoad,
  FaEdit,
  FaCar,
  FaUser,
  FaCheckCircle,
} from "react-icons/fa";

export default function MovimentacoesAcessos() {
  const [activeTab, setActiveTab] = useState("entrada"); // 'entrada' ou 'patio'

  // Listas
  const [pessoas, setPessoas] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [postos, setPostos] = useState([]);
  const [patio, setPatio] = useState([]);

  // Form de Entrada
  const [formEntrada, setFormEntrada] = useState({
    pessoa: null,
    veiculo: null,
    setor_id: "",
    posto_id: "",
    km_entrada: "",
    motivo: "",
    observacao: "",
  });

  // Modal de Saída
  const [modalSaidaOpen, setModalSaidaOpen] = useState(false);
  const [saidaItem, setSaidaItem] = useState(null);
  const [formSaida, setFormSaida] = useState({
    posto_id: "",
    km_saida: "",
    observacao: "",
  });

  // Carregamento Inicial
  useEffect(() => {
    async function loadData() {
      try {
        const [resPessoas, resVeiculos, resSetores, resPostos] =
          await Promise.all([
            api.get("/pessoas"),
            api.get("/veiculos"),
            api.get("/setores"),
            api.get("/postos"),
          ]);
        setPessoas(resPessoas.data);
        setVeiculos(resVeiculos.data);
        setSetores(resSetores.data);
        setPostos(resPostos.data);
      } catch (error) {
        console.error("Erro ao carregar cadastros", error);
      }
    }
    loadData();
    loadPatio();
  }, []);

  async function loadPatio() {
    try {
      const response = await api.get("/movimentacoes/acessos?status=patio");
      setPatio(response.data);
    } catch (error) {
      console.error("Erro ao carregar pátio", error);
    }
  }

  // Ações
  async function handleRegistrarEntrada(e) {
    e.preventDefault();
    if (!formEntrada.pessoa || !formEntrada.setor_id || !formEntrada.posto_id) {
      alert("Preencha Pessoa, Setor e Posto de Controle.");
      return;
    }
    try {
      await api.post("/movimentacoes/acessos/entrada", {
        id_pessoa: formEntrada.pessoa.id,
        id_veiculo: formEntrada.veiculo ? formEntrada.veiculo.id : null,
        id_setor_visitado: formEntrada.setor_id,
        id_posto_controle_entrada: formEntrada.posto_id,
        km_entrada: formEntrada.km_entrada,
        motivo_da_visita: formEntrada.motivo,
        observacao: formEntrada.observacao,
      });
      alert("Entrada registrada com sucesso!");
      setFormEntrada({
        pessoa: null,
        veiculo: null,
        setor_id: "",
        posto_id: "",
        km_entrada: "",
        motivo: "",
        observacao: "",
      });
      loadPatio();
      setActiveTab("patio");
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao registrar entrada";
      alert(msg);
    }
  }

  function openModalSaida(movimentacao) {
    setSaidaItem(movimentacao);
    setFormSaida({ posto_id: "", km_saida: "", observacao: "" });
    setModalSaidaOpen(true);
  }

  async function handleRegistrarSaida(e) {
    e.preventDefault();
    if (!formSaida.posto_id) return alert("Informe o posto de saída.");
    try {
      await api.put(`/movimentacoes/acessos/saida/${saidaItem.id}`, {
        id_posto_controle_saida: formSaida.posto_id,
        km_saida: formSaida.km_saida,
        observacao: formSaida.observacao,
      });
      alert("Saída registrada!");
      setModalSaidaOpen(false);
      loadPatio();
    } catch (error) {
      alert("Erro ao registrar saída.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Controle de Acessos
          </h1>
          <p className="text-gray-500 mt-1">
            Gerencie a entrada e saída de visitantes, terceiros e colaboradores.
          </p>
        </div>

        {/* --- TABS (Segmented Control) --- */}
        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 flex">
          <button
            onClick={() => setActiveTab("entrada")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "entrada"
                ? "bg-emerald-50 text-emerald-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaUserClock /> Nova Entrada
          </button>
          <button
            onClick={() => {
              setActiveTab("patio");
              loadPatio();
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "patio"
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <FaParking /> Em Pátio ({patio.length})
          </button>
        </div>
      </div>

      {/* --- ABA ENTRADA --- */}
      {activeTab === "entrada" && (
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="bg-emerald-600 px-8 py-6 text-white flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Registrar Acesso</h2>
                <p className="text-emerald-100 text-sm">
                  Preencha os dados para liberar a entrada.
                </p>
              </div>
              <div className="bg-emerald-500/30 p-3 rounded-xl">
                <FaUserClock size={28} className="text-white" />
              </div>
            </div>

            <form onSubmit={handleRegistrarEntrada} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {/* Seção Pessoa e Veículo */}
                <div className="md:col-span-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                    Quem está entrando?
                  </h3>
                </div>

                <div className="md:col-span-1">
                  <Autocomplete
                    label="Pessoa *"
                    items={pessoas}
                    selectedItem={formEntrada.pessoa}
                    onChange={(item) =>
                      setFormEntrada({ ...formEntrada, pessoa: item })
                    }
                    displayKey="nome"
                    placeholder="Pesquise por nome..."
                  />
                </div>

                <div className="md:col-span-1">
                  <Autocomplete
                    label="Veículo (Opcional)"
                    items={veiculos}
                    selectedItem={formEntrada.veiculo}
                    onChange={(item) =>
                      setFormEntrada({ ...formEntrada, veiculo: item })
                    }
                    displayKey="placa"
                    placeholder="Pesquise pela placa..."
                  />
                </div>

                {/* Seção Detalhes */}
                <div className="md:col-span-2 mt-2">
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">
                    Detalhes do Acesso
                  </h3>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Setor Visitado *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaMapMarkerAlt />
                    </div>
                    <select
                      className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
                      value={formEntrada.setor_id}
                      onChange={(e) =>
                        setFormEntrada({
                          ...formEntrada,
                          setor_id: e.target.value,
                        })
                      }
                      required
                    >
                      <option value="">Selecione...</option>
                      {setores.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nome}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Posto de Entrada *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaSignOutAlt className="rotate-180" />
                    </div>
                    <select
                      className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all appearance-none"
                      value={formEntrada.posto_id}
                      onChange={(e) =>
                        setFormEntrada({
                          ...formEntrada,
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
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    KM Entrada
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaRoad />
                    </div>
                    <input
                      type="number"
                      className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="Ex: 50000"
                      value={formEntrada.km_entrada}
                      onChange={(e) =>
                        setFormEntrada({
                          ...formEntrada,
                          km_entrada: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Motivo
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaEdit />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                      placeholder="Ex: Reunião, Entrega..."
                      value={formEntrada.motivo}
                      onChange={(e) =>
                        setFormEntrada({
                          ...formEntrada,
                          motivo: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">
                    Observação
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    rows="2"
                    placeholder="Informações adicionais..."
                    value={formEntrada.observacao}
                    onChange={(e) =>
                      setFormEntrada({
                        ...formEntrada,
                        observacao: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl shadow-md shadow-emerald-200 transition-all active:scale-95 flex items-center gap-2"
                >
                  <FaCheckCircle /> Confirmar Entrada
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- ABA PÁTIO --- */}
      {activeTab === "patio" && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {patio.length === 0 ? (
            <div className="p-20 flex flex-col items-center justify-center text-gray-300">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <FaParking size={40} className="text-gray-300" />
              </div>
              <p className="text-lg font-medium text-gray-400">
                O pátio está vazio no momento.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Entrada
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Pessoa / Veículo
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Localização
                    </th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">
                      Ação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {patio.map((mov) => (
                    <tr
                      key={mov.id}
                      className="hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-900">
                            {new Date(mov.data_hora_entrada).toLocaleTimeString(
                              [],
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(
                              mov.data_hora_entrada
                            ).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {/* Avatar com iniciais */}
                          <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                            {mov.pessoa_nome.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">
                              {mov.pessoa_nome}
                            </p>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                              {mov.veiculo_placa ? (
                                <>
                                  <FaCar size={10} className="text-gray-400" />
                                  {mov.veiculo_modelo}{" "}
                                  <span className="font-mono bg-gray-100 px-1 rounded text-gray-600 font-bold">
                                    {mov.veiculo_placa}
                                  </span>
                                </>
                              ) : (
                                <span className="italic text-gray-400">
                                  A pé
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                          {mov.setor_nome}
                        </span>
                        <div className="text-xs text-gray-400 mt-1 pl-1">
                          Posto: {mov.posto_entrada_nome}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => openModalSaida(mov)}
                          className="text-rose-600 bg-rose-50 hover:bg-rose-100 hover:text-rose-700 font-bold py-2 px-4 rounded-lg text-xs transition-colors shadow-sm border border-rose-100 flex items-center gap-1 ml-auto"
                        >
                          <FaSignOutAlt /> Registrar Saída
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

      {/* --- MODAL DE SAÍDA (Estilizado) --- */}
      {modalSaidaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            {/* Header Modal */}
            <div className="bg-rose-600 px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <FaSignOutAlt /> Registrar Saída
              </h3>
              <button
                onClick={() => setModalSaidaOpen(false)}
                className="text-white/80 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <div className="p-6">
              <div className="bg-rose-50 p-4 rounded-xl border border-rose-100 mb-6">
                <p className="text-sm text-rose-800">Liberando saída para:</p>
                <p className="text-lg font-bold text-gray-900 mt-1">
                  {saidaItem?.pessoa_nome}
                </p>
                {saidaItem?.veiculo_placa && (
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <FaCar /> {saidaItem.veiculo_modelo} (
                    {saidaItem.veiculo_placa})
                  </p>
                )}
              </div>

              <form onSubmit={handleRegistrarSaida} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Posto de Saída
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-rose-500"
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

                {saidaItem?.id_veiculo && (
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                      KM Saída
                    </label>
                    <input
                      type="number"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-rose-500"
                      value={formSaida.km_saida}
                      onChange={(e) =>
                        setFormSaida({ ...formSaida, km_saida: e.target.value })
                      }
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Observação
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-rose-500"
                    value={formSaida.observacao}
                    onChange={(e) =>
                      setFormSaida({ ...formSaida, observacao: e.target.value })
                    }
                  />
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setModalSaidaOpen(false)}
                    className="px-5 py-2.5 bg-gray-100 rounded-lg text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 shadow-md shadow-rose-200 transition-all flex items-center gap-2"
                  >
                    Confirmar Saída
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
