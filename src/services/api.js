import axios from "axios";

// Log para confirmar no navegador se a variável foi carregada
console.log("Ambiente:", import.meta.env.VITE_API_URL ? "Produção" : "Local");
console.log(
  "Conectando em:",
  import.meta.env.VITE_API_URL || "http://localhost:3333"
);

const api = axios.create({
  // Tenta pegar a variável da Vercel. Se não achar, usa localhost.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
});

// Interceptador para adicionar o Token automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("@App:token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
