/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        cinematic: {
          950: '#070404',
          900: '#0D0608',
          800: '#120709',
          700: '#1A0C0C',
          600: '#250D0D',
          500: '#3D1515',
        },
        gold: {
          light: '#E2C27E',
          DEFAULT: '#C9A463',
          dark: '#A0793A',
          dim: '#8B6535',
        },
        ivory: {
          light: '#F8F0E3',
          DEFAULT: '#F2E8D5',
          muted: '#C4B49A',
          dim: '#8B7355',
        },
        wine: {
          light: '#4A1818',
          DEFAULT: '#3D1515',
          dark: '#250D0D',
        },
        paper: '#EDE0C8',
        parchment: '#F5ECD8',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        handwritten: ['"Caveat"', 'cursive'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'petal-fall': 'petalFall 8s ease-in infinite',
        'pulse-gold': 'pulseGold 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite alternate',
        'scroll-dot': 'scrollDot 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-1deg)' },
          '50%': { transform: 'translateY(-18px) rotate(0.5deg)' },
        },
        petalFall: {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '0.9' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
        },
        pulseGold: {
          '0%, 100%': { textShadow: '0 0 20px rgba(201, 164, 99, 0.3)' },
          '50%': { textShadow: '0 0 40px rgba(201, 164, 99, 0.8)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        glowPulse: {
          '0%': { boxShadow: '0 0 15px rgba(201, 164, 99, 0.3), 0 0 30px rgba(201, 164, 99, 0.1)' },
          '100%': { boxShadow: '0 0 30px rgba(201, 164, 99, 0.6), 0 0 60px rgba(201, 164, 99, 0.3)' },
        },
        scrollDot: {
          '0%': { transform: 'translateY(0)', opacity: '1' },
          '100%': { transform: 'translateY(10px)', opacity: '0' },
        },
      },
      backgroundImage: {
        'vignette': 'radial-gradient(ellipse at center, transparent 40%, rgba(7,4,4,0.8) 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent 0%, rgba(201,164,99,0.4) 50%, transparent 100%)',
      },
    },
  },
  plugins: [],
};
