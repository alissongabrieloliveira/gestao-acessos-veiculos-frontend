import React from "react";
import { FaCar } from "react-icons/fa"; // Testando react-icons

function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
        <div className="flex justify-center mb-4 text-blue-600">
          <FaCar size={50} />
        </div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Sistema de Portaria
        </h1>
        <p className="text-gray-600 mb-6">
          Ambiente React + Vite + Tailwind configurado com sucesso!
        </p>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
          Acessar Sistema
        </button>
      </div>
    </div>
  );
}

export default App;
