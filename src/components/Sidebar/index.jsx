import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  FaThLarge,
  FaExchangeAlt,
  FaCar,
  FaFileAlt,
  FaUserFriends,
  FaUser,
  FaShieldAlt,
  FaBuilding,
  FaSignOutAlt,
  FaTools,
} from "react-icons/fa";

// logo
import logoImg from "../../assets/logo.png";

export default function Sidebar({ onClose }) {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const isAdmin = user?.tipo_de_usuario === "admin";

  const isActive = (path) => {
    return location.pathname === path
      ? "bg-white text-blue-900 shadow-sm"
      : "text-gray-700 hover:bg-gray-200";
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-full h-full bg-gray-100 flex flex-col border-r border-gray-200 print:hidden">
      {/* 1. Logo / Cabeçalho da Sidebar */}
      <div className="p-6 flex items-center gap-3 border-b border-gray-200/50">
        <img
          src={logoImg}
          alt="Logo Gestão de Acesso"
          className="w-10 h-10 object-contain"
        />

        <div className="flex-1 min-w-0">
          {" "}
          <h1 className="text-lg font-bold text-gray-800 leading-tight whitespace-nowrap">
            Gestão de Acesso
          </h1>
          <p className="text-[11px] text-gray-500 font-medium mt-0.5 whitespace-nowrap">
            Segurança com Simplicidade.
          </p>
        </div>
      </div>

      {/* 2. Menu de Navegação */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-2">
          Menu Principal
        </p>

        <Link
          to="/dashboard"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive(
            "/dashboard"
          )}`}
        >
          <FaThLarge /> Dashboard
        </Link>

        <Link
          to="/movimentacoes/acessos"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive(
            "/movimentacoes/acessos"
          )}`}
        >
          <FaExchangeAlt /> Movimentações de Acessos
        </Link>

        <Link
          to="/movimentacoes/frota"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive(
            "/movimentacoes/frota"
          )}`}
        >
          <FaCar /> Movimentações de Frota
        </Link>

        <Link
          to="/relatorios"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive(
            "/relatorios"
          )}`}
        >
          <FaFileAlt /> Relatórios
        </Link>

        <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-8">
          Cadastros
        </p>

        <Link
          to="/pessoas"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive(
            "/pessoas"
          )}`}
        >
          <FaUserFriends /> Pessoas
        </Link>

        <Link
          to="/veiculos"
          onClick={handleLinkClick}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive(
            "/veiculos"
          )}`}
        >
          <FaCar /> Veículos
        </Link>

        {isAdmin && (
          <>
            <div className="my-4 border-t border-gray-200 mx-3"></div>
            <p className="px-3 text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
              Administração
            </p>

            <Link
              to="/usuarios"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive(
                "/usuarios"
              )}`}
            >
              <FaUser /> Usuários
            </Link>

            <Link
              to="/postos"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive(
                "/postos"
              )}`}
            >
              <FaShieldAlt /> Postos de Controle
            </Link>

            <Link
              to="/setores"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive(
                "/setores"
              )}`}
            >
              <FaBuilding /> Setores
            </Link>

            <Link
              to="/acoes-movimentacoes"
              onClick={handleLinkClick}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive(
                "/acoes-movimentacoes"
              )}`}
            >
              <FaTools /> Ações de Movimentações
            </Link>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-lg font-bold text-gray-600 shadow-sm border border-gray-100">
            {user?.nome?.charAt(0) || "U"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">
              {user?.nome || "Usuário"}
            </p>
            <p className="text-xs text-gray-500 truncate capitalize">
              {user?.tipo_de_usuario === "admin" ? "Administrador" : "Operador"}
            </p>
          </div>
          <button
            onClick={signOut}
            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Sair do sistema"
          >
            <FaSignOutAlt size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
}
