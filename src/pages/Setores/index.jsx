import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaBuilding } from "react-icons/fa";

export default function Setores() {
  const [setores, setSetores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSetor, setEditingSetor] = useState(null);
  const [nome, setNome] = useState("");

  useEffect(() => {
    loadSetores();
  }, []);

  async function loadSetores() {
    setLoading(true);
    try {
      const response = await api.get("/setores");
      setSetores(response.data);
    } catch (error) {
      alert("Erro ao carregar setores.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(setor = null) {
    if (setor) {
      setEditingSetor(setor);
      setNome(setor.nome);
    } else {
      setEditingSetor(null);
      setNome("");
    }
    setShowModal(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!nome) return alert("Nome é obrigatório");

    try {
      if (editingSetor) {
        await api.put(`/setores/${editingSetor.id}`, { nome });
        alert("Setor atualizado!");
      } else {
        await api.post("/setores", { nome });
        alert("Setor criado!");
      }
      setShowModal(false);
      loadSetores();
    } catch (error) {
      alert("Erro ao salvar setor.");
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Excluir este setor?")) {
      try {
        await api.delete(`/setores/${id}`);
        loadSetores();
      } catch (error) {
        alert("Não é possível excluir setores em uso.");
      }
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Setores</h1>
          <p className="text-gray-500">Departamentos e áreas da empresa</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Novo Setor
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Carregando...</div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-50 border-b uppercase">
              <tr>
                <th className="px-6 py-3">Nome do Setor</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {setores.map((setor) => (
                <tr key={setor.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 flex items-center gap-2 font-medium text-gray-900">
                    <FaBuilding className="text-gray-400" /> {setor.nome}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleOpenModal(setor)}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(setor.id)}
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
                {editingSetor ? "Editar Setor" : "Novo Setor"}
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
