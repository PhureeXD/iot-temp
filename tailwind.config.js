/** @type {import('tailwindcss').Config} */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

export default {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      keyframes: {
        'fade-in': { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        'pulse-alert': {
          '0%,100%': { transform: 'scale(1)', opacity: 1 },
          '50%': { transform: 'scale(1.02)', opacity: 0.6 }
        },
        'bounce-slow': {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6%)' }
        },
        'spin-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        'talk': {
          '0%,100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' }
        }
        , 'slide-in-right': {
          '0%': { opacity: 0, transform: 'translateX(40px) scale(.95)' },
          '100%': { opacity: 1, transform: 'translateX(0) scale(1)' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.4s ease-in-out',
        'pulse-alert': 'pulse-alert 1.2s ease-in-out infinite',
        'bounce-slow': 'bounce-slow 2.4s ease-in-out infinite',
        'spin-slow': 'spin-slow 8s linear infinite',
        'talk': 'talk .55s ease-in-out infinite',
        'slide-in-right': 'slide-in-right .35s ease-out'
      }
    },
  },
  plugins: [require('@tailwindcss/forms')]
};
