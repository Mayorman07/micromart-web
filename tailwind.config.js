/** @type {import('tailwindcss').Config} */
export default {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        // 1. Define the Keyframes here (moved from Snowfall.module.css)
        keyframes: {
          snowfall: {
            '0%': { transform: 'translateY(-10vh) translateX(0px)', opacity: '0' },
            '10%': { opacity: '1' },
            '100%': { transform: 'translateY(110vh) translateX(50px)', opacity: '0.2' },
          }
        },
        // 2. Register the animation name so Tailwind recognizes 'animate-snowfall'
        animation: {
          snowfall: 'snowfall 10s linear infinite',
        }
      },
    },
    plugins: [],
  }