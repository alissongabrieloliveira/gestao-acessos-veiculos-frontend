import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../services/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Ao carregar a tela, verifica se já existe um token salvo
    const loadStorageData = async () => {
      const storedUser = localStorage.getItem("@App:user");
      const storedToken = localStorage.getItem("@App:token");

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        // O interceptor do api.js já vai pegar o token do localStorage,
        // Podendo definir o header padrão aqui também por garantia
        api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
      }

      setLoading(false);
    };

    loadStorageData();
  }, []);

  async function signIn(email, senha) {
    try {
      const response = await api.post("/login", {
        email,
        senha,
      });

      const { token, user } = response.data;

      localStorage.setItem("@App:user", JSON.stringify(user));
      localStorage.setItem("@App:token", token);

      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(user);
    } catch (error) {
      console.error("Erro no login", error);
      throw error; // Lança o erro para a tela de login tratar (ex: mostrar mensagem)
    }
  }

  function signOut() {
    localStorage.clear();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        signed: !!user, // Transforma em booleano (true se tiver usuário)
        user,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para facilitar a importação
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
