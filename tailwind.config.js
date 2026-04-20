/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          200: '#ffd0d8',
          300: '#ff9fb1',
          400: '#ff6f8a',
          500: '#ef476f',
          600: '#d6335d',
        },
        surface: {
          DEFAULT: '#241116',
          card: '#31171f',
          border: '#5b2935',
          muted: '#e2b7c3',
        },
      },
      fontFamily: {
        body: ['DM Sans', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fade-in 280ms ease-out',
        'slide-up': 'slide-up 360ms ease-out',
      },
    },
  },
  plugins: [],
}
