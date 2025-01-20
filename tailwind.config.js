/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          dark: '#0A0908',    // Black
          main: '#22333B',    // Gunmetal
          light: '#5E503F',   // Walnut Brown
          accent: '#C6AC8F',  // Khaki
          highlight: '#EAE0D5' // Almond
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
    },
  },
  plugins: [],
};