/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#208091',
        'primary-dark': '#16647a',
        secondary: '#5E5240',
        success: '#22B14C',
        error: '#C01A2F',
        warning: '#FF7F00',
        info: '#1E90FF',
      },
    },
  },
  plugins: [],
}
