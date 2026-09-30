/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#070b14',
          900: '#0c1220',
          800: '#141c2e',
          700: '#1c2740',
        },
        accent: {
          400: '#7dd3fc',
          500: '#38bdf8',
          600: '#0284c7',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
