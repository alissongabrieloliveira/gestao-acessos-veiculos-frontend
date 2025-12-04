import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaCar } from "react-icons/fa";

export default function Veiculos() {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(true);

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
      console.error(error);
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

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Veículos</h1>
          <p className="text-gray-500">
            Gestão de frota e veículos de terceiros
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <FaPlus /> Novo Veículo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3">Placa</th>
                  <th className="px-6 py-3">Modelo</th>
                  <th className="px-6 py-3">Cor</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {veiculos.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      Nenhum veículo cadastrado.
                    </td>
                  </tr>
                ) : (
                  veiculos.map((v) => (
                    <tr
                      key={v.id}
                      className="bg-white border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-bold text-gray-900">
                        {v.placa}
                      </td>
                      <td className="px-6 py-4">{v.modelo}</td>
                      <td className="px-6 py-4">{v.cor || "-"}</td>
                      <td className="px-6 py-4">
                        {v.veiculo_de_frota_propria ? (
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded border border-blue-200 flex items-center w-fit gap-1">
                            <FaCar size={10} /> Frota Própria
                          </span>
                        ) : (
                          <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-200">
                            Terceiro / Particular
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-3">
                        <button
                          onClick={() => handleOpenModal(v)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(v.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {editingVeiculo ? "Editar Veículo" : "Novo Veículo"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Placa *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 uppercase"
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Modelo *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Ex: Fiat Uno"
                  value={formData.modelo}
                  onChange={(e) =>
                    setFormData({ ...formData, modelo: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cor
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2"
                  placeholder="Ex: Prata"
                  value={formData.cor}
                  onChange={(e) =>
                    setFormData({ ...formData, cor: e.target.value })
                  }
                />
              </div>

              {/* Checkbox de Frota */}
              <div className="flex items-center mt-2 p-3 bg-gray-50 rounded-md border border-gray-200">
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
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label
                  htmlFor="frota-check"
                  className="ml-2 text-sm font-medium text-gray-900 cursor-pointer"
                >
                  Este é um veículo de frota própria?
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
