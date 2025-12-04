import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000", // Endereço do Backend
});

// Interceptador: Antes de cada requisição, verifique se tem token
api.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("@App:token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
