import React from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";

// O AuthProvider já está envolvendo o App lá no main.jsx,

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
