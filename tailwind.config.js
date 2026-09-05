/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        darkBase: {
          DEFAULT: '#0D0B08',
          surface: '#16130E',
          card: '#1C1813',
          border: 'rgba(201, 160, 92, 0.2)',
        },
        cream: {
          light: '#FAF5EA',
          DEFAULT: '#F5EFE1',
          dim: '#D5CCA8',
        },
        gold: {
          light: '#E2BF7D',
          DEFAULT: '#C9A05C',
          dark: '#A67F3D',
          saturated: '#D4AF6A',
          dim: 'rgba(201, 160, 92, 0.35)',
        },
        burgundy: {
          light: '#7D2E41',
          DEFAULT: '#5C1F2E',
          dark: '#3D121D',
        },
        emerald: {
          light: '#2B6654',
          DEFAULT: '#1F4A3D',
          dark: '#133027',
        },
        paper: '#F5EFE1',
        parchment: '#EFE6CA',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        handwritten: ['"Caveat"', 'cursive'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'dot-drift': 'dotDrift 30s linear infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        dotDrift: {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '40px 40px' },
        },
      },
    },
  },
  plugins: [],
};
