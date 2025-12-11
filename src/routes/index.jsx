import React from "react";
import { Routes, Route } from "react-router-dom";

import SignIn from "../pages/SignIn";
import Dashboard from "../pages/Dashboard";
import Pessoas from "../pages/Pessoas";
import Veiculos from "../pages/Veiculos";
import Setores from "../pages/Setores";
import Postos from "../pages/Postos";
import Usuarios from "../pages/Usuarios";
import MovimentacoesAcessos from "../pages/MovimentacoesAcessos";
import MovimentacoesFrota from "../pages/MovimentacoesFrota";
import Relatorios from "../pages/Relatorios";

import Layout from "../components/Layout";
import PrivateRoutes from "./PrivateRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />

      {/* --- GRUPO 1: ACESSO GERAL (Admin e Operador) --- */}
      <Route element={<PrivateRoutes />}>
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />

          {/* Operacional */}
          <Route
            path="/movimentacoes/acessos"
            element={<MovimentacoesAcessos />}
          />
          <Route path="/movimentacoes/frota" element={<MovimentacoesFrota />} />
          <Route path="/relatorios" element={<Relatorios />} />

          {/* Cadastros do Dia a Dia (Operador precisa cadastrar visitantes) */}
          <Route path="/pessoas" element={<Pessoas />} />
          <Route path="/veiculos" element={<Veiculos />} />
        </Route>
      </Route>

      {/* --- GRUPO 2: EXCLUSIVO ADMIN --- */}
      {/* Prop tipo_de_usuario="admin"*/}
      <Route element={<PrivateRoutes tipo="admin" />}>
        <Route element={<Layout />}>
          <Route path="/usuarios" element={<Usuarios />} />
          <Route path="/setores" element={<Setores />} />
          <Route path="/postos" element={<Postos />} />
        </Route>
      </Route>

      <Route path="*" element={<SignIn />} />
    </Routes>
  );
}
