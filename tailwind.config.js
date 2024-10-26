/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        primary:'#ff5200'
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),

  ],
}