/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          ivory: '#F7F3EB',       // Primary Background
          beige: '#EDE5D9',       // Secondary Background
          charcoal: '#292722',    // Primary Text & Dark Sections
          taupe: '#777166',       // Secondary Text
          gold: '#A58A61',        // Accent Antique Gold
          'gold-hover': '#8C734F',// Accent Hover
          'gold-light': '#F2ECE2',// Subtle Gold Tint
          border: '#DED6CA',      // Warm Grey Borders
          card: '#FFFDFA',        // Off White Cards
          'dark-card': '#201E1B', // Dark Section Cards
          'dark-border': '#3D3933'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(41, 39, 34, 0.05)',
        'elevated': '0 12px 36px -4px rgba(41, 39, 34, 0.08)',
        'gold': '0 4px 20px rgba(165, 138, 97, 0.18)',
      }
    },
  },
  plugins: [],
}
