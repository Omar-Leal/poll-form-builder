// tailwind.config.cjs  <- Nombre de archivo correcto

/** @type {import('tailwindcss').Config} */
module.exports = { //  <- Sintaxis CommonJS correcta
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}', // Asegúrate que esta ruta siga siendo correcta para tu proyecto
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'), // require() también es sintaxis CommonJS
  ],
}