import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Autocomplete from "../../components/Autocomplete";
import { FaSignOutAlt, FaSearch } from "react-icons/fa";

export default function MovimentacoesAcessos() {
  const [activeTab, setActiveTab] = useState("entrada"); // 'entrada' ou 'patio'
  const [loading, setLoading] = useState(false);

  // Listas para os Selects/Autocompletes
  const [pessoas, setPessoas] = useState([]);
  const [veiculos, setVeiculos] = useState([]);
  const [setores, setSetores] = useState([]);
  const [postos, setPostos] = useState([]);
  const [patio, setPatio] = useState([]); // Lista de quem está no pátio

  // Form de Entrada
  const [formEntrada, setFormEntrada] = useState({
    pessoa: null, // Objeto completo selecionado no Autocomplete
    veiculo: null, // Objeto completo selecionado no Autocomplete
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

  // Carregar dados iniciais
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
    loadPatio(); // Carrega lista do pátio
  }, []);

  async function loadPatio() {
    try {
      const response = await api.get("/movimentacoes/acessos?status=patio");
      setPatio(response.data);
    } catch (error) {
      console.error("Erro ao carregar pátio", error);
    }
  }

  // --- Ações de Entrada ---
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

      // Limpa form
      setFormEntrada({
        pessoa: null,
        veiculo: null,
        setor_id: "",
        posto_id: "",
        km_entrada: "",
        motivo: "",
        observacao: "",
      });

      // Muda para aba de pátio para ver o registro
      loadPatio();
      setActiveTab("patio");
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao registrar entrada";
      alert(msg);
    }
  }

  // --- Ações de Saída ---
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
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Controle de Acessos
      </h1>

      {/* Abas de Navegação */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("entrada")}
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "entrada"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Registrar Nova Entrada
        </button>
        <button
          onClick={() => {
            setActiveTab("patio");
            loadPatio();
          }}
          className={`py-2 px-4 font-medium text-sm border-b-2 transition-colors ${
            activeTab === "patio"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Veículos/Pessoas no Pátio ({patio.length})
        </button>
      </div>

      {/* Conteúdo da Aba: Entrada */}
      {activeTab === "entrada" && (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 max-w-4xl">
          <form
            onSubmit={handleRegistrarEntrada}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Componente Autocomplete para PESSOA */}
            <div className="md:col-span-2">
              <Autocomplete
                label="Pessoa *"
                items={pessoas}
                selectedItem={formEntrada.pessoa}
                onChange={(item) =>
                  setFormEntrada({ ...formEntrada, pessoa: item })
                }
                displayKey="nome"
                placeholder="Busque por nome..."
              />
            </div>

            {/* Componente Autocomplete para VEÍCULO (Opcional) */}
            <div>
              <Autocomplete
                label="Veículo (Opcional)"
                items={veiculos}
                selectedItem={formEntrada.veiculo}
                onChange={(item) =>
                  setFormEntrada({ ...formEntrada, veiculo: item })
                }
                displayKey="placa" // Busca pela placa
                placeholder="Busque pela placa..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                KM Entrada
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                value={formEntrada.km_entrada}
                onChange={(e) =>
                  setFormEntrada({ ...formEntrada, km_entrada: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Setor Visitado *
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                value={formEntrada.setor_id}
                onChange={(e) =>
                  setFormEntrada({ ...formEntrada, setor_id: e.target.value })
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Posto de Entrada *
              </label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                value={formEntrada.posto_id}
                onChange={(e) =>
                  setFormEntrada({ ...formEntrada, posto_id: e.target.value })
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

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Motivo da Visita
              </label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="Ex: Entrega de material, Reunião..."
                value={formEntrada.motivo}
                onChange={(e) =>
                  setFormEntrada({ ...formEntrada, motivo: e.target.value })
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
                value={formEntrada.observacao}
                onChange={(e) =>
                  setFormEntrada({ ...formEntrada, observacao: e.target.value })
                }
              />
            </div>

            <div className="md:col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg transition-colors"
              >
                Registrar Entrada
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Conteúdo da Aba: Pátio */}
      {activeTab === "patio" && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {patio.length === 0 ? (
            <div className="p-12 text-center text-gray-400">
              Ninguém no pátio no momento.
            </div>
          ) : (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="bg-gray-50 border-b uppercase">
                <tr>
                  <th className="px-6 py-3">Entrada</th>
                  <th className="px-6 py-3">Pessoa</th>
                  <th className="px-6 py-3">Veículo</th>
                  <th className="px-6 py-3">Setor</th>
                  <th className="px-6 py-3 text-right">Ação</th>
                </tr>
              </thead>
              <tbody>
                {patio.map((mov) => (
                  <tr key={mov.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {new Date(mov.data_hora_entrada).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">{mov.pessoa_nome}</td>
                    <td className="px-6 py-4">
                      {mov.veiculo_placa ? (
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {mov.veiculo_placa}
                        </span>
                      ) : (
                        "A pé"
                      )}
                    </td>
                    <td className="px-6 py-4">{mov.setor_nome}</td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => openModalSaida(mov)}
                        className="text-red-600 hover:text-red-800 font-medium flex items-center justify-end gap-1 ml-auto"
                      >
                        <FaSignOutAlt /> Registrar Saída
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Modal de Saída */}
      {modalSaidaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="font-bold text-lg mb-4 text-gray-900">
              Registrar Saída
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Pessoa: <strong>{saidaItem?.pessoa_nome}</strong>
            </p>

            <form onSubmit={handleRegistrarSaida} className="space-y-4">
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

              {saidaItem?.id_veiculo && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    KM Saída
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md px-3 py-2"
                    value={formSaida.km_saida}
                    onChange={(e) =>
                      setFormSaida({ ...formSaida, km_saida: e.target.value })
                    }
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Observação de Saída
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  value={formSaida.observacao}
                  onChange={(e) =>
                    setFormSaida({ ...formSaida, observacao: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setModalSaidaOpen(false)}
                  className="px-4 py-2 bg-gray-100 rounded text-gray-700 hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Confirmar Saída
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
