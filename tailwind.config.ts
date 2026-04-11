import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        border: 'rgba(255, 255, 255, 0.08)',
        input: 'rgba(255, 255, 255, 0.12)',
        ring: '#b8ff47',
        background: '#050510',
        foreground: '#ffffff',
        primary: {
          DEFAULT: '#b8ff47',
          foreground: '#050510',
        },
        secondary: {
          DEFAULT: '#4af7ff',
          foreground: '#050510',
        },
        accent: {
          DEFAULT: '#b8ff47',
          foreground: '#050510',
        },
        card: {
          DEFAULT: 'rgba(255, 255, 255, 0.04)',
          foreground: '#ffffff',
        },
        space: {
          black: '#050510',
          dark: '#07070f',
        },
        lime: {
          DEFAULT: '#b8ff47',
          glow: 'rgba(184, 255, 71, 0.45)',
        },
        cyan: {
          DEFAULT: '#4af7ff',
        }
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        lg: '16px',
        md: '10px',
        sm: '8px',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'shake': 'shake 0.4s ease-in-out',
        'slide-up': 'slide-up 0.5s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(184, 255, 71, 0.3)' },
          '50%': { boxShadow: '0 0 25px rgba(184, 255, 71, 0.7)' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '75%': { transform: 'translateX(5px)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      },
    },
  },
  plugins: [],
}

export default config
