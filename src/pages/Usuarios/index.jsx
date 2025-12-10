import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaUserShield,
  FaEnvelope,
  FaLock,
  FaCheckCircle,
  FaUserCog,
  FaPowerOff,
} from "react-icons/fa";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    senha: "",
    tipo_de_usuario: "operador",
    ativo: true,
  });

  useEffect(() => {
    loadUsuarios();
  }, []);

  async function loadUsuarios() {
    setLoading(true);
    try {
      const response = await api.get("/usuarios");
      setUsuarios(response.data);
    } catch (error) {
      alert("Erro ao carregar usuários.");
    } finally {
      setLoading(false);
    }
  }

  function handleOpenModal(user = null) {
    if (user) {
      setEditingId(user.id);
      setFormData({
        nome: user.nome,
        email: user.email,
        senha: "", // Senha vazia na edição
        tipo_de_usuario: user.tipo_de_usuario,
        ativo: user.ativo,
      });
    } else {
      setEditingId(null);
      setFormData({
        nome: "",
        email: "",
        senha: "",
        tipo_de_usuario: "operador",
        ativo: true,
      });
    }
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingId(null);
  }

  async function handleSave(e) {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/usuarios/${editingId}`, formData);
        alert("Usuário atualizado!");
      } else {
        if (!formData.senha)
          return alert("Senha é obrigatória para novos usuários.");
        await api.post("/usuarios", formData);
        alert("Usuário criado!");
      }
      handleCloseModal();
      loadUsuarios();
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao salvar usuário.";
      alert(msg);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Excluir este usuário?")) {
      try {
        await api.delete(`/usuarios/${id}`);
        loadUsuarios();
      } catch (error) {
        alert("Erro ao excluir usuário.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Usuários
          </h1>
          <p className="text-gray-500 mt-1">
            Gerencie os operadores e administradores do sistema.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <FaPlus /> Novo Usuário
        </button>
      </div>

      {/* --- LISTAGEM --- */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Carregando usuários...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Usuário
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Permissão
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {usuarios.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shadow-sm border ${
                            u.tipo_de_usuario === "admin"
                              ? "bg-purple-100 text-purple-600 border-purple-200"
                              : "bg-blue-100 text-blue-600 border-blue-200"
                          }`}
                        >
                          {u.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {u.nome}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FaEnvelope size={10} /> {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {u.tipo_de_usuario === "admin" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 border border-purple-200">
                          <FaUserCog size={12} /> ADMINISTRADOR
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                          <FaUserShield size={12} /> OPERADOR
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                          u.ativo
                            ? "bg-green-100 text-green-700 border-green-200"
                            : "bg-red-100 text-red-700 border-red-200"
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            u.ativo ? "bg-green-500" : "bg-red-500"
                          }`}
                        ></div>
                        {u.ativo ? "ATIVO" : "INATIVO"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(u)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(u.id)}
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
                <FaUserShield /> {editingId ? "Editar Usuário" : "Novo Usuário"}
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
                  Nome Completo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaUserShield />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Ex: João Admin"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  E-mail de Login *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="email@empresa.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Senha{" "}
                  {editingId && (
                    <span className="text-gray-400 font-normal lowercase">
                      (deixe em branco para manter)
                    </span>
                  )}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="********"
                    value={formData.senha}
                    onChange={(e) =>
                      setFormData({ ...formData, senha: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Permissão de Acesso
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaUserCog />
                  </div>
                  <select
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                    value={formData.tipo_de_usuario}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipo_de_usuario: e.target.value,
                      })
                    }
                  >
                    <option value="operador">Operador (Acesso Padrão)</option>
                    <option value="admin">Administrador (Acesso Total)</option>
                  </select>
                </div>
              </div>

              {/* Toggle de Status */}
              <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-200 justify-between">
                <div className="flex items-center gap-2 text-gray-700">
                  <FaPowerOff
                    className={
                      formData.ativo ? "text-green-500" : "text-gray-400"
                    }
                  />
                  <span className="text-sm font-bold">Usuário Ativo?</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.ativo}
                    onChange={(e) =>
                      setFormData({ ...formData, ativo: e.target.checked })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
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
