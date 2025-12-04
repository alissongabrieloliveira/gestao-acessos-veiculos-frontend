import React, { useState, useEffect } from "react";
import api from "../../services/api";
import { FaPlus, FaEdit, FaTrash, FaTimes, FaSearch } from "react-icons/fa";

export default function Pessoas() {
  // Estados de Dados
  const [pessoas, setPessoas] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados do Modal e Formulário
  const [showModal, setShowModal] = useState(false);
  const [editingPessoa, setEditingPessoa] = useState(null); // Se null, é criação. Se tem obj, é edição.
  const [formData, setFormData] = useState({
    nome: "",
    documento: "",
    telefone: "",
    tipo_pessoa_id: "",
  });

  // Carrega dados iniciais (Lista e Tipos para o Select)
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
      console.error("Erro ao carregar pessoas", error);
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

  // Controle do Modal
  function handleOpenModal(pessoa = null) {
    if (pessoa) {
      // Modo Edição
      setEditingPessoa(pessoa);
      setFormData({
        nome: pessoa.nome,
        documento: pessoa.documento,
        telefone: pessoa.telefone || "",
        tipo_pessoa_id: pessoa.tipo_pessoa_id,
      });
    } else {
      // Modo Criação
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

  // Salvar (Criar ou Editar)
  async function handleSave(e) {
    e.preventDefault();

    // Validação simples
    if (!formData.nome || !formData.documento || !formData.tipo_pessoa_id) {
      alert("Preencha os campos obrigatórios.");
      return;
    }

    try {
      if (editingPessoa) {
        // Editar (PUT)
        await api.put(`/pessoas/${editingPessoa.id}`, formData);
        alert("Pessoa atualizada com sucesso!");
      } else {
        // Criar (POST)
        await api.post("/pessoas", formData);
        alert("Pessoa cadastrada com sucesso!");
      }

      handleCloseModal();
      loadData(); // Recarrega a lista
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.error || "Erro ao salvar dados.";
      alert(msg);
    }
  }

  // Deletar
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

  return (
    <div>
      {/* Cabeçalho da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pessoas</h1>
          <p className="text-gray-500">Colaboradores, Terceiros e Visitantes</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
        >
          <FaPlus /> Nova Pessoa
        </button>
      </div>

      {/* Tabela de Listagem */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Carregando...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3">Nome</th>
                  <th className="px-6 py-3">Documento</th>
                  <th className="px-6 py-3">Tipo</th>
                  <th className="px-6 py-3">Telefone</th>
                  <th className="px-6 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody>
                {pessoas.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-8 text-center text-gray-400"
                    >
                      Nenhuma pessoa cadastrada.
                    </td>
                  </tr>
                ) : (
                  pessoas.map((pessoa) => (
                    <tr
                      key={pessoa.id}
                      className="bg-white border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {pessoa.nome}
                      </td>
                      <td className="px-6 py-4">{pessoa.documento}</td>
                      <td className="px-6 py-4">
                        <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded border border-gray-200">
                          {pessoa.tipo_descricao}
                        </span>
                      </td>
                      <td className="px-6 py-4">{pessoa.telefone || "-"}</td>
                      <td className="px-6 py-4 text-right flex justify-end gap-3">
                        <button
                          onClick={() => handleOpenModal(pessoa)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Editar"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(pessoa.id)}
                          className="text-red-500 hover:text-red-700"
                          title="Excluir"
                        >
                          <FaTrash size={16} />
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

      {/* MODAL (Formulário) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
            {/* Header do Modal */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">
                {editingPessoa ? "Editar Pessoa" : "Nova Pessoa"}
              </h3>
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Corpo do Formulário */}
            <form onSubmit={handleSave} className="p-6 space-y-4">
              {/* Nome */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Maria Silva"
                  value={formData.nome}
                  onChange={(e) =>
                    setFormData({ ...formData, nome: e.target.value })
                  }
                  required
                />
              </div>

              {/* Documento e Telefone (Grid) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Documento (CPF/RG) *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Somente números"
                    value={formData.documento}
                    onChange={(e) =>
                      setFormData({ ...formData, documento: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="(00) 00000-0000"
                    value={formData.telefone}
                    onChange={(e) =>
                      setFormData({ ...formData, telefone: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Tipo de Pessoa (Select) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Pessoa *
                </label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  value={formData.tipo_pessoa_id}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo_pessoa_id: e.target.value })
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

              {/* Botões de Ação */}
              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
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
