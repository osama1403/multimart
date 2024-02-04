/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#ea3c12'
      },
      fontFamily: {
        "nunito": ['Nunito', 'sans-serif']
    }
    },
  },
  plugins: [],
}

