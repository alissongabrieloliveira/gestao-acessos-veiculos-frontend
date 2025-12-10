import React, { useState, useEffect } from "react";
import api from "../../services/api";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaTimes,
  FaSearch,
  FaUserFriends,
  FaUser,
  FaIdCard,
  FaPhone,
  FaUserTag,
  FaCheckCircle,
} from "react-icons/fa";

export default function Pessoas() {
  const [pessoas, setPessoas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState(null);
  const [formData, setFormData] = useState({
    nome: "",
    documento: "",
    telefone: "",
    tipo_pessoa_id: "",
  });

  useEffect(() => {
    loadData();
    loadTipos();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const response = await api.get("/pessoas");
      setPessoas(response.data);
    } catch (error) {
      alert("Erro ao carregar lista de pessoas.");
    } finally {
      setLoading(false);
    }
  }

  async function loadTipos() {
    try {
      const response = await api.get("/pessoas/tipos");
      setTipos(response.data);
    } catch (error) {
      console.error("Erro ao carregar tipos", error);
    }
  }

  function handleOpenModal(pessoa = null) {
    if (pessoa) {
      setEditingPessoa(pessoa);
      setFormData({
        nome: pessoa.nome,
        documento: pessoa.documento,
        telefone: pessoa.telefone || "",
        tipo_pessoa_id: pessoa.tipo_pessoa_id,
      });
    } else {
      setEditingPessoa(null);
      setFormData({
        nome: "",
        documento: "",
        telefone: "",
        tipo_pessoa_id: "",
      });
    }
    setShowModal(true);
  }

  function handleCloseModal() {
    setShowModal(false);
    setEditingPessoa(null);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!formData.nome || !formData.documento || !formData.tipo_pessoa_id) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    try {
      if (editingPessoa) {
        await api.put(`/pessoas/${editingPessoa.id}`, formData);
        alert("Pessoa atualizada com sucesso!");
      } else {
        await api.post("/pessoas", formData);
        alert("Pessoa cadastrada com sucesso!");
      }
      handleCloseModal();
      loadData();
    } catch (error) {
      const msg = error.response?.data?.error || "Erro ao salvar dados.";
      alert(msg);
    }
  }

  async function handleDelete(id) {
    if (window.confirm("Tem certeza que deseja excluir esta pessoa?")) {
      try {
        await api.delete(`/pessoas/${id}`);
        loadData();
      } catch (error) {
        const msg = error.response?.data?.error || "Erro ao excluir.";
        alert(msg);
      }
    }
  }

  // Lógica de Filtro Frontend
  const filteredPessoas = pessoas.filter(
    (p) =>
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.documento.includes(searchTerm)
  );

  // Helper para cor do Badge
  const getTypeColor = (tipo) => {
    switch (tipo?.toLowerCase()) {
      case "colaborador":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "visitante":
        return "bg-green-100 text-green-700 border-green-200";
      case "terceiro":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-10">
      {/* --- CABEÇALHO --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Pessoas
          </h1>
          <p className="text-gray-500 mt-1">
            Gerencie colaboradores, visitantes e terceiros.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-md shadow-blue-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <FaPlus /> Nova Pessoa
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
              placeholder="Buscar por nome ou documento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="text-sm text-gray-500 hidden md:block">
            Total: <strong>{filteredPessoas.length}</strong> registros
          </div>
        </div>

        {/* Tabela */}
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            Carregando dados...
          </div>
        ) : filteredPessoas.length === 0 ? (
          <div className="p-12 text-center text-gray-400 flex flex-col items-center">
            <FaUserFriends size={48} className="mb-4 opacity-20" />
            <p>Nenhuma pessoa encontrada.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Nome / Documento
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    Contato
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPessoas.map((pessoa) => (
                  <tr
                    key={pessoa.id}
                    className="hover:bg-blue-50/30 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold shadow-sm border border-gray-200 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                          {pessoa.nome.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">
                            {pessoa.nome}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <FaIdCard size={10} /> {pessoa.documento}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${getTypeColor(
                          pessoa.tipo_descricao
                        )}`}
                      >
                        {pessoa.tipo_descricao}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {pessoa.telefone ? (
                        <div className="flex items-center gap-2">
                          <FaPhone className="text-gray-400" size={12} />{" "}
                          {pessoa.telefone}
                        </div>
                      ) : (
                        <span className="text-gray-400 text-xs italic">
                          Não informado
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(pessoa)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(pessoa.id)}
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

      {/* --- MODAL (Estilizado) --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden transform transition-all scale-100">
            {/* Header Modal */}
            <div className="bg-blue-600 px-6 py-4 flex justify-between items-center">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <FaUser /> {editingPessoa ? "Editar Pessoa" : "Nova Pessoa"}
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
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    placeholder="Ex: Maria Silva"
                    value={formData.nome}
                    onChange={(e) =>
                      setFormData({ ...formData, nome: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Documento *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaIdCard />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="CPF/RG"
                      value={formData.documento}
                      onChange={(e) =>
                        setFormData({ ...formData, documento: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                    Telefone
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <FaPhone />
                    </div>
                    <input
                      type="text"
                      className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                      placeholder="(00) 0000-0000"
                      value={formData.telefone}
                      onChange={(e) =>
                        setFormData({ ...formData, telefone: e.target.value })
                      }
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">
                  Tipo de Pessoa *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <FaUserTag />
                  </div>
                  <select
                    className="w-full pl-10 border border-gray-300 rounded-lg px-3 py-2.5 bg-gray-50 focus:bg-white outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none"
                    value={formData.tipo_pessoa_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipo_pessoa_id: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Selecione...</option>
                    {tipos.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.nome}
                      </option>
                    ))}
                  </select>
                </div>
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
