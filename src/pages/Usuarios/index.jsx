import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaUserShield } from "react-icons/fa";

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
        senha: "", // Senha sempre vazia na edição
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

  async function handleSave(e) {
    e.preventDefault();
    try {
      if (editingId) {
        // Na edição, se a senha estiver vazia, o backend ignora (mantém a antiga)
        await api.put(`/usuarios/${editingId}`, formData);
        alert("Usuário atualizado!");
      } else {
        if (!formData.senha)
          return alert("Senha é obrigatória para novos usuários.");
        await api.post("/usuarios", formData);
        alert("Usuário criado!");
      }
      setShowModal(false);
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Usuários</h1>
          <p className="text-gray-500">
            Operadores e Administradores do sistema
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus /> Novo Usuário
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Carregando...</div>
        ) : (
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="bg-gray-50 border-b uppercase">
              <tr>
                <th className="px-6 py-3">Nome</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Tipo</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                    <FaUserShield className="text-gray-400" /> {u.nome}
                  </td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4 capitalize">{u.tipo_de_usuario}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        u.ativo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {u.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <button
                      onClick={() => handleOpenModal(u)}
                      className="text-blue-600"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(u.id)}
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
                {editingId ? "Editar Usuário" : "Novo Usuário"}
              </h3>
              <button onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nome</label>
                <input
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">E-mail</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border rounded p-2"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Senha {editingId && "(Deixe em branco para manter)"}
                </label>
                <input
                  type="password"
                  value={formData.senha}
                  onChange={(e) =>
                    setFormData({ ...formData, senha: e.target.value })
                  }
                  className="w-full border rounded p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Tipo de Usuário
                </label>
                <select
                  value={formData.tipo_de_usuario}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      tipo_de_usuario: e.target.value,
                    })
                  }
                  className="w-full border rounded p-2 bg-white"
                >
                  <option value="operador">Operador</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.ativo}
                  onChange={(e) =>
                    setFormData({ ...formData, ativo: e.target.checked })
                  }
                  id="ativoCheck"
                />
                <label htmlFor="ativoCheck" className="text-sm font-medium">
                  Usuário Ativo
                </label>
              </div>

              <div className="flex justify-end gap-2 mt-4">
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
