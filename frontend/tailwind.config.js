/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#e8521a',
          dark: '#c4400e',
          light: '#ff7043',
        },
        surface: {
          DEFAULT: '#1a1a1a',
          2: '#242424',
          3: '#2e2e2e',
        },
      },
      animation: {
        'pulse-ring': 'pulse-ring 1.5s ease-out infinite',
        'slide-up': 'slide-up 0.3s ease',
        'fade-in': 'fade-in 0.4s ease',
      },
      keyframes: {
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(232,82,26,0.4)' },
          '70%': { boxShadow: '0 0 0 10px rgba(232,82,26,0)' },
          '100%': { boxShadow: '0 0 0 0 rgba(232,82,26,0)' },
        },
        'slide-up': {
          from: { transform: 'translateY(20px)', opacity: 0 },
          to: { transform: 'translateY(0)', opacity: 1 },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
