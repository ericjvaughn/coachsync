/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        field: {
          grass: '#2e7d32',
          line: '#ffffff',
          number: '#ffffff',
        },
        play: {
          offense: '#ff5722',
          defense: '#2196f3',
          route: '#ffc107',
        },
      },
      spacing: {
        'field': '100%',
        'yard': '1.67%',  // 100/60 yards = 1.67% per yard
      },
    },
  },
  plugins: [],
}
