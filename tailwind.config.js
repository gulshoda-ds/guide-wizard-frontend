/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        coral: {
          50: '#fff5f2',
          100: '#ffe8e0',
          200: '#ffc9b5',
          300: '#ffa07a',
          400: '#ff7a52',
          500: '#f05a2e',
          600: '#d44520',
          700: '#b03416',
          800: '#8c280f',
          900: '#6b1e0b',
        },
        teal: {
          50: '#f0fafa',
          100: '#d0f0f0',
          200: '#a0e0e0',
          300: '#60c8c8',
          400: '#30b0b0',
          500: '#0e9494',
          600: '#0a7878',
          700: '#085f5f',
          800: '#064848',
          900: '#043535',
        },
        sand: {
          50: '#fdfaf5',
          100: '#faf3e8',
          200: '#f4e4cc',
          300: '#eccfaa',
          400: '#e0b582',
          500: '#d09a5e',
          600: '#b8803f',
          700: '#956530',
          800: '#724d25',
          900: '#543819',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'bounce-gentle': 'bounceGentle 0.6s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        bounceGentle: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '60%': { transform: 'scale(1.05)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
    },
  },
  plugins: [],
};
