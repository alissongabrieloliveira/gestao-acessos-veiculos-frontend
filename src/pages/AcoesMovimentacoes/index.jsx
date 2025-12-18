import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Autocomplete from "../../components/Autocomplete";
import { FaEdit, FaTrash, FaExchangeAlt, FaCar, FaSave } from "react-icons/fa";

export default function AcoesMovimentacoes() {
  const [activeTab, setActiveTab] = useState("acessos");
  const [lista, setLista] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [editType, setEditType] = useState("");
  const [currentItem, setCurrentItem] = useState(null);

  const [auxData, setAuxData] = useState({
    pessoas: [],
    veiculos: [],
    setores: [],
    postos: [],
    cidades: [],
  });

  const [formData, setFormData] = useState({});

  // --- CORREÇÃO 1: Função para VISUALIZAÇÃO (UTC -> Input Local) ---
  // Pega o UTC do banco e transforma em string YYYY-MM-DDTHH:MM local
  const formatDataToLocalInput = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);

    // Obtém partes da data localmente
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // --- CORREÇÃO 2: Função para ALTERAÇÃO (Input Local -> UTC) ---
  // Pega o valor do input (Local) e transforma em ISO String (UTC) para o banco
  const handleDateChange = (field, value) => {
    if (!value) {
      setFormData({ ...formData, [field]: null });
      return;
    }
    // O navegador cria 'date' usando o fuso local do usuário
    const date = new Date(value);
    // .toISOString() converte automaticamente para UTC (+3h em relação ao Brasil)
    setFormData({ ...formData, [field]: date.toISOString() });
  };

  useEffect(() => {
    loadList();
    loadAuxData();
  }, [activeTab]);

  async function loadList() {
    setLoading(true);
    try {
      const url =
        activeTab === "acessos"
          ? "/movimentacoes/acessos"
          : "/movimentacoes/frota";
      const response = await api.get(url);
      setLista(response.data);
    } catch (error) {
      alert("Erro ao carregar lista.");
    } finally {
      setLoading(false);
    }
  }

  async function loadAuxData() {
    if (auxData.pessoas.length > 0) return;
    try {
      const [p, v, s, pos, c] = await Promise.all([
        api.get("/pessoas"),
        api.get("/veiculos"),
        api.get("/setores"),
        api.get("/postos"),
        api.get("/cidades"),
      ]);
      setAuxData({
        pessoas: p.data,
        veiculos: v.data,
        setores: s.data,
        postos: pos.data,
        cidades: c.data,
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function handleDelete(id) {
    if (
      !window.confirm(
        "ATENÇÃO: Excluir uma movimentação é irreversível. Deseja continuar?"
      )
    )
      return;
    try {
      const url =
        activeTab === "acessos"
          ? `/movimentacoes/acessos/${id}`
          : `/movimentacoes/frota/${id}`;
      await api.delete(url);
      alert("Registro excluído.");
      loadList();
    } catch (error) {
      alert("Erro ao excluir.");
    }
  }

  function handleEdit(item) {
    setCurrentItem(item);
    setEditType(activeTab);

    // Configura os dados iniciais.
    // Nota: As datas já vêm em UTC do banco, mantem elas assim no state.
    if (activeTab === "acessos") {
      setFormData({
        id_pessoa: item.id_pessoa,
        pessoaObj: auxData.pessoas.find((p) => p.id === item.id_pessoa),
        veiculoObj: auxData.veiculos.find((v) => v.id === item.id_veiculo),
        id_veiculo: item.id_veiculo,
        id_setor_visitado: item.id_setor_visitado,
        id_posto_controle_entrada: item.id_posto_controle_entrada,
        id_posto_controle_saida: item.id_posto_controle_saida || "",
        km_entrada: item.km_entrada || "",
        km_saida: item.km_saida || "",
        motivo_da_visita: item.motivo_da_visita || "",
        observacao: item.observacao || "",
        data_hora_entrada: item.data_hora_entrada,
        data_hora_saida: item.data_hora_saida,
      });
    } else {
      setFormData({
        id_pessoa: item.id_pessoa,
        pessoaObj: auxData.pessoas.find((p) => p.id === item.id_pessoa),
        veiculoObj: auxData.veiculos.find((v) => v.id === item.id_veiculo),
        id_veiculo: item.id_veiculo,
        id_cidade_de_destino: item.id_cidade_de_destino,
        id_posto_controle_entrada: item.id_posto_controle_entrada,
        id_posto_controle_saida: item.id_posto_controle_saida || "",
        km_entrada: item.km_entrada,
        km_saida: item.km_saida || "",
        motivo_saida: item.motivo_saida || "",
        observacao: item.observacao || "",
        data_hora_entrada: item.data_hora_entrada,
        data_hora_saida: item.data_hora_saida,
      });
    }
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      const url =
        editType === "acessos"
          ? `/movimentacoes/acessos/${currentItem.id}`
          : `/movimentacoes/frota/${currentItem.id}`;

      // O formData já contém as datas convertidas para UTC
      await api.put(url, formData);
      alert("Registro atualizado com sucesso!");
      setShowModal(false);
      loadList();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar alterações.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Ações de Movimentações
          </h1>
          <p className="text-gray-500 mt-1">
            Painel administrativo para correção e exclusão de registros.
          </p>
        </div>

        <div className="bg-white p-1.5 rounded-xl shadow-sm border border-gray-200 flex">
          <button
            onClick={() => setActiveTab("acessos")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "acessos"
                ? "bg-blue-50 text-blue-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaExchangeAlt /> Acessos
          </button>
          <button
            onClick={() => setActiveTab("frota")}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all ${
              activeTab === "frota"
                ? "bg-amber-50 text-amber-700 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FaCar /> Frota
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Carregando registros...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Pessoa
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                    Veículo
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lista.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-blue-50/30 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(item.data_hora_entrada).toLocaleDateString()}{" "}
                      <br />
                      <span className="text-xs text-gray-500">
                        {new Date(item.data_hora_entrada).toLocaleTimeString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-700">
                      {activeTab === "acessos"
                        ? item.pessoa_nome
                        : item.motorista_nome}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {activeTab === "acessos"
                        ? item.veiculo_placa
                          ? `${item.veiculo_modelo} (${item.veiculo_placa})`
                          : "A pé"
                        : `${item.modelo} (${item.placa})`}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                          title="Editar Completo"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-2 text-red-500 hover:bg-red-100 rounded-lg"
                          title="Excluir Registro"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden my-8">
            <div className="bg-gray-800 px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <FaEdit /> Editando{" "}
                {editType === "acessos" ? "Acesso" : "Frota"} #{currentItem?.id}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <form
              onSubmit={handleSave}
              className="p-6 space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Autocomplete
                    label={editType === "acessos" ? "Pessoa" : "Motorista"}
                    items={auxData.pessoas}
                    selectedItem={formData.pessoaObj}
                    onChange={(item) =>
                      setFormData({
                        ...formData,
                        id_pessoa: item?.id,
                        pessoaObj: item,
                      })
                    }
                    displayKey="nome"
                  />
                </div>
                <div>
                  <Autocomplete
                    label="Veículo"
                    items={
                      editType === "acessos"
                        ? auxData.veiculos
                        : auxData.veiculos.filter(
                            (v) => v.veiculo_de_frota_propria
                          )
                    }
                    selectedItem={formData.veiculoObj}
                    onChange={(item) =>
                      setFormData({
                        ...formData,
                        id_veiculo: item?.id,
                        veiculoObj: item,
                      })
                    }
                    displayKey="placa"
                  />
                </div>
              </div>

              {/* --- BLOCO DE DATAS CORRIGIDO --- */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-yellow-50 p-3 rounded border border-yellow-200">
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    {editType === "acessos"
                      ? "Data/Hora Entrada"
                      : "Data Saída (Início)"}
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
                    // USA FORMATADOR DE VISUALIZAÇÃO
                    value={formatDataToLocalInput(formData.data_hora_entrada)}
                    // USA FORMATADOR DE ALTERAÇÃO (Para UTC)
                    onChange={(e) =>
                      handleDateChange("data_hora_entrada", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 uppercase mb-1">
                    {editType === "acessos"
                      ? "Data/Hora Saída"
                      : "Data Retorno (Chegada)"}
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-500"
                    value={formatDataToLocalInput(formData.data_hora_saida)}
                    onChange={(e) =>
                      handleDateChange("data_hora_saida", e.target.value)
                    }
                  />
                </div>
              </div>

              {editType === "acessos" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Setor Visitado
                      </label>
                      <select
                        className="w-full border rounded p-2"
                        value={formData.id_setor_visitado}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            id_setor_visitado: e.target.value,
                          })
                        }
                      >
                        <option value="">Selecione...</option>
                        {auxData.setores.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Motivo
                      </label>
                      <input
                        className="w-full border rounded p-2"
                        value={formData.motivo_da_visita}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            motivo_da_visita: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border">
                    <div>
                      <label className="block text-xs font-bold text-green-600 uppercase mb-1">
                        Posto Entrada
                      </label>
                      <select
                        className="w-full border rounded p-2"
                        value={formData.id_posto_controle_entrada}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            id_posto_controle_entrada: e.target.value,
                          })
                        }
                      >
                        {auxData.postos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-green-600 uppercase mb-1">
                        KM Entrada
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded p-2"
                        value={formData.km_entrada}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            km_entrada: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border">
                    <div>
                      <label className="block text-xs font-bold text-red-600 uppercase mb-1">
                        Posto Saída
                      </label>
                      <select
                        className="w-full border rounded p-2"
                        value={formData.id_posto_controle_saida}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            id_posto_controle_saida: e.target.value,
                          })
                        }
                      >
                        <option value="">(Ainda no pátio)</option>
                        {auxData.postos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-red-600 uppercase mb-1">
                        KM Saída
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded p-2"
                        value={formData.km_saida}
                        onChange={(e) =>
                          setFormData({ ...formData, km_saida: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {editType === "frota" && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Cidade Destino
                      </label>
                      <select
                        className="w-full border rounded p-2"
                        value={formData.id_cidade_de_destino}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            id_cidade_de_destino: e.target.value,
                          })
                        }
                      >
                        {auxData.cidades.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                        Motivo Saída
                      </label>
                      <input
                        className="w-full border rounded p-2"
                        value={formData.motivo_saida}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            motivo_saida: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border">
                    <div>
                      <label className="block text-xs font-bold text-blue-600 uppercase mb-1">
                        Posto Saída (Início)
                      </label>
                      <select
                        className="w-full border rounded p-2"
                        value={formData.id_posto_controle_entrada}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            id_posto_controle_entrada: e.target.value,
                          })
                        }
                      >
                        {auxData.postos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-blue-600 uppercase mb-1">
                        KM Saída (Início)
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded p-2"
                        value={formData.km_entrada}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            km_entrada: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 bg-gray-50 p-3 rounded border">
                    <div>
                      <label className="block text-xs font-bold text-green-600 uppercase mb-1">
                        Posto Chegada (Fim)
                      </label>
                      <select
                        className="w-full border rounded p-2"
                        value={formData.id_posto_controle_saida}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            id_posto_controle_saida: e.target.value,
                          })
                        }
                      >
                        <option value="">(Em viagem)</option>
                        {auxData.postos.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.nome}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-green-600 uppercase mb-1">
                        KM Chegada (Fim)
                      </label>
                      <input
                        type="number"
                        className="w-full border rounded p-2"
                        value={formData.km_saida}
                        onChange={(e) =>
                          setFormData({ ...formData, km_saida: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                  Observação
                </label>
                <textarea
                  className="w-full border rounded p-2"
                  rows="2"
                  value={formData.observacao}
                  onChange={(e) =>
                    setFormData({ ...formData, observacao: e.target.value })
                  }
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2 bg-gray-100 rounded text-gray-700 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded font-bold shadow flex items-center gap-2"
                >
                  <FaSave /> Salvar Alterações
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
