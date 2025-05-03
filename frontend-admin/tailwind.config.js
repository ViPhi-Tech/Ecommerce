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
        'muted': 'hsl(210 40% 96.1%)',
      },
      height: {
        'screen-without-header': 'calc(100vh - 64px)',
      },
      textColor: {
        'muted-foreground': 'rgb(100 116 139)',

      },
    },
  },
  plugins: [PrimeUI, require('tw-bootstrap-grid-optimizer')]
}

