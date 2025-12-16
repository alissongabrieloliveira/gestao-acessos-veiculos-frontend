import axios from "axios";

// Log para ajudar a debugar se a variável foi carregada corretamente
console.log(
  "Conectando na API:",
  import.meta.env.VITE_API_URL || "Localhost (Dev)"
);

const api = axios.create({
  // Se VITE_API_URL existir (na Vercel), usa ela.
  // Se não existir (no PC), usa o localhost:3333.
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3333",
});

// Interceptador
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
