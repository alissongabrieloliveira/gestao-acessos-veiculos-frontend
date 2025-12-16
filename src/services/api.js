import axios from "axios";

console.log("Tentando conectar em:", import.meta.env.VITE_API_URL);

const api = axios.create({
  baseURL: "https://gestao-acessos-veiculos-api-production.up.railway.app",
});

// Interceptador: Antes de cada requisição, verifique se tem token
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
