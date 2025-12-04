import React from "react";
import { Routes, Route } from "react-router-dom";

import SignIn from "../pages/SignIn";
import Dashboard from "../pages/Dashboard";
import Pessoas from "../pages/Pessoas";
import Veiculos from "../pages/Veiculos";
import Setores from "../pages/Setores";
import Postos from "../pages/Postos";
import Layout from "../components/Layout";
import PrivateRoutes from "./PrivateRoutes";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SignIn />} />

      {/* Rotas Privadas */}
      <Route element={<PrivateRoutes />}>
        {/* Envolvemos todas as rotas internas no Layout */}
        <Route element={<Layout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/pessoas" element={<Pessoas />} />
          <Route path="/veiculos" element={<Veiculos />} />
          <Route path="/setores" element={<Setores />} />
          <Route path="/postos" element={<Postos />} />
        </Route>
      </Route>

      <Route path="*" element={<SignIn />} />
    </Routes>
  );
}
