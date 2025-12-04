import React from "react";
import { Routes, Route } from "react-router-dom";

import SignIn from "../pages/SignIn";
import Dashboard from "../pages/Dashboard";

import PrivateRoutes from "./PrivateRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Rota Pública */}
      <Route path="/" element={<SignIn />} />

      {/* Grupo de Rotas Privadas */}
      <Route element={<PrivateRoutes />}>
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Futuras rotas virão aqui: */}
        {/* <Route path="/usuarios" element={<UsuariosList />} /> */}
        {/* <Route path="/pessoas" element={<PessoasList />} /> */}
      </Route>

      {/* Rota Coringa (404) - Se digitar URL errada, volta pro login */}
      <Route path="*" element={<SignIn />} />
    </Routes>
  );
}
