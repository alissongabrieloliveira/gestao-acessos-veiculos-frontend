import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaShieldAlt } from "react-icons/fa";

export default function Postos() {
  const [postos, setPostos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPosto, setEditingPosto] = useState(null);
  const [nome, setNome] = useState("");

  useEffect(() => {
    loadPostos();
  }, []);

  async function loadPostos() {
    setLoading(true);
    try {
      const response = await api.get("/postos");
      setPostos(response.data);
    } catch (error) {
      alert("Erro ao carregar postos.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(posto = null) {
    if (posto) {
      setEditingPosto(posto);
      setNome(posto.nome);
    } else {
      setEditingPosto(null);
      setNome("");
    }
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!nome) return alert("Nome é obrigatório");

    try {
      if (editingPosto) {
        await api.put(`/postos/${editingPosto.id}`, { nome });
        alert("Posto atualizado!");
      } else {
        await api.post("/postos", { nome });
        alert("Posto criado!");
      }
      setShowModal(false);
      loadPostos();
    } catch (error) {
      alert("Erro ao salvar posto.");
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Excluir este posto?")) {
      try {
        await api.delete(`/postos/${id}`);
        loadPostos();
      } catch (error) {
        alert("Não é possível excluir postos com movimentações.");
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Postos de Controle
          </h1>
          <p className="text-gray-500">Portarias e pontos de acesso</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Novo Posto
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Carregando...</div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-50 border-b uppercase">
              <tr>
                <th className="px-6 py-3">Nome do Posto</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {postos.map((posto) => (
                <tr key={posto.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-2 font-medium text-gray-900">
                    <FaShieldAlt className="text-gray-400" /> {posto.nome}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleOpenModal(posto)}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(posto.id)}
                      className="text-red-500"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold text-lg">
                {editingPosto ? "Editar Posto" : "Novo Posto"}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSave}>
              <label className="block text-sm font-medium mb-1">Nome</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full border rounded p-2 mb-4"
                required
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-gray-100 rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded"
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
