/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./docs/**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        "principal": [ "Roboto Mono", "monospace"]
      },                   
    },
  },
  plugins: [],
}