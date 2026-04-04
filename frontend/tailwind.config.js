/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#6366f1',
          'primary-hover': '#4f46e5',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        note: {
          white: '#ffffff',
          yellow: '#fefce8',
          green: '#f0fdf4',
          blue: '#eff6ff',
          pink: '#fdf2f8',
          purple: '#faf5ff',
          orange: '#fff7ed',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Plus Jakarta Sans', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
      },
      keyframes: {
        slideUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
      },
      boxShadow: {
        glow: '0 0 20px -5px rgb(99 102 241 / 0.3)',
      },
    },
  },
  plugins: [],
};
