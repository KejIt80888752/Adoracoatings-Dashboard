/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          dark:    '#0D0D0D',
          sidebar: '#141414',
          card:    '#1A1A1A',
          border:  '#2A2A2A',
          gold:    '#C9A96E',
          'gold-light': '#E2C99A',
          'gold-dark':  '#A07840',
          cream:   '#F5F0E8',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      boxShadow: {
        gold: '0 0 0 1px rgba(201,169,110,0.3)',
        card: '0 2px 12px rgba(0,0,0,0.4)',
      },
    },
  },
  plugins: [],
}
