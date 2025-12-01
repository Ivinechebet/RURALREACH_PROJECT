/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {},
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: '#69a174ff', // Define your custom border color
           background: "#F5F6FA",   // change to your color
           foreground: "#111827",
      },
    },
  },
  plugins: [],
}

