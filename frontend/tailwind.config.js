/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        funverse: {
          bg: '#0B1026',
          card: '#131838',
          cardHover: '#1B224C',
          glass: 'rgba(19, 24, 56, 0.75)',
          purple: '#7C3AED',
          pink: '#EC4899',
          cyan: '#06B6D4',
          yellow: '#FACC15',
          green: '#22C55E',
          red: '#EF4444'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        gaming: ['Outfit', 'sans-serif']
      },
      boxShadow: {
        'neon-purple': '0 0 20px -3px rgba(124, 58, 237, 0.5)',
        'neon-pink': '0 0 20px -3px rgba(236, 72, 153, 0.5)',
        'neon-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 3s ease-in-out infinite'
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: 0.9, filter: 'drop-shadow(0 0 12px rgba(124, 58, 237, 0.6))' },
          '50%': { opacity: 1, filter: 'drop-shadow(0 0 22px rgba(236, 72, 153, 0.8))' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' }
        }
      }
    }
  },
  plugins: []
};
