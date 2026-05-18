/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT:  '#2a7b7b',
          light:    '#3a9595',
          dark:     '#1a5f5f',
          50:       '#f0fafa',
          100:      '#d1f0f0',
          200:      '#a3e0e0',
        },
      },
      fontFamily: {
        sans:    ['Inter', 'system-ui', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
    },
  },
  plugins: [],
}
