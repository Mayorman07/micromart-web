/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        snowfall: 'snowfall 10s linear infinite',
        blob: "blob 7s infinite",
      },
      keyframes: {
        snowfall: {
          '0%': { transform: 'translateY(-10vh) translateX(0px)', opacity: '0' },
          '10%': { opacity: '1' },
          '100%': { transform: 'translateY(110vh) translateX(50px)', opacity: '0.2' },
        },
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
      },
    },
  },
  plugins: [],
}