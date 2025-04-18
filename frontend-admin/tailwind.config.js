/** @type {import('tailwindcss').Config} */
import PrimeUI from 'tailwindcss-primeui';

module.exports = {
  important: true,
  darkMode: ['selector', '[class~="dark"]'],
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      backgroundColor: {
        'container-background': '#121212',
        'card-background': '#1E1E1E',
      },
    },
  },
  plugins: [PrimeUI]
}

