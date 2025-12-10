import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaCar,
  FaPalette,
  FaCheckCircle,
  FaShuttleVan,
  FaTag,
} from "react-icons/fa";

export default function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Estados do Modal
  const [showModal, setShowModal] = useState(false);
  const [editingVeiculo, setEditingVeiculo] = useState(null);

  // Dados do Formulário
  const [formData, setFormData] = useState({
    placa: "",
    modelo: "",
    cor: "",
    veiculo_de_frota_propria: false,
  });

  useEffect(() => {
    loadVeiculos();
  }, []);

  async function loadVeiculos() {
    setLoading(true);
    try {
      const response = await api.get("/veiculos");
      setVeiculos(response.data);
    } catch (error) {
      alert("Erro ao carregar veículos.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(veiculo = null) {
    if (veiculo) {
      setEditingVeiculo(veiculo);
      setFormData({
        placa: veiculo.placa,
        modelo: veiculo.modelo || "",
        cor: veiculo.cor || "",
        veiculo_de_frota_propria: veiculo.veiculo_de_frota_propria,
      });
    } else {
      setEditingVeiculo(null);
      setFormData({
        placa: "",
        modelo: "",
        cor: "",
        veiculo_de_frota_propria: false,
      });
    }
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingVeiculo(null);
  }

  async function handleSave(e) {
    e.preventDefault();

    if (!formData.placa || !formData.modelo) {
      alert("Placa e Modelo são obrigatórios.");
      return;
    }

    try {
      if (editingVeiculo) {
        await api.put(`/veiculos/${editingVeiculo.id}`, formData);
        alert("Veículo atualizado!");
      } else {
        await api.post("/veiculos", formData);
        alert("Veículo cadastrado!");
      }
      handleCloseModal();
      loadVeiculos();
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao salvar.";
      alert(msg);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Excluir este veículo?")) {
      try {
        await api.delete(`/veiculos/${id}`);
        loadVeiculos();
      } catch (error) {
        alert("Erro ao excluir veículo. Ele pode ter histórico de acessos.");
      }
    }
  }

  // Filtro Frontend
  const filteredVeiculos = veiculos.filter(
    (v) =>
      v.placa.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.modelo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Veículos
          </h1>
          <p className="text-gray-500 mt-1">
            Gestão da frota e veículos de terceiros.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <FaPlus /> Novo Veículo
        </button>
      </div>

      {/* --- BARRA DE BUSCA E LISTAGEM --- */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {/* Barra de Busca */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-4 bg-gray-50/50">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FaSearch />
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Buscar por placa ou modelo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500 hidden md:block">
            Exibindo <strong>{filteredVeiculos.length}</strong> veículos
          </div>
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Carregando frota...
          </div>
        ) : filteredVeiculos.length === 0 ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center">
            <FaCar size={48} className="mb-4 opacity-20" />
            <p>Nenhum veículo encontrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Veículo / Placa
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Cor
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Classificação
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredVeiculos.map((v) => (
                  <tr
                    key={v.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Ícone */}
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-sm border transition-colors ${
                            v.veiculo_de_frota_propria
                              ? "bg-blue-100 text-blue-600 border-blue-200"
                              : "bg-gray-100 text-gray-500 border-gray-200"
                          }`}
                        >
                          {v.veiculo_de_frota_propria ? (
                            <FaShuttleVan />
                          ) : (
                            <FaCar />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {v.modelo}
                          </p>
                          <p className="text-xs font-mono font-bold bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded w-fit mt-0.5 border border-gray-200">
                            {v.placa}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <FaPalette className="text-gray-300" size={12} />{" "}
                        {v.cor || "-"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {v.veiculo_de_frota_propria ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                          <FaTag size={10} /> FROTA PRÓPRIA
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                          TERCEIRO
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(v)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir"
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

      {/* --- MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            {/* Header */}
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <FaCar /> {editingVeiculo ? "Editar Veículo" : "Novo Veículo"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-white/80 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Placa *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaTag />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all font-mono uppercase"
                    placeholder="ABC-1234"
                    maxLength={8}
                    value={formData.placa}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        placa: e.target.value.toUpperCase(),
                      })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Modelo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaCar />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Ex: Fiat Uno"
                    value={formData.modelo}
                    onChange={(e) =>
                      setFormData({ ...formData, modelo: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Cor
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaPalette />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Ex: Prata"
                    value={formData.cor}
                    onChange={(e) =>
                      setFormData({ ...formData, cor: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Checkbox Estilizado */}
              <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input
                  id="frota-check"
                  type="checkbox"
                  checked={formData.veiculo_de_frota_propria}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      veiculo_de_frota_propria: e.target.checked,
                    })
                  }
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="frota-check"
                  className="ml-3 text-sm font-bold text-gray-700 cursor-pointer select-none"
                >
                  Pertence à Frota Própria?
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-5 py-2.5 bg-gray-100 rounded-lg text-gray-700 font-bold hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md shadow-blue-200 transition-all flex items-center gap-2"
                >
                  <FaCheckCircle /> Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
