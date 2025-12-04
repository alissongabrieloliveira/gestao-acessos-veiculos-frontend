/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      // Customizar as cores do sistema futuramente
      colors: {
        primary: "#1e40af", // Exemplo de azul corporativo
        secondary: "#64748b",
      },
    },
  },
  plugins: [],
};
