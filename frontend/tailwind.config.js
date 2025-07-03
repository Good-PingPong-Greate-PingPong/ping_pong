/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,ts,css}",
  ],
  theme: {
    extend: {
      colors: {
        mainColor: '#302C2C',
        backgroundColor: '#F4F4F4',
      }
    },
  },
  plugins: [],
}