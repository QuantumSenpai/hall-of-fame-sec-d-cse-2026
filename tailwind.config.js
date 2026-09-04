/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        paper: {
          light: '#F8F4EA',
          DEFAULT: '#EFE6CA', // Warm Ivory
          dark: '#E2D5B5',
          aged: '#D5C4A1',
        },
        gold: {
          light: '#D4AF77',
          DEFAULT: '#B9905A', // Antique Gold
          dark: '#936E3B',
        },
        terracotta: {
          light: '#D07E66',
          DEFAULT: '#B95F46', // Terracotta
          dark: '#93442F',
        },
        mutedblue: {
          light: '#5D8088',
          DEFAULT: '#44636A', // Muted Blue
          dark: '#2E4950',
        },
        charcoal: {
          light: '#3D423F',
          DEFAULT: '#292D2B', // Charcoal
          dark: '#1A1D1B',
          deep: '#121413',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Bodoni Moda"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        handwritten: ['"Caveat"', '"Dancing Script"', 'cursive'],
      },
      boxShadow: {
        'book': '0 20px 50px -10px rgba(0, 0, 0, 0.5), 0 0 30px rgba(185, 144, 90, 0.15)',
        'polaroid': '0 10px 30px -5px rgba(0, 0, 0, 0.3), 0 2px 6px rgba(0, 0, 0, 0.15)',
        'vintage': '0 4px 20px rgba(0, 0, 0, 0.25), inset 0 0 15px rgba(0, 0, 0, 0.05)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
        glow: {
          '0%': { boxShadow: '0 0 10px rgba(185, 144, 90, 0.3)' },
          '100%': { boxShadow: '0 0 35px rgba(185, 144, 90, 0.8), 0 0 60px rgba(185, 95, 70, 0.4)' },
        },
      },
    },
  },
  plugins: [],
};
