import React from "react";
import { Routes, Route } from "react-router-dom";

import SignIn from "../pages/SignIn";
import Dashboard from "../pages/Dashboard";
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

          {/* Adicionaremos as outras rotas futuramente */}
          {/* <Route path="/pessoas" element={<Pessoas />} /> */}
        </Route>
      </Route>

      <Route path="*" element={<SignIn />} />
    </Routes>
  );
}
