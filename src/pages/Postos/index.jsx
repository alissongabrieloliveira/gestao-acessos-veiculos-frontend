import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaShieldAlt,
  FaCheckCircle,
  FaDoorOpen,
} from "react-icons/fa";

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
    <div className="min-h-screen bg-gray-50/50 pb-10">
      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Postos de Controle
          </h1>
          <p className="text-gray-500 mt-1">
            Portarias, guaritas e pontos de acesso monitorados.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <FaPlus /> Novo Posto
        </button>
      </div>

      {/* --- LISTAGEM --- */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Carregando postos...
          </div>
        ) : postos.length === 0 ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center">
            <FaShieldAlt size={48} className="mb-4 opacity-20" />
            <p>Nenhum posto de controle cadastrado.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Nome do Posto
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {postos.map((posto) => (
                  <tr
                    key={posto.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold shadow-sm border border-emerald-200">
                          <FaShieldAlt size={14} />
                        </div>
                        <span className="text-sm font-bold text-gray-900">
                          {posto.nome}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(posto)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(posto.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <FaDoorOpen /> {editingPosto ? "Editar Posto" : "Novo Posto"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/80 hover:text-white text-2xl"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Nome do Posto *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaShieldAlt />
                  </div>
                  <input
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Ex: Portaria Principal"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-5 py-2.5 bg-gray-100 rounded-lg text-gray-700 font-bold hover:bg-gray-200"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 shadow-md shadow-blue-200 flex items-center gap-2"
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
